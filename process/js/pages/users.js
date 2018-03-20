$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};

    $('#sel2Roles').select2({
        placeholder: 'Selecione o Departamento',
        language: "pt-BR",
        // tags: true,
        ajax: {
            url: '/users/roles',
            dataType: 'json',
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.roleId;
                    o.name = v.roleName;
                    o.value = v.roleId;
                    results.push(o);
                });

                return {
                    results: results
                };
            },
            cache: true
        },
        minimumResultsForSearch: Infinity,
        // tokenSeparators: [",", " "],
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function format(repo) {
            if (repo.loading) return repo.text;
            let markup = '<option value="' + repo.value + '">' + repo.name + '</option>'
            return markup;
        },
        templateSelection: function (roles) {
            return roles.name || roles.text;
        }
    });

    $('#btnSaveUser').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);
        $this.prop('disabled', true);

        let params = {
            portalId: 0,
            userId: my.userId,
            displayName: $('#inputName').val().trim(),
            email: $('#inputEmail').val().trim(),
            roleId: $('#sel2Roles').select2('data')[0].id,
            password: $('#inputPassword').val().trim(),
            createdByUser: userInfo.userId,
            createdOnDate: moment().format('YYYY-MM-DD HH:mm'),
            modifiedByUser: userInfo.userId,
            modifiedOnDate: moment().format('YYYY-MM-DD HH:mm')
        };

        $.ajax({
            type: my.userId ? 'PUT' : 'POST',
            url: '/users/user',
            data: params
        }).done(function (data) {
            if (!data.error) {

                let msg = '';
                if (my.userId == 0) {
                    msg = 'Cadastro inserido.';
                } else {
                    msg = 'Cadastro atualizado.';
                }

                swal({
                    title: "Sucesso!",
                    text: msg,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    timer: 2000
                }).then(
                    function () {
                        $('#myModal').modal('hide');
                    },
                    // handling the promise rejection
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    }
                );
            }
            $this.prop('disabled', false);
            $('#inputName').val('');
            $('#inputEmail').val('');
            $('#inputPassword').val('');
            $('#inputConfirmPassword').val('');
            $('#sel2Roles').val(null).trigger('change');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    let updatingUser;

    jsGrid.locale(["pt-br"]);

    $("#jsGrid").jsGrid({
        width: '100%',
        height: 'auto',
        autoload: true,
        confirmDeleting: true,
        paging: false,
        pageSize: 10,
        pageButtonCount: 5,
        inserting: false,
        editing: false,
        sorting: true,
        // data: data, // an array of data
        ajaxGridOptions: {
            cache: false
        },
        controller: {
            loadData: function (filter) {
                var def = $.Deferred();
                $.ajax({
                    url: '/users',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingUser) {
                $.ajax({
                    type: 'DELETE',
                    url: '/users/user',
                    data: {
                        userId: deletingUser.userId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Usuário excluido.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {},
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            }
        },
        deleteConfirm: function (item) {
            return "O usuário \"" + item.displayName + "\" será removido. Deseja continuar?";
        },
        editItem: function (item) {
            let $row = this.rowByItem(item);
            if ($row.length) {

                my.userId = item.userId;
                $('#inputName').val(item.displayName);
                $('#inputEmail').val(item.email);
                if (item.roleId)
                    $('#sel2Roles').append('<option value="' + item.roleId + '" selected>' + item.userRoleName + '</option>')

                $('#myModal').modal('show');

                updatingUser = item;
                this._editRow($row);
            }
        },
        fields: [{
                title: "Usuário",
                name: "displayName",
                type: "text",
                width: 150
            },
            {
                title: "Email / Login",
                name: "email",
                type: "text",
                width: 150
            },
            {
                name: "userRoleName",
                title: "Departamento",
                type: "text"
            },
            {
                type: "control",
                headerTemplate: function () {
                    return $("<button>").attr("type", "button").text("Adicionar")
                        .on("click", function () {
                            $('#myModal').modal('show');
                        });
                }
            }
        ]
    });

});