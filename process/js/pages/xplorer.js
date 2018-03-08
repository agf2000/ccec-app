$(function () {
    userInfo = JSON.parse(userInfo);
    let my = {};
    my.fileId = 0;
    my.originalFileName = '';

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
        formData.append('createdByUser', userInfo.userId);
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
                    url: '/api/files',
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (item) {
                    // console.log(item);
                    def.resolve(item.filesArray);
                });
                return def.promise();
            },
            deleteItem: function (deletingFile) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/file',
                    data: {
                        filePath: deletingFile.filePath
                    }
                }).done(function (data) {
                    if (!data.error) {
                        swal({
                            title: "Sucesso!",
                            text: "Arquivo excluido.",
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
            return "O arquivo \"" + item.fileName + "\" será removido. Deseja continuar?";
        },
        fields: [{
                name: "filePath",
                headerTemplate: "Arquivo",
                itemTemplate: function (val, item) {
                    if (val) {
                        let fName = val.replace(/^.*[\\\/]/, '');
                        return $("<a>").append(fName).on("click", function () {
                            window.open(val.replace('data\\', ''), '_blank');
                        });
                    }
                },
                title: "",
                sorting: false
            },
            {
                name: "fileType",
                title: "Tipo",
                type: "text"
            },
            {
                name: "folder",
                title: "Pasta",
                type: "text"
            },
            {
                type: "control"
            }
        ]
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