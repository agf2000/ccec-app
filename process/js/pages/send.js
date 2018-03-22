$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.templateId = null;
    my.filesAttached = false;

    $('#sel2Recipients').select2({
        placeholder: 'Todos destinatários',
        language: "pt-BR",
        ajax: {
            url: '/api/recipientsMailingList',
            dataType: 'json',
            data: function (params) {
                return {
                    term: params.term,
                    categoryId: $('#sel2Categories').val() || "''",
                    regionId: $('#sel2Regions').val() || "''",
                    groupId: $('#sel2Groups').val() || "''",
                    cityId: $('#sel2Cities').val() || "''",
                    stateId: $('#sel2States').val() || "''",
                    recipientId: 0
                }
            },
            processResults: function (data, page) {

                let results = [];

                $.each(data.recipients.response.recipients, function (i, v) {
                    let o = {};
                    o.id = v.recipientId;
                    o.name = v.recipientName;
                    o.value = v.recipientId;
                    results.push(o);
                });

                return {
                    results: results
                };
            },
            cache: true
        },
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

    $('#sel2Groups').select2({
        placeholder: 'Selecionar',
        language: "pt-BR",
        allowClear: true,
        ajax: {
            url: '/api/groups',
            dataType: 'json',
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.groupId;
                    o.name = v.groupName;
                    o.value = v.groupId;
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

    $('#sel2Groups').on("select2:select select2:unselect", function (e) {
        // if ($('#sel2Groups').val() !== null) {
        setTimeout(function () {
            getRecipients();
        }, 500);
        // }
    });

    $('#sel2Categories').select2({
        placeholder: 'Selecionar',
        language: "pt-BR",
        allowClear: true,
        ajax: {
            url: '/api/categories',
            dataType: 'json',
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.categoryId;
                    o.name = v.categoryName;
                    o.value = v.categoryId;
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

    $('#sel2Categories').on("select2:select select2:unselect", function (e) {
        // if ($('#sel2Categories').val() !== null) {
        setTimeout(function () {
            getRecipients();
        }, 500);
        // }
    });

    $('#sel2Regions').select2({
        placeholder: 'Selecionar',
        language: "pt-BR",
        allowClear: true,
        ajax: {
            url: '/api/regions',
            dataType: 'json',
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.regionId;
                    o.name = v.regionName;
                    o.value = v.regionId;
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

    $('#sel2Regions').on("select2:select select2:unselect", function (e) {
        // if ($('#sel2Regions').val() !== null) {
        setTimeout(function () {
            getRecipients();
        }, 500);
        // }
    });

    $('#sel2States').select2({
        placeholder: 'Selecione o estado',
        language: "pt-BR",
        allowClear: true,
        ajax: {
            url: '/api/states',
            dataType: 'json',
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.stateId;
                    o.name = v.stateName;
                    o.value = v.stateId;
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

    $('#sel2States').on("select2:select select2:unselect", function (e) {
        if ($('#sel2States').val() !== null) {
            $.getJSON('/api/cities?stateId=' + $('#sel2States').select2('data')[0].id, function (data) {
                if (data) {
                    $("#sel2Cities").prop("disabled", false);
                    $('#sel2Cities').show();
                }
            });
            $('#sel2Cities').select2('open');

            setTimeout(function () {
                getRecipients();
            }, 500);
        }
    });

    $('#sel2Cities').select2({
        placeholder: 'Selecione a cidade',
        language: "pt-BR",
        allowClear: true,
        ajax: {
            delay: 500,
            url: '/api/cities',
            dataType: 'json',
            data: function (params) {
                return {
                    term: params.term,
                    stateId: $('#sel2States').select2('data')[0].id
                }
            },
            processResults: function (data, page) {

                let results = [];

                $.each(data, function (i, v) {
                    let o = {};
                    o.id = v.cityId;
                    o.name = v.cityName;
                    o.value = v.cityId;
                    results.push(o);
                });

                return {
                    results: results
                };
            },
            cache: true
        },
        // minimumResultsForSearch: Infinity,
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

    $('#sel2Cities').on("select2:select select2:unselect", function (e) {
        // if ($('#sel2Cities').val() !== null) {
        setTimeout(function () {
            getRecipients();
        }, 500);
        // }
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
            term: '',
            categoryId: $('#sel2Categories').val() || "''",
            regionId: $('#sel2Regions').val() || "''",
            groupId: $('#sel2Groups').val() || "''",
            cityId: $('#sel2Cities').val() || "''",
            stateId: $('#sel2States').val() || "''",
            subject: $('#sel2EmailTemplates').select2('data')[0].name,
            content: CKEDITOR.instances.textareaTemplate.getData(), // $('#headerPreview').html() + $('#bodyPreview').html() + $('#footerPreview').html(),
            recipientId: $('#sel2Recipients').val() || 0,
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
            url: '/api/sendEmail',
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
    $(document).ready(function () {
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
    });

    CKEDITOR.replace('textareaTemplate');
});

function getRecipients() {
    let params = {
        term: "",
        categoryId: $('#sel2Categories').val() || "''",
        regionId: $('#sel2Regions').val() || "''",
        groupId: $('#sel2Groups').val() || "''",
        cityId: $('#sel2Cities').val() || "''",
        stateId: $('#sel2States').val() || "''",
        recipientId: $('#sel2Recipients').val() || 0
    };
    $.getJSON('/api/recipientsMailingList', params, function (data) {
        $('#sel2Recipients').append($(`<option value="0" selected>${data.recipients.response.recipients.length} destinatário(s) selecionado</option>`));
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