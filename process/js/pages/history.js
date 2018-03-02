$(function () {

    $("#jsGrid").jsGrid({
        width: '100%',
        height: 'auto',
        autoload: true,
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
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            }
        },
        fields: [{
                title: "Sim",
                name: "sent",
                type: "number",
                width: 30
            },
            {
                title: "Não",
                name: "notSent",
                type: "number",
                width: 30
            },
            {
                title: "Log",
                name: "sentLog",
                type: "text",
                width: 200
            },
            {
                title: "Data",
                name: "createdOnDate",
                type: "date",
                width: 50
            }
        ]
    });

    jsGrid.locale("pt-br");

});