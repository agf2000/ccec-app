$(function () {
    userInfo = JSON.parse(userInfo);

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

    // let roles = userInfo.roles.split(',');
    // $.each(roles, function (i, val) {
    //     $('#sel2Roles').append($('<option selected>' + val + '</option>'));
    // });

    $('#sel2Roles').append($('<option value="' + userInfo.roleId + '" selected>' + userInfo.userRoleName + '</option>'))

    $("#sel2Roles").trigger("change");

    $('#btnUpdateUser').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);
        $this.prop('disabled', true);

        // let roles = [];
        // $.each($('#sel2Roles').select2('data'), function (i, role) {
        //     roles.push(role.text || role.name);
        // })

        let params = {
            portalId: 0,
            userId: userInfo.userId,
            displayName: $('#inputName').val().trim(),
            email: $('#inputEmail').val().trim(),
            roleId: $('#sel2Roles').select2('data')[0].id,
            modifiedByUser: userInfo.userId,
            modifiedOnDate: moment().format('YYYY-MM-DD HH:mm')
        };

        $.ajax({
            type: 'PUT',
            url: '/users/user',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Cadastro atualizado.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    timer: 2000
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
            $this.prop('disabled', false);
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    $('#btnAlterPassword').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            portalId: 0,
            userId: userInfo.userId,
            password: $('#inputPassword').val().trim(),
            newPassword: $('#inputNewPassword').val().trim()
        };

        $.ajax({
            type: 'PUT',
            url: '/alterPassword',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Senha atualizada.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    timer: 2000
                }).then(
                    function () {},
                    // handling the promise rejection
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    }
                );
            } else {
                swal({
                    title: "Erro!",
                    text: data.error,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                });
            }
            $this.prop('disabled', false);
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            swal({
                title: "Erro!",
                text: data.jqXHR.statusText,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Ok"
            });
        }).always(function () {
            $('#inputPassword').val('');
            $('#inputNewPassword').val('');
            $('#inputConfirmPassword').val('');
        });
    });
});