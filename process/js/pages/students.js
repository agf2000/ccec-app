$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.studentId = 0;

    kendo.culture("pt-BR");
    kendo.culture().calendar.firstDay = 1

    $('#sel2StudentFilter').select2({
        width: 'resolve'
    });

    $('#sel2FatherFilter').select2({
        width: 'resolve'
    });

    $('#sel2MotherFilter').select2({
        width: 'resolve'
    });

    var grades = [{
            id: 0,
            text: 'Selecionar',
            selected: true
        },
        {
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

    var shifts = [{
            id: 0,
            text: 'Selecionar',
            selected: true
        },
        {
            id: 'Manhã',
            text: 'Manhã'
        },
        {
            id: 'Tarde',
            text: 'Tarde'
        },
        {
            id: 'Noite',
            text: 'Noite'
        }
    ];

    $('#sel2Shifts').select2({
        placeholder: 'Selecione o turno',
        language: "pt-BR",
        data: shifts,
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

    let openFlag = true;

    $('#inputStudentBDay').kendoDatePicker({
        depth: "month",
        start: "day",
        format: "dd MMMM",
        parseFormat: "dd MMMM",
        animation: false,
        footer: "#: kendo.toString(data, 'm') #",
        value: new Date(),
        open: function (e) {
            var dp = e.sender;
            var calendar = dp.dateView.calendar;

            if (openFlag) {
                calendar.setOptions({
                    animation: false
                });
                openFlag = false;
                calendar.navigateUp();
            }


            if (calendar.view().name === "year") {
                calendar.element.find(".k-header").css("display", "none");
            };
            calendar.bind("navigate", function (e) {
                var cal = e.sender;
                var view = cal.view();

                if (view.name === "year") {
                    cal.element.find(".k-header").css("display", "none");
                } else {
                    var navFast = $(".k-nav-fast");

                    var dsa = cal.element.find(".k-header").css("display", "block");
                    navFast[0].innerText = navFast[0].innerText.slice(0, -5);
                }

            });
        },
        close: function (e) {
            var calendar = e.sender.dateView.calendar;

            calendar.unbind("navigate");
            calendar.element.find(".k-header").css("display", "block");
        }
    });

    $('#inputFatherBDay').kendoDatePicker({
        depth: "month",
        start: "day",
        format: "dd MMMM",
        parseFormat: "dd MMMM",
        animation: false,
        footer: "#: kendo.toString(data, 'm') #",
        value: new Date(),
        open: function (e) {
            var dp = e.sender;
            var calendar = dp.dateView.calendar;

            if (openFlag) {
                calendar.setOptions({
                    animation: false
                });
                openFlag = false;
                calendar.navigateUp();
            }


            if (calendar.view().name === "year") {
                calendar.element.find(".k-header").css("display", "none");
            };
            calendar.bind("navigate", function (e) {
                var cal = e.sender;
                var view = cal.view();

                if (view.name === "year") {
                    cal.element.find(".k-header").css("display", "none");
                } else {
                    var navFast = $(".k-nav-fast");

                    var dsa = cal.element.find(".k-header").css("display", "block");
                    navFast[0].innerText = navFast[0].innerText.slice(0, -5);
                }

            });
        },
        close: function (e) {
            var calendar = e.sender.dateView.calendar;

            calendar.unbind("navigate");
            calendar.element.find(".k-header").css("display", "block");
        }
    });

    $('#inputMotherBDay').kendoDatePicker({
        depth: "month",
        start: "day",
        format: "dd MMMM",
        parseFormat: "dd MMMM",
        animation: false,
        footer: "#: kendo.toString(data, 'm') #",
        value: new Date(),
        open: function (e) {
            var dp = e.sender;
            var calendar = dp.dateView.calendar;

            if (openFlag) {
                calendar.setOptions({
                    animation: false
                });
                openFlag = false;
                calendar.navigateUp();
            }


            if (calendar.view().name === "year") {
                calendar.element.find(".k-header").css("display", "none");
            };
            calendar.bind("navigate", function (e) {
                var cal = e.sender;
                var view = cal.view();

                if (view.name === "year") {
                    cal.element.find(".k-header").css("display", "none");
                } else {
                    var navFast = $(".k-nav-fast");

                    var dsa = cal.element.find(".k-header").css("display", "block");
                    navFast[0].innerText = navFast[0].innerText.slice(0, -5);
                }

            });
        },
        close: function (e) {
            var calendar = e.sender.dateView.calendar;

            calendar.unbind("navigate");
            calendar.element.find(".k-header").css("display", "block");
        }
    });

    $('#btnSaveStudent').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let shift = ($('#sel2Shifts').select2('data')[0].name || $('#sel2Shifts').select2('data')[0].text),
            grade = ($('#sel2Grades').select2('data')[0].name || $('#sel2Grades').select2('data')[0].text);

        let params = {
            studentId: my.studentId,
            portalId: 0,
            studentName: $('#inputStudentName').val().trim(),
            studentCode: $('#inputStudentCode').val().trim(),
            studentEmail: $('#inputStudentEmail').val().trim() || '',
            studentGrade: ($('#sel2Grades').val().length > 1 ? grade || '' : ''),
            studentShift: ($('#sel2Shifts').val().length > 1 ? shift || '' : ''),
            studentBDay: ($('#inputStudentBDay').val() ? moment($('#inputStudentBDay').data('kendoDatePicker').value()).format('YYYY-MM-DD') : null),
            fatherName: $('#inputFatherName').val().trim() || '',
            fatherEmail: $('#inputFatherEmail').val().trim() || '',
            fatherBDay: ($('#inputFatherBDay').val() ? moment($('#inputFatherBDay').data('kendoDatePicker').value()).format('YYYY-MM-DD') : null),
            motherName: $('#inputMotherName').val().trim() || '',
            motherEmail: $('#inputMotherEmail').val().trim() || '',
            motherBDay: ($('#inputMotherBDay').val() ? moment($('#inputMotherBDay').data('kendoDatePicker').value()).format('YYYY-MM-DD') : null),
            createdByUser: userInfo.userId,
            modifiedByUser: userInfo.userId
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
                                studentShift: data.studentShift,
                                studentBDay: data.studentBDay,
                                studentEmail: data.studentEmail,
                                fatherName: data.fatherName,
                                fatherEmail: data.fatherEmail,
                                fatherBDay: data.fatherBDay,
                                motherName: data.motherName,
                                motherEmail: data.motherEmail,
                            }
                        } else {
                            $.extend(updatingStudent, {
                                studentName: $('#inputStudentName').val(),
                                studentCode: $('#inputStudentCode').val(),
                                studentEmail: $('#inputStudentEmail').val(),
                                studentBDay: $('#inputStudentBDay').data('kendoDatePicker').value(),
                                fatherName: $('#inputFatherName').val(),
                                fatherEmail: $('#inputFatherEmail').val(),
                                fatherBDay: $('#inputFatherBDay').data('kendoDatePicker').value(),
                                motherName: $('#inputMotherName').val(),
                                motherEmail: $('#inputMotherEmail').val(),
                                motherBDay: $('#inputMotherBDay').data('kendoDatePicker').value(),
                                studentGrade: ($('#sel2Grades').val().length > 1 ? grade || '' : ''),
                                studentShift: ($('#sel2Shifts').val().length > 1 ? shift || '' : '')
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
        pageLoading: false,
        confirmDeleting: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 5,
        inserting: false,
        editing: false,
        sorting: true,
        filtering: true,
        // data: data, // an array of data
        ajaxGridOptions: {
            cache: false
        },
        controller: {
            loadData: function (filter) {
                var def = $.Deferred();
                if ($('#sel2StudentFilter').val())
                    filter.studentFilter = $('#sel2StudentFilter').val();
                if ($('#sel2FatherFilter').val())
                    filter.fatherFilter = $('#sel2FatherFilter').val();
                if ($('#sel2StudentFilter').val())
                    filter.motherFilter = $('#sel2MotherFilter').val();
                $.ajax({
                    url: '/api/students',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: filter
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
                $('#inputStudentEmail').val(item.studentEmail);
                $('#inputStudentBDay').data('kendoDatePicker').value(item.studentBDay);
                $('#inputFatherName').val(item.fatherName);
                $('#inputFatherEmail').val(item.fatherEmail);
                $('#inputFatherBDay').data('kendoDatePicker').value(item.fatherBDay);
                $('#inputMotherName').val(item.motherName);
                $('#inputMotherEmail').val(item.motherEmail);
                $('#inputMotherBDay').data('kendoDatePicker').value(item.motherBDay);

                if (item.studentGrade) {
                    $('#sel2Grades').append($('<option value="' + item.studentGrade + '" selected>' + item.studentGrade + '</option>'));
                    $("#sel2Grades").trigger("change");
                }

                if (item.studentShift) {
                    $('#sel2Shifts').append($('<option value="' + item.studentShift + '" selected>' + item.studentShift + '</option>'));
                    $("#sel2Shifts").trigger("change");
                }

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
            }, {
                title: "Aluno",
                name: "studentName",
                type: "text"
            }, {
                name: "studentGrade",
                title: "Série",
                type: "select",
                width: 50,
                items: grades,
                valueField: "text",
                textField: "text",
                filterTemplate: function () {
                    let $select = jsGrid.fields.select.prototype.filterTemplate.call(this);
                    // $select.prepend($("<option>").prop("value", "0").text("Todos"));
                    return $select;
                }
            }, {
                name: "studentShift",
                title: "Turno",
                type: "select",
                width: 50,
                items: shifts,
                valueField: "text",
                textField: "text",
                filterTemplate: function () {
                    let $select = jsGrid.fields.select.prototype.filterTemplate.call(this);
                    // $select.prepend($("<option>").prop("value", "0").text("Todos"));
                    return $select;
                }
            }, {
                name: "studentEmail",
                title: "Email do Aluno",
                type: "text"
            }, {
                name: "studentBDay",
                visible: false
            }, {
                name: "fatherName",
                title: "Pai",
                type: "text",
                visible: false
            }, {
                name: "fatherEmail",
                title: "Email do Pai",
                type: "text",
                visible: false
            }, {
                name: "fatherBDay",
                visible: false
            }, {
                name: "motherName",
                title: "Mãe",
                type: "text",
                visible: false
            }, {
                name: "motherEmail",
                title: "Email da Mãe",
                type: "text",
                visible: false
            }, {
                name: "motherBDay",
                visible: false
            },
            {
                type: "control"
            }
        ]
    });

    $('#btnApplyFilter').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $("#jsGrid").jsGrid("loadData");
    });
});

function format(value, pattern) {
    var i = 0,
        v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}