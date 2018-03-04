$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.templateId = null;
    const rg = /\[(.+?)\]/g;

    $('.textarea').froalaEditor({
        language: 'pt_br',
        toolbarButtons: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'outdent', 'indent', 'clearFormatting', 'insertTable', 'html']
    })

    $('#sel2EmailTemplates').select2({
        placeholder: 'Tipos de Correspondências',
        language: "pt-BR",
        tags: true,
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

                // let matchHeader;
                $('#inputName').val(data[0].templateName.trim());
                $('#h3Edit').html(`Editando: ${data[0].templateName.trim()}`);

                $('#headerTemplate').froalaEditor('html.set', data[0].headerTemplate.trim());
                // while (matchHeader = rg.exec(data[0].headerTemplate.trim())) // Iterate matches
                //     data[0].headerTemplate.trim().replace(matchHeader[1], '');

                // $('#headerPreview').html(data[0].headerTemplate);

                // let matchBody;
                // $('#bodyTemplate').froalaEditor('html.set', data[0].bodyTemplate.trim());
                // while (matchBody = rg.exec(data[0].bodyTemplate.trim())) // Iterate matches
                //     data[0].bodyTemplate.trim().replace(matchBody[1], '');

                // $('#bodyPreview').html(data[0].bodyTemplate);

                // let matchFooter;
                // $('#footerTemplate').froalaEditor('html.set', data[0].footerTemplate.trim());
                // while (matchFooter = rg.exec(data[0].footerTemplate.trim())) // Iterate matches
                //     data[0].footerTemplate.trim().replace(matchFooter[1], '');

                // $('#footerPreview').html(data[0].footerTemplate);

                my.templateId = $('#sel2EmailTemplates').select2('data')[0].id;

            });
        }
    });

    // $('#headerTemplate').on('froalaEditor.keyup', function (e, editor, keyupEvent) {
    //     // let matchValue;

    //     // while (matchValue = rg.exec(this.value.trim())) // Iterate matches
    //     //     this.value.trim().replace(matchValue, '');

    //     $('#headerPreview').html($('#headerTemplate').val());
    // });

    $('#bodyTemplate').keyup(function (e) {
        let matchValue;

        while (matchValue = rg.exec(this.value.trim())) // Iterate matches
            this.value.trim().replace(matchValue, '');

        $('#bodyPreview').html(this.value);
    });

    $('#footerTemplate').keyup(function (e) {
        let matchValue;

        while (matchValue = rg.exec(this.value.trim())) // Iterate matches
            this.value.trim().replace(matchValue, '');

        $('#footerPreview').html(this.value);
    });

    $('.restoreTemplate').click(function (e) {
        let r;
        switch (e.currentTarget.value) {
            case 'restoreBody':
                r = confirm("Quer mesmo restaurar o corpo do email?");
                if (r == true) {
                    $('#bodyTemplate').val($('#oemBodyTemplate').html().trim());
                    $('#bodyPreview').html($('#oemBodyTemplate').html().replace(/\s*\{.*?\}\s*/g, '').trim());
                }
                break;
            case 'restoreFooter':
                r = confirm("Quer mesmo restaurar o rodapé do email?");
                if (r == true) {
                    $('#footerTemplate').val($('#oemFooterTemplate').html().trim());
                    $('#footerPreview').html($('#oemFooterTemplate').html().replace(/\s*\{.*?\}\s*/g, "").trim());
                }
                break;
            default:
                r = confirm("Quer mesmo restaurar o cabeçalho do email?");
                if (r == true) {
                    $('#headerTemplate').val($('#oemHeaderTemplate').html().trim());
                    $('#headerPreview').html($('#oemHeaderTemplate').html().replace(/\s*\{.*?\}\s*/g, "").trim());
                }
                break;
        }
    });

    $('#btnNew').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        $('input, textarea').val('');
        $('.oem').html('');
        $('#sel2EmailTemplates').val(null).trigger('change')
        my.templateId = null;
    });

    $('.saveTemplate').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            templateId: my.templateId,
            portalId: 0,
            templateName: $('#inputName').val().trim(),
            headerTemplate: $('#headerTemplate').val().trim(),
            bodyTemplate: $('#bodyTemplate').val().trim(),
            footerTemplate: $('#footerTemplate').val().trim(),
            createdByUser: userInfo.userId
        };

        $.ajax({
            type: (my.templateId ? 'PUT' : 'POST'),
            url: '/api/emailTemplate',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: (my.templateId ? "Conteúdo atualizado" : "Conteúdo inserido."),
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

                if (data.templateId) {
                    my.templateId = data.templateId;
                }
            }
            $this.prop('disabled', false);
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    // autosize($('textarea'));

    // $('textarea').on('keydown', autosize);

    function autosize() {
        var el = this;
        setTimeout(function () {
            el.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    }
});