$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.templateId = null;
    my.filesAttached = false;

    $('#sel2Students').select2({
        placeholder: 'Todos alunos',
        language: {
            locale: "pt-BR",
            // You can find all of the options in the language files provided in the
            // build. They all must be functions that return the string that should be
            // displayed.
            inputTooShort: function () {
                return "Digite * pra ver todos...";
            }
        },
        ajax: {
            url: '/api/studentsMailingList',
            dataType: 'json',
            data: function (params) {
                return {
                    term: params.term,
                    studentGrade: JSON.stringify($('#sel2Grades').val()),
                    studentShift: JSON.stringify($('#sel2Shifts').val()),
                    students: $('#chkBoxStudents').is(':checked'),
                    fathers: $('#chkBoxFathers').is(':checked'),
                    mothers: $('#chkBoxMothers').is(':checked'),
                    studentId: 0
                }
            },
            processResults: function (data, page) {

                let results = [];

                $.each(data.students.response.students, function (i, v) {
                    let o = {};
                    o.id = v.studentId;
                    o.name = v.name;
                    o.value = v.studentId;
                    results.push(o);
                });

                return {
                    results: results
                };
            },
            cache: true
        },
        dropdownAutoWidth: true,
        minimumInputLength: 1,
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

    var grades = [{
            id: '0',
            text: "Todas",
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
        placeholder: 'Selecionar',
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
            id: '0',
            text: "Todos",
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
        placeholder: 'Selecionar',
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

    $('#sel2EmailTemplates').select2({
        placeholder: 'Tipos de Correspondências',
        language: "pt-BR",
        ajax: {
            url: '/api/emailTemplates',
            dataType: 'json',
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.templateId;
                    o.name = v.templateName;
                    o.value = v.templateId;
                    results.push(o);
                });

                return {
                    results: results
                };
            },
            cache: true
        },
        minimumResultsForSearch: Infinity,
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

    $('#sel2EmailTemplates').on("select2:select", function (e) {
        if ($('#sel2EmailTemplates').val() !== null) {
            $.getJSON('/api/emailTemplate/' + $('#sel2EmailTemplates').select2('data')[0].id, function (data) {

                // $('#headerPreview').html(data[0].headerTemplate);

                // $('#bodyPreview').html(data[0].bodyTemplate);

                // $('#footerPreview').html(data[0].footerTemplate);

                CKEDITOR.instances.textareaTemplate.setData(data[0].headerTemplate.trim(), function () {
                    this.checkDirty(); // true
                });

                // my.templateId = $('#sel2EmailTemplates').select2('data')[0].id;

            });
        }
    });

    // $('#sel2Regions').append($('<option value="1" selected>Geral</option>'));

    $('#inputDocs').on('change', handleFileSelect);

    $('#btnUploadFiles').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        var formData = new FormData();
        var files = document.getElementById('inputDocs').files;

        $.each(files, function (key, value) {
            formData.append('inputDocs', value);
        });

        var xhr = new XMLHttpRequest();

        xhr.open('post', '/api/uploadDocs', true);

        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentage = ((e.loaded / e.total) * 100) - 10;
                console.log(percentage + "%");
                $('#file-progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage);
            }
        };

        xhr.onerror = function (e) {
            console.log('Error');
            console.log(e);
            $this.prop('disabled', false);
        };

        xhr.onload = function () {
            console.log(this.statusText);
            $('#file-progress-bar').css('width', '100%').attr('aria-valuenow', 100);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var response = JSON.parse(xhr.responseText);
                if (xhr.status === 200 && (response.sponsor || response.success)) {

                    swal({
                        title: "Sucesso!",
                        text: "Arquivo(s) enviado(s).",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        timer: 3000
                    }).then(
                        function () {
                            $this.prop('disabled', false);

                            $('#btnOpenUpload').val('Arquivo(s) enviado(s)!!!');

                            my.filesAttached = true;

                            setTimeout(() => {
                                $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
                            }, 100);

                            $('#filesModal').modal('hide');
                        },
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                console.log('I was closed by the timer')
                            }
                        }
                    );
                } else {
                    console.log('failed');
                    $this.prop('disabled', false);
                }
            }
        };

        xhr.send(formData);
    });

    $('#btnSend').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            term: '*',
            studentGrade: JSON.stringify($('#sel2Grades').val()),
            studentShift: JSON.stringify($('#sel2Shifts').val()),
            students: $('#chkBoxStudents').is(':checked'),
            fathers: $('#chkBoxFathers').is(':checked'),
            mothers: $('#chkBoxMothers').is(':checked'),
            subject: $('#sel2EmailTemplates').select2('data')[0].name,
            content: CKEDITOR.instances.textareaTemplate.getData(), // $('#headerPreview').html() + $('#bodyPreview').html() + $('#footerPreview').html(),
            studentId: $('#sel2Students').val() || 0,
            attachments: my.filesAttached,
            singleAttach: $('#chkSingle').prop('checked')
        }

        swal({
            title: "Info!",
            html: "Transmissão inicializada.<br />Aguarde ou clique em Ok.",
            type: "info",
            showCancelButton: false,
            confirmButtonText: "Ok"
        }).then(
            function () {
                $this.prop('disabled', false);
            },
            // handling the promise rejection
            function (dismiss) {
                if (dismiss === 'timer') {
                    console.log('I was closed by the timer')
                }
            }
        );

        $.ajax({
            type: 'POST',
            url: '/api/sendBulkEmail',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    html: "Correspondêcia(s) enviada.<br />Verifique o histórico de envio para mais informações.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                }).then(
                    function () {},
                    // handling the promise rejection
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            console.log('I was closed by the timer')
                        }
                    }
                );
                $this.prop('disabled', false);
            }

        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    // $(document).ready(function () {
    $(':file').on('fileselect', function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' arquivo(s) selecionado(s)' : label;

        $('#btnOpenUpload').html(log);

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });
    // });

    $('#btnOpenUpload').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $('#filesModal').modal('show');
    });

    $('#btnApply').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.html('Aguarde...');
        $this.prop('disabled', true);

        getStudents();

        $this.html('Aplicar');
        $this.prop('disabled', false);
    });

    CKEDITOR.replace('textareaTemplate');

    $('input[name="sendTo"]').click(function (e) {
        let $this = $(this);
        if (!$('input[name="sendTo"]:checked').length) {
            alert('Favor escolher uma opção');
            $this.prop('checked', true);
        }
    });
});

function getStudents() {
    let params = {
        term: '*',
        studentGrade: JSON.stringify($('#sel2Grades').val()),
        studentShift: JSON.stringify($('#sel2Shifts').val()),
        students: $('#chkBoxStudents').is(':checked'),
        fathers: $('#chkBoxFathers').is(':checked'),
        mothers: $('#chkBoxMothers').is(':checked'),
        studentId: $('#sel2Students').val() || 0
    };
    $.getJSON('/api/studentsMailingList', params, function (data) {
        $('#sel2Students').append(`<option value="0" selected>${data.students.response.students.length} destinatário(s) selecionado</option>`);
    });
};

function handleFileSelect(e) {
    if (!e.target.files) return;

    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
        var f = files[i];

        $('#selectedFiles').html(f.name);
    }
}