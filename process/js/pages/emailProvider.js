$(function () {

    let loadData = function () {
        var def = $.Deferred();
        $.ajax({
            url: '/api/settings',
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (item) {
            def.resolve(item);

            $('#inputLogin').val(item.find(function (setting) {
                return setting.settingName === 'emailProviderLogin'
            }).settingValue);

            $('#inputReplyTo').val(item.find(function (setting) {
                return setting.settingName === 'emailProviderReplyTo'
            }).settingValue);

            $('#inputSMTP').val(item.find(function (setting) {
                return setting.settingName === 'emailProviderSMTP'
            }).settingValue);

            $('#inputPort').val(item.find(function (setting) {
                return setting.settingName === 'emailProviderPort'
            }).settingValue);

            $('#chkBoxSSL').prop('checked', item.find(function (setting) {
                return setting.settingName === 'emailProviderUseSSL'
            }).settingValue);
        });
        return def.promise();
    };

    loadData();

});

$("form").submit(function (e) {

    if (e.isDefaultPrevented()) {

    } else {
        // Prevent form submission
        e.preventDefault();

        let $btn = e.target;

        let settingData = [{
                portalId: "0",
                settingName: 'emailProviderLogin',
                settingValue: $('#inputLogin').val()
            }, {
                portalId: "0",
                settingName: 'emailProviderReplyTo',
                settingValue: $('#inputReplyTo').val()
            }, {
                portalId: "0",
                settingName: 'emailProviderSMTP',
                settingValue: $('#inputSMTP').val()
            },
            {
                portalId: "0",
                settingName: 'emailProviderPort',
                settingValue: $('#inputPort').val()
            },
            {
                portalId: "0",
                settingName: 'emailProviderUseSSL',
                settingValue: $('#chkBoxSSL').prop('checked')
            }
        ];

        $($btn).prop("disabled", true);

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(settingData),
            url: '/api/settings'
        }).done(function (data) {
            if (data.error) {
                swal({
                    title: "Erro!",
                    text: data.error,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                });
            } else {
                swal({
                    title: "Sucesso!",
                    text: "Configuração atualizada.",
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

            $($btn).prop('disabled', false);
        }).fail(function (jqXHR, textStatus) {
            swal({
                title: "Erro!",
                html: `${jqXHR.statusText}<br /><br />${jqXHR.responseText}`,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Ok"
            });

            $($btn).prop('disabled', false);

            // }).always(function () {
            // $($btn).removeAttr('disabled');
        });
    }
});