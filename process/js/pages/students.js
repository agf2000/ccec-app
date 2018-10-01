$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.studentId = 0;

    var grades = [{
            id: 'Maternal II',
            text: 'Maternal II'
        },
        {
            id: 'Maternal III',
            text: 'Maternal III'
        },
        {
            id: '1° Período',
            text: '1° Período'
        },
        {
            id: '2° Período',
            text: '2° Período'
        },
        {
            id: '1° Ano',
            text: '1° Ano'
        },
        {
            id: '2° Ano',
            text: '2° Ano'
        },
        {
            id: '3° Ano',
            text: '3° Ano'
        },
        {
            id: '4° Ano',
            text: '4° Ano'
        },
        {
            id: '5° Ano',
            text: '5° Ano'
        },
        {
            id: '6° Ano',
            text: '6° Ano'
        },
        {
            id: '7° Ano',
            text: '7° Ano'
        },
        {
            id: '8° Ano',
            text: '8° Ano'
        },
        {
            id: '9° Ano',
            text: '9° Ano'
        },
        {
            id: '1° Série',
            text: '1° Série'
        },
        {
            id: '2° Série',
            text: '2° Série'
        },
        {
            id: '3° Série',
            text: '3° Série'
        }
    ];

    $('#sel2Grades').select2({
        placeholder: 'Selecione a serie',
        language: "pt-BR",
        data: grades,
        minimumResultsForSearch: Infinity,
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function format(repo) {
            if (repo.loading) return repo.text;
            let markup = '<option value="' + repo.id + '">' + repo.text + '</option>'
            return markup;
        },
        templateSelection: function (roles) {
            return roles.name || roles.text;
        }
    });

    $('#btnSaveStudent').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            studentId: my.studentId,
            portalId: 0,
            studentName: $('#inputStudentName').val().trim(),
            studentCode: $('#inputStudentCode').val().trim(),
            studentGrade: ($('#sel2Grades').select2('data')[0].name || $('#sel2Grades').select2('data')[0].text),
            fatherName: $('#inputFatherName').val().trim(),
            fatherEmail: $('#inputFatherEmail').val(),
            motherName: $('#inputMotherName').val().trim(),
            motherEmail: $('#inputMotherEmail').val(),
            createdByUser: userInfo.userId
        };

        $.ajax({
            type: (e.currentTarget.value == 'post' ? 'POST' : 'PUT'),
            url: '/api/student',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: `Aluno ${(my.studentId ? "atualizado" : "inserido.")}`,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    timer: 2000
                }).then(
                    function () {

                        let student = {};
                        if (!my.studentId) {
                            student = {
                                studentId: data.studentId,
                                studentName: data.studentName,
                                studentCode: data.studentCode,
                                studentGrade: data.studentGrade,
                                fatherName: data.fatherName,
                                fatherEmail: data.fatherEmail,
                                motherName: data.motherName,
                                motherEmail: data.motherEmail,
                            }
                        } else {
                            $.extend(updatingStudent, {
                                studentName: $('#inputStudentName').val(),
                                studentCode: $('#inputStudentCode').val(),
                                fatherName: $('#inputFatherName').val(),
                                fatherEmail: $('#inputFatherEmail').val(),
                                motherName: $('#inputMotherName').val(),
                                motherEmail: $('#inputMotherEmail').val(),
                                studentGrade: $('#sel2Grades').select2('data')[0].id + ':' + ($('#sel2Grades').select2('data')[0].name || $('#sel2Grades').select2('data')[0].text),
                            });

                            $("#jsGrid").jsGrid("updateItem", updatingStudent);

                            $("#jsGrid").jsGrid('refresh');

                            $('.panel-collapse.in').collapse('toggle');
                        }

                        if (!my.studentId) {
                            $("#jsGrid").jsGrid("insertItem", student);
                        }

                        $this.prop('disabled', false);
                        $('form')[0].reset();
                        $('#btnSaveStudent').val('post');
                        $('#sel2Grades').val(null).trigger('change');
                        my.studentId = 0;
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
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    let updatingStudent;

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
                    url: '/api/students',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingStudent) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/student',
                    data: {
                        studentId: deletingStudent.studentId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Aluno excluido.",
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
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            }
        },
        deleteConfirm: function (item) {
            return "O aluno \"" + item.Name + "\" será removido. Deseja continuar?";
        },
        editItem: function (item) {
            let $row = this.rowByItem(item);
            if ($row.length) {
                // console.log('$row: ' + JSON.stringify($row)); // I modify this

                my.studentId = item.studentId;

                $('#inputStudentName').val(item.studentName);
                $('#inputStudentCode').val(item.studentCode);
                $('#inputFatherName').val(item.fatherName);
                $('#inputFatherEmail').val(item.fatherEmail);
                $('#inputMotherName').val(item.motherName);
                $('#inputMotherEmail').val(item.motherEmail);

                $('#sel2Grades').append($('<option value="' + item.studentGrade + '" selected>' + item.studentGrade + '</option>'));
                $("#sel2Grades").trigger("change");

                $('#btnSaveStudent').val('put');
                updatingStudent = item;
                $('.panel-collapse').collapse('show');
                $.scrollTo($('.main-header'), 1000, {
                    easing: 'swing'
                });

                this._editRow($row);
            }
        },
        fields: [{
                name: "studentCode",
                title: "Matrícula",
                type: "text",
                width: 50
            },
            {
                title: "Aluno",
                name: "studentName",
                type: "text"
            },
            {
                name: "studentGrade",
                title: "Série",
                type: "text",
                width: 50
            }, {
                name: "fatherName",
                title: "Pai",
                type: "text"
            }, {
                name: "fatherEmail",
                title: "Email do Pai",
                type: "text"
            }, {
                name: "motherName",
                title: "Mãe",
                type: "text"
            }, {
                name: "motherEmail",
                title: "Email da Mãe",
                type: "text"
            },
            {
                type: "control"
            }
        ]
    });
});

function format(value, pattern) {
    var i = 0,
        v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}