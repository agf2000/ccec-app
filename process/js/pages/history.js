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
                type: "control"
            }
        ]
    });

    jsGrid.locale("pt-br");

});