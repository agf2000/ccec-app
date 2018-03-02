$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.sponsorId = 0;
    my.originalFileName = '';

    let pickerIn = new Pikaday({
        field: $('#inputDateStart')[0],
        format: 'D MMM YYYY',
        minDate: moment().toDate(),
        theme: 'dark-theme',
        onSelect: function () {
            console.log(this.getMoment().format('D/M/YYYY'));
        },
        i18n: {
            previousMonth: 'Previous Month',
            nextMonth: 'Next Month',
            months: ['Janairo', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            weekdays: ['Somingo', 'Segunda', 'Quinta', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
        }
    });

    let pickerOut = new Pikaday({
        field: $('#inputDateEnd')[0],
        format: 'D MMM YYYY',
        minDate: moment().toDate(),
        theme: 'dark-theme',
        onSelect: function () {
            console.log(this.getMoment().format('D/M/YYYY'));
        },
        i18n: {
            previousMonth: 'Previous Month',
            nextMonth: 'Next Month',
            months: ['Janairo', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            weekdays: ['Somingo', 'Segunda', 'Quinta', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
        }
    });

    hotkeys('f4', function (e, h) {
        if (h.key == "f4") {
            $('#categoryModal').modal();
        }
    });

    $('#sel2Categories').select2({
        placeholder: 'Selecione',
        language: "pt-BR",
        // tags: true,
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

    $('#btnSaveCategory').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);
        $this.prop('disabled', true);

        let params = {
            categoryName: $('#inputCategoryName').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/category',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Categoria inserida.",
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
            $this.prop('disabled', false);
            $('#categoryModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    $('#sel2Regions').select2({
        placeholder: 'Selecione a região',
        language: "pt-BR",
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

    $('#btnSaveRegion').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            regionName: $('#inputRegionName').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/region',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Região inserida.",
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
            $this.prop('disabled', false);
            $('#regionModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    $('#sel2Groups').select2({
        placeholder: 'Selecione o grupo',
        language: "pt-BR",
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

    $('#btnSaveGroup').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            groupName: $('#inputGroupName').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/group',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Grupo inserido.",
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
            $this.prop('disabled', false);
            $('#groupModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    $('#sel2States').select2({
        placeholder: 'Selecione o estado',
        language: "pt-BR",
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

    $('#sel2States').on("select2:select", function (e) {
        if ($('#sel2States').val() !== null) {
            $.getJSON('/api/cities?stateId=' + $('#sel2States').select2('data')[0].id, function (data) {
                if (data) {
                    $("#sel2Cities").prop("disabled", false);
                    $('#sel2Cities').show();
                    $('button[value="city"]').prop("disabled", false);
                }
            });
            $('#sel2Cities').select2('open');
        }
    });

    $('#sel2Cities').select2({
        placeholder: 'Selecione a cidade',
        language: "pt-BR",
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

    $('#btnSaveSponsor').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        var formData = new FormData();
        var file = document.getElementById('inputLogo').files[0];

        formData.append('originalFileName', my.originalFileName);
        formData.append('inputLogo', file);
        formData.append('sponsorId', my.sponsorId);
        formData.append('portalId', 0);
        formData.append('sponsorName', $('#inputName').val());
        formData.append('sponsorUrl', $('#inputLink').val());
        formData.append('dateStart', ($('#inputDateStart').val().length ? pickerIn.getMoment().format('YYYY-MM-DD') : ''));
        formData.append('dateEnd', ($('#inputDateEnd').val().length ? pickerOut.getMoment().format('YYYY-MM-DD') : ''));
        formData.append('active', $('#inputActive').is(':checked'));
        // formData.append('sponsorCategories', JSON.stringify($('#sel2Categories').select2('data')));
        formData.append('sponsorCategory', $('#sel2Categories').val());
        formData.append('sponsorGroup', $('#sel2Groups').val());
        formData.append('sponsorRegion', $('#sel2Regions').val());
        formData.append('sponsorState', $('#sel2States').val());
        formData.append('sponsorCity', $('#sel2Cities').val());
        formData.append('createdByUser', userInfo.userid);
        var xhr = new XMLHttpRequest();

        // your url upload
        if (e.currentTarget.value == 'post') {
            xhr.open('post', '/api/sponsor', true);
        } else {
            xhr.open('put', '/api/sponsor', true);
        }

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
            if (xhr.readyState === 4 || xhr.readyState === 2) {
                if (xhr.responseText !== '') {
                    var response = JSON.parse(xhr.responseText);
                    if (xhr.status === 200 && (response.sponsor || response.success)) {

                        swal({
                            title: "Sucesso!",
                            text: "Patrocinador inserido.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {

                                // let catArray = $('#sel2Categories').select2('data');
                                // let categories = '',
                                //     categoryIds = '';
                                // $.each(catArray, function (item, value) {
                                //     if (value.text.length) {
                                //         categories += `${value.text.trim()}, `;
                                //         categoryIds += `${value.id}:${value.text}, `;
                                //     } else {
                                //         categories += `${value.name.trim()}, `;
                                //         categoryIds += `${value.id}:${value.name}, `;
                                //     }
                                // });
                                // categories.replace(/,([^,]*)$/, '$1').trim();
                                // categoryIds.replace(/,([^,]*)$/, '$1').trim();

                                let img;
                                if ($('#imagePreview').attr('src')) {
                                    img = $('#imagePreview').attr('src').split('\\').pop().split('/').pop();
                                    img = img.replace('_thumb', '');
                                }

                                let sponsor = {};
                                if (!my.sponsorId) {
                                    sponsor = {
                                        sponsorId: response.sponsor.sponsorId,
                                        sponsorName: response.sponsor.sponsorName,
                                        sponsorUrl: response.sponsor.sponsorUrl,
                                        dateStart: response.sponsor.dateStart,
                                        dateEnd: response.sponsor.dateEnd,
                                        active: response.sponsor.active,
                                        sponsorCategory: response.sponsor.sponsorCategory,
                                        sponsorCategoryName: response.sponsor.sponsorCategoryName,
                                        sponsorGroup: response.sponsor.sponsorGroup,
                                        sponsorGroupName: response.sponsor.sponsorGroupName,
                                        sponsorRegion: response.sponsor.sponsorRegion,
                                        sponsorRegionName: response.sponsor.sponsorRegionName,
                                        sponsorState: response.sponsor.sponsorState,
                                        sponsorStateName: response.sponsor.sponsorStateName,
                                        sponsorCity: response.sponsor.sponsorCity,
                                        sponsorCityName: response.sponsor.sponsorCityName,
                                        sponsorLogo: response.sponsor.sponsorLogo
                                    }
                                } else {
                                    $.extend(updatingSponsor, {
                                        sponsorName: $('#inputName').val(),
                                        sponsorUrl: $('#inputLink').val(),
                                        dateStart: ($('#inputDateStart').val().length ? moment($('#inputDateStart').val()).format('MM/DD/YYYY 00:00:00') : ''),
                                        dateEnd: ($('#inputDateEnd').val().length ? moment($('#inputDateEnd').val()).format('MM/DD/YYYY 00:00:00') : ''),
                                        active: $('#inputActive').is(':checked'),
                                        sponsorCategory: $('#sel2Categories').val(),
                                        sponsorCategoryName: $('#sel2Categories').select2('data')[0].name,
                                        sponsorGroup: $('#sel2Groups').val(),
                                        sponsorGroupName: $('#sel2Groups').select2('data')[0].name,
                                        sponsorRegion: $('#sel2Regions').val(),
                                        sponsorRegionName: $('#sel2Regions').select2('data')[0].name,
                                        sponsorState: $('#sel2States').val(),
                                        sponsorStateName: $('#sel2States').select2('data')[0].name,
                                        sponsorCity: $('#sel2Cities').val(),
                                        sponsorCityName: $('#sel2Cities').select2('data')[0].name,

                                        sponsorLogo: response.sponsorLogo
                                    });

                                    $("#jsGrid").jsGrid("updateItem", updatingSponsor);

                                    $("#jsGrid").jsGrid('refresh');
                                }

                                $this.prop('disabled', false);

                                if (!my.sponsorId) {
                                    $("#jsGrid").jsGrid("insertItem", sponsor);
                                }

                                $('form')[0].reset();
                                $('#imagePreview').removeAttr('src');
                                $('#previewLogo').addClass('hidden');
                                $('#btnSaveSponsor').val('post');
                                $('#sel2Categories').val(null).trigger('change');
                                $('#sel2Regions').val(null).trigger('change');
                                $('#sel2Cities').val(null).trigger('change');
                                $('#sel2States').val(null).trigger('change');
                                $('#sel2Groups').val(null).trigger('change');
                                my.sponsorId = 0;
                                my.originalFileName = '';
                                $("#collapseOne").collapse('hide');

                                setTimeout(() => {
                                    $('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
                                }, 100);
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
            }
        };

        xhr.send(formData);
    });

    let updatingSponsor;

    // jsGrid.locale(["pt-br"]);

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
                    url: '/api/sponsors',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingSponsor) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/sponsor',
                    data: {
                        sponsorId: deletingSponsor.sponsorId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Patrocinador excluido.",
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
            return "O patrocinador \"" + item.sponsorName + "\" será removido. Deseja continuar?";
        },
        editItem: function (item) {
            let $row = this.rowByItem(item);
            if ($row.length) {
                $("#collapseOne").collapse('show');
                $('select').val(null).trigger("change");
                // console.log('$row: ' + JSON.stringify($row)); // I modify this
                my.sponsorId = item.sponsorId;
                if (item.sponsorLogo) {
                    item.sponsorLogo = item.sponsorLogo.split('\\').pop().split('/').pop();
                    let tmb = item.sponsorLogo.replace(/(\.[\w\d_-]+)$/i, '_thumb$1');
                    my.originalFileName = item.sponsorLogo;
                    $('#imagePreview').attr('src', `/uploads/logos/${item.sponsorId}/thumbnail/${tmb}`);
                    if (tmb) {
                        $('#previewLogo').removeClass('hidden');
                    };
                    $('#inputLogo').prop('disabled', true);
                    $('#divUpload').addClass('hidden');
                }
                $('#inputName').val(item.sponsorName);
                $('#inputLink').val(item.sponsorUrl);
                pickerIn.setDate(item.dateStart);
                pickerOut.setDate(item.dateEnd);
                $('#inputActive').prop('checked', item.active);

                // let categories = item.sponsorCategoriesIds.split(',');
                // $.each(categories, function (i, val) {
                //     let data = {
                //         id: val.split(':')[0],
                //         text: val.split(':')[1]
                //     }
                //     let newOption = new Option(data.text, data.id, true, true);
                //     $('#sel2Categories').select2().append(newOption);
                // });
                // $("#sel2Categories").trigger("change");

                if (item.sponsorCategory)
                    $('#sel2Categories').append('<option value="' + item.sponsorCategory + '" selected>' + item.sponsorCategoryName + '</option>');
                if (item.sponsorGroup)
                    $('#sel2Groups').append('<option value="' + item.sponsorGroup + '" selected>' + item.sponsorGroupName + '</option>');
                $("#sel2Groups").trigger("change");
                if (item.sponsorRegion)
                    $('#sel2Regions').append('<option value="' + item.sponsorRegion + '" selected>' + item.sponsorRegionName + '</option>');
                $("#sel2Regions").trigger("change");
                if (item.sponsorState)
                    $('#sel2States').append('<option value="' + item.sponsorState + '" selected>' + item.sponsorStateName + '</option>');
                $("#sel2States").trigger("change");
                if (item.sponsorCity)
                    $('#sel2Cities').append('<option value="' + item.sponsorCity + '" selected>' + item.sponsorCityName + '</option>');
                $("#sel2Cities").trigger("change");

                $('#btnSaveSponsor').val('put');

                updatingSponsor = item;
                this._editRow($row);
            }
        },
        fields: [{
                title: "Patrocinador",
                name: "sponsorName",
                type: "text",
                width: 150
            },
            {
                name: "sponsorUrl",
                title: "Link",
                type: "text",
                width: 150
            },
            {
                name: "sponsorCategoryName",
                title: "Categoria",
                type: "text"
            },
            {
                name: "sponsorGroupName",
                title: "Grupo",
                type: "text"
            },
            {
                name: "sponsorRegionName",
                title: "Região",
                type: "text"
            },
            {
                name: "sponsorStateName",
                title: "Estado",
                type: "text"
            },
            {
                name: "sponsorCityName",
                title: "Cidade",
                type: "text"
            },
            {
                name: "sponsorLogo",
                headerTemplate: "Logo",
                itemTemplate: function (val, item) {
                    if (val) {
                        let tmb = val.replace(/(\.[\w\d_-]+)$/i, '_thumb$1');
                        return $("<img>").attr("src", `/uploads/logos/${item.sponsorId}/thumbnail/${tmb}`).css({
                            height: '80%'
                            // width: '80%'
                        }).on("click", function () {
                            window.open(`/uploads/logos/${item.sponsorId}/large/${val}`, '_blank');
                        });
                    }
                },
                title: "",
                sorting: false
            },
            {
                name: "active",
                headerTemplate: "Ativo",
                itemTemplate: function (val, item) {
                    if (val) {
                        return 'Sim'
                    } else {
                        return 'Não'
                    }
                },
                title: ""
            },
            {
                type: "control"
            }
        ]
    });

    $('#deleteImg').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        swal({
            title: "Excluindo arquivo!",
            html: "Liberando arquivo para exclusão.<br />Por favor aguarde uma resposta do sistema.",
            type: "info",
            showCancelButton: false,
            showConfirmButton: false
        }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
                if (dismiss === 'timer') {
                    console.log('I was closed by the timer')
                }
            }
        );

        $.ajax({
            type: 'DELETE',
            url: '/api/sponsorImage',
            data: {
                sponsorId: my.sponsorId
            }
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Imagem excluida.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    timer: 3000
                }).then(
                    function () {
                        $('#imagePreview').removeAttr('src');
                        $("#inputLogo").val('');
                        $('#inputLogo').prop("disabled", false);
                        $('#divUpload').removeClass('hidden');
                        $('#previewLogo').addClass('hidden');
                    },
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
    });

});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imagePreview')
                .attr('src', e.target.result)
                .height(80);
        };

        reader.readAsDataURL(input.files[0]);

        $('#previewLogo').removeClass('hidden');
    }
};