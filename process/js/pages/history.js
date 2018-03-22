$(function () {

    jsGrid.locale(["pt-br"]);

    $("#jsGrid").jsGrid({
        width: '100%',
        height: 'auto',
        autoload: true,
        filtering: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 5,
        inserting: false,
        editing: false,
        sorting: true,
        // data: data, // an array of data
        ajaxGridOptions: {
            cache: false
        },
        confirmDeleting: false,
        onItemDeleting: function (args) {
            args.cancel = true; // cancel deleting
            swal({
                title: 'Remover histórico ' + args.item.sentLogId + ' ?',
                text: "Esta ação não pode ser revertida!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Sim, remover!'
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        type: "DELETE",
                        url: '/api/history?sentLogId=' + args.item.sentLogId
                    }).done(function (result) {
                        // console.log(item);
                        if (!result.error) {
                            $('#jsGrid').jsGrid('deleteItem', args.item); //call deleting once more in callback
                            swal({
                                type: 'success',
                                title: 'categoria removida',
                                showConfirmButton: false,
                                timer: 2000
                            });
                        } else {
                            swal(
                                'Erro!',
                                result.error,
                                'error'
                            );
                        }
                    });
                }
            });
        },
        controller: {
            loadData: function (filter) {
                var def = $.Deferred();
                $.ajax({
                    url: '/api/histories',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: filter
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            }
        },
        fields: [{
                title: "",
                name: "sentLogId",
                type: "number",
                width: 10,
                filtering: false
            },
            {
                title: "Enviado",
                name: "sent",
                type: "checkbox",
                width: 30,
                sorting: false,
                itemTemplate: function (item) {
                    return item ? 'Sim' : 'Nao'
                }
            },
            {
                title: "Email",
                name: "toEmail",
                type: "text"
            },
            {
                title: "Detinatário",
                name: "toWhom",
                type: "text"
            },
            {
                title: "Assunto",
                name: "subject",
                type: "text"
            },
            {
                title: "Data",
                name: "sentOnDate",
                type: "date",
                width: 50,
                itemTemplate: function (val) {
                    return moment(val).format('L')
                }
            },
            {
                type: "control",
                editButton: false,
                headerTemplate: function () {
                    return $("<button>").attr("class", "btn btn-danger").text("Remover")
                        .on("click", function () {
                            swal({
                                title: 'Remover todo o histórico?',
                                text: "Esta ação pode ser revertida!",
                                type: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Sim, remover!'
                            }).then((result) => {
                                if (result.value) {
                                    $.ajax({
                                        url: '/api/histories',
                                        type: "DELETE",
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        data: filter
                                    }).done(function (result) {
                                        // console.log(item);
                                        swal({
                                            type: 'success',
                                            title: 'Histórico removido',
                                            showConfirmButton: false,
                                            timer: 2000
                                        });
                                    });
                                }
                            });
                        });
                }
            }
        ]
    });
});