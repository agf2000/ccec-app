$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.recipientId = 0;

    $('#sel2Categories').select2({
        placeholder: 'Selecione a categoria',
        language: "pt-BR",
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

    hotkeys('f4', function (e, h) {
        if (h.key == "f4") {
            if ($('#sel2Categories').is(':focus')) {
                $('#categoryModal').modal();
            }
            if ($('#sel2Regions').is(':focus')) {
                $('#regionModal').modal();
            }
            if ($('#sel2Cities').is(':focus')) {
                $('#cityModal').modal();
            }
            if ($('#sel2Groups').is(':focus')) {
                $('#groupModal').modal();
            }
            if ($('#sel2Sates').is(':selected')) {
                $('#stateModal').modal();
            }
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
            $('#categoryModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
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
            $('#groupModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
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
            $('#regionModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    $('#btnSaveCity').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            cityName: $('#inputCityName').val(),
            stateId: $('#sel2States').select2('data')[0].value
        };

        $.ajax({
            type: 'POST',
            url: '/api/city',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: "Cidade inserida.",
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
            $('#cityModal').modal('hide');
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $this.prop('disabled', false);
            // }).always(function () {
            //     $this.prop('disabled', false);
        });
    });

    $('#btnSaveRecipient').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        let $this = $(this);

        $this.prop('disabled', true);

        let params = {
            recipientId: my.recipientId,
            portalId: 0,
            recipientName: $('#inputName').val().trim(),
            recipientPhone: $('#inputPhone').val().replace(/\D/g, ''),
            recipientEmail: $('#inputEmail').val(),
            recipientAddress: $('#inputAddress').val(),
            recipientState: $('#sel2States').select2('data')[0].id,
            recipientRegion: $('#sel2Regions').select2('data')[0].id,
            recipientGroup: $('#sel2Groups').select2('data')[0].id,
            recipientCategory: $('#sel2Categories').select2('data')[0].id,
            recipientCity: $('#sel2Cities').select2('data')[0].id,
            createdByUser: userInfo.userId
        };

        $.ajax({
            type: (e.currentTarget.value == 'post' ? 'POST' : 'PUT'),
            url: '/api/recipient',
            data: params
        }).done(function (data) {
            if (!data.error) {
                swal({
                    title: "Sucesso!",
                    text: (my.recipientId ? "Destinatário atualizado" : "Destinatário inserido."),
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    timer: 2000
                }).then(
                    function () {

                        let recipient = {};
                        if (!my.recipientId) {
                            recipient = {
                                recipientId: data.recipientId,
                                recipientName: data.recipientName,
                                recipientEmail: data.recipientEmail,
                                recipientAddress: data.recipientAddress,
                                recipientPhone: data.recipientPhone.replace(/[^\d\+]/g, ""),
                                recipientGroup: data.recipientGroup,
                                recipientCategory: data.recipientCategory,
                                recipientRegion: data.recipientRegion,
                                recipientState: data.recipientState,
                                recipientCity: data.recipientCity,
                            }
                        } else {
                            $.extend(updatingRecipient, {
                                recipientName: $('#inputName').val(),
                                recipientPhone: $('#inputPhone').val().replace(/[^\d\+]/g, ""),
                                recipientEmail: $('#inputEmail').val(),
                                recipientAddress: $('#inputAddress').val(),
                                recipientGroup: $('#sel2Groups').select2('data').name,
                                recipientCategory: $('#sel2Categories').select2('data').name,
                                recipientRegions: $('#sel2Regions').select2('data').name,
                                recipientState: $('#sel2States').select2('data').name,
                                recipientCity: $('#sel2Cities').select2('data').name,
                            });

                            $("#jsGrid").jsGrid("updateItem", updatingRecipient);

                            $("#jsGrid").jsGrid('refresh');

                            $('.panel-collapse.in').collapse('toggle');
                        }

                        if (!my.recipientId) {
                            $("#jsGrid").jsGrid("insertItem", recipient);
                        }

                        $this.prop('disabled', false);
                        $('form')[0].reset();
                        $('#btnSaveRecipient').val('post');
                        $('#sel2Categories').val(null).trigger('change');
                        $('#sel2Regions').val(null).trigger('change');
                        $('#sel2Cities').val(null).trigger('change');
                        $('#sel2States').val(null).trigger('change');
                        $('#sel2Groups').val(null).trigger('change');
                        my.recipientId = 0;
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

    let updatingRecipient;

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
                    url: '/api/recipients',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingRecipient) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/recipient',
                    data: {
                        recipientId: deletingRecipient.recipientId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Destinatário excluido.",
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
            return "O destinatário \"" + item.recipientName + "\" será removido. Deseja continuar?";
        },
        editItem: function (item) {
            let $row = this.rowByItem(item);
            if ($row.length) {
                // console.log('$row: ' + JSON.stringify($row)); // I modify this

                $('#inputPhone').mask('(99) 99999-9999');

                my.recipientId = item.recipientId;

                $('#inputName').val(item.recipientName);
                $('#inputAddress').val(item.recipientAddress);
                $('#inputPhone').val(item.recipientPhone.replace(/[^\d\+]/g, ""));
                $('#inputEmail').val(item.recipientEmail);

                $('#inputPhone').mask('(99) 99999-9999');

                $('#sel2Categories').append($('<option value="' + item.recipientCategory.split(':')[0] + '" selected>' + item.recipientCategory.split(':')[1] + '</option>'));
                $("#sel2Categories").trigger("change");

                $('#sel2Regions').append($('<option value="' + item.recipientRegion.split(':')[0] + '" selected>' + item.recipientRegion.split(':')[1] + '</option>'));
                $("#sel2Regions").trigger("change");

                $('#sel2Groups').append($('<option value="' + item.recipientGroup.split(':')[0] + '" selected>' + item.recipientGroup.split(':')[1] + '</option>'));
                $("#sel2Groups").trigger("change");

                $('#sel2States').append($('<option value="' + item.recipientState.split(':')[0] + '" selected>' + item.recipientState.split(':')[1] + '</option>'))
                $("#sel2States").trigger("change");

                $('#sel2Cities').append($('<option value="' + item.recipientCity.split(':')[0] + '" selected>' + item.recipientCity.split(':')[1] + '</option>'));
                $("#sel2Cities").trigger("change");

                $('#btnSaveRecipient').val('put');
                updatingRecipient = item;
                $('.panel-collapse').collapse('show');
                $.scrollTo($('.main-header'), 1000, {
                    easing: 'swing'
                });

                this._editRow($row);
            }
        },
        fields: [{
                title: "Nome",
                name: "recipientName",
                type: "text"
            },
            {
                name: "recipientPhone",
                headerTemplate: "Telefone",
                itemTemplate: function (val, item) {
                    if (val.replace(/\D/g, '')) {
                        if (val.substr(2).startsWith('9')) {
                            return format(val, '(##) #####-####');
                        } else {
                            return format(val, '(##) ####-####');
                        }
                    }
                },
                title: "",
                sorting: false
            },
            {
                name: "recipientEmail",
                title: "Email",
                type: "text"
            },
            {
                name: "completeAddress",
                title: "Endereço",
                type: "text",
                sorting: false
            },
            {
                name: "recipientGroup",
                headerTemplate: "Grupo",
                itemTemplate: function (val, item) {
                    if (val) {
                        return val.split(':')[1];
                    }
                },
                title: "",
                sorting: false
            },
            {
                name: "recipientCategory",
                headerTemplate: "Categoria",
                itemTemplate: function (val, item) {
                    if (val) {
                        return val.split(':')[1];
                    }
                },
                title: "",
                sorting: false
            },
            {
                name: "recipientRegion",
                headerTemplate: "Região",
                itemTemplate: function (val, item) {
                    if (val) {
                        return val.split(':')[1];
                    }
                },
                title: "",
                sorting: false
            },
            {
                type: "control"
            }
        ]
    });

    $('.btnEditModals').click(function (e) {
        if (e.clientX === 0) {
            return false;
        }
        e.preventDefault();

        switch (this.value) {
            case "region":
                $('#jsGridRegions').jsGrid('loadData');
                $('#regionModal').modal('open');
                break;
            case "group":
                $('#jsGridGroups').jsGrid('loadData');
                $('#groupModal').modal('open');
                break;
            default:
                $('#jsGridCategories').jsGrid('loadData');
                $('#categoryModal').modal();
                break;
        }
    });

    $("#jsGridCategories").jsGrid({
        width: '100%',
        height: 'auto',
        autoload: false,
        confirmDeleting: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 5,
        inserting: true,
        editing: true,
        sorting: true,
        // data: data, // an array of data
        ajaxGridOptions: {
            cache: false
        },
        controller: {
            loadData: function (filter) {
                var def = $.Deferred();
                $.ajax({
                    url: '/api/categories',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingCategory) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/category',
                    data: {
                        categoryId: deletingCategory.categoryId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Caso a categoria esteja em uso, a mesma não pode ser excluida.",
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
            },
            updateItem: function (item) {
                let d = $.Deferred();

                let params = {
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                    categoryType: item.categoryType
                };

                $.ajax({
                    type: 'PUT',
                    url: '/api/category',
                    data: params
                }).done(function (updatedItem) {
                    if (!updatedItem.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Categoria atualizada.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {
                                d.resolve();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                    return d.promise();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            },
            insertItem: function (item) {
                let d = $.Deferred();

                let params = {
                    categoryName: item.categoryName,
                    categoryType: item.categoryType
                };

                $.ajax({
                    type: 'POST',
                    url: '/api/category',
                    data: params
                }).done(function (updatedItem) {
                    if (!updatedItem.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Categoria inserida.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {
                                d.resolve();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                    return d.promise();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            }
        },
        deleteConfirm: function (item) {
            return "A categoria \"" + item.categoryName + "\" será removida. Deseja continuar?";
        },
        fields: [{
                title: "Nome",
                name: "categoryName",
                type: "text"
            },
            {
                name: "categoryType",
                title: "Tipo",
                type: "text",
                width: 50
            },
            {
                type: "control"
            }
        ]
    });

    $("#jsGridRegions").jsGrid({
        width: '100%',
        height: 'auto',
        autoload: false,
        confirmDeleting: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 5,
        inserting: true,
        editing: true,
        sorting: true,
        // data: data, // an array of data
        ajaxGridOptions: {
            cache: false
        },
        controller: {
            loadData: function (filter) {
                var def = $.Deferred();
                $.ajax({
                    url: '/api/regions',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingRegion) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/region',
                    data: {
                        regionId: deletingRegion.regionId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Caso a Região esteja em uso, a mesma não pode ser excluida.",
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
            },
            updateItem: function (item) {
                let d = $.Deferred();

                let params = {
                    regionId: item.regionId,
                    regionName: item.regionName
                };

                $.ajax({
                    type: 'PUT',
                    url: '/api/region',
                    data: params
                }).done(function (updatedItem) {
                    if (!updatedItem.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Região atualizada.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {
                                d.resolve();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                    return d.promise();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            },
            insertItem: function (item) {
                let d = $.Deferred();

                let params = {
                    regionName: item.regionName
                };

                $.ajax({
                    type: 'POST',
                    url: '/api/region',
                    data: params
                }).done(function (updatedItem) {
                    if (!updatedItem.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Região inserida.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {
                                d.resolve();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                    return d.promise();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            }
        },
        deleteConfirm: function (item) {
            return "A região \"" + item.regionName + "\" será removida. Deseja continuar?";
        },
        fields: [{
                title: "Nome",
                name: "regionName",
                type: "text"
            },
            {
                type: "control"
            }
        ]
    });

    $("#jsGridGroups").jsGrid({
        width: '100%',
        height: 'auto',
        autoload: false,
        confirmDeleting: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 5,
        inserting: true,
        editing: true,
        sorting: true,
        // data: data, // an array of data
        ajaxGridOptions: {
            cache: false
        },
        controller: {
            loadData: function (filter) {
                var def = $.Deferred();
                $.ajax({
                    url: '/api/groups',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item);
                });
                return def.promise();
            },
            deleteItem: function (deletingGroup) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/group',
                    data: {
                        groupId: deletingGroup.groupId
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Caso o Grupo esteja em uso, o mesmo não pode ser excluido.",
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
            },
            updateItem: function (item) {
                let d = $.Deferred();

                let params = {
                    groupId: item.groupId,
                    groupName: item.groupName
                };

                $.ajax({
                    type: 'PUT',
                    url: '/api/group',
                    data: params
                }).done(function (updatedItem) {
                    if (!updatedItem.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Grupo atualizado.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {
                                d.resolve();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                    return d.promise();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            },
            insertItem: function (item) {
                let d = $.Deferred();

                let params = {
                    groupName: item.groupName
                };

                $.ajax({
                    type: 'POST',
                    url: '/api/group',
                    data: params
                }).done(function (updatedItem) {
                    if (!updatedItem.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Grupo inserido.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            timer: 3000
                        }).then(
                            function () {
                                d.resolve();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    console.log('I was closed by the timer')
                                }
                            }
                        );
                    }
                    return d.promise();
                }).fail(function (jqXHR, textStatus) {
                    console.log(jqXHR.responseText);
                });
            }
        },
        deleteConfirm: function (item) {
            return "O grupo \"" + item.groupName + "\" será removida. Deseja continuar?";
        },
        fields: [{
                title: "Nome",
                name: "groupName",
                type: "text"
            },
            {
                type: "control"
            }
        ]
    });

    $('#inputPhone').mask('(99) 99999-9999');

});

function format(value, pattern) {
    var i = 0,
        v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}