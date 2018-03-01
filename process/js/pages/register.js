$("form").submit(function (e) {

    if (e.isDefaultPrevented()) {

    } else {
        // Prevent form submission
        e.preventDefault();

        let $register_name = $('#register_name').val();
        let $register_email = $('#register_email').val();
        let $register_password = $('#register_password').val();

        let personData = {
            portalId: 0,
            displayName: $register_name,
            email: $register_email,
            username: $register_email,
            password: $register_password,
            createdOnDate: moment().format('YYYY-MM-DD HH:mm')
        };

        $('#register_btn').prop("disabled", true);

        $.ajax({
            type: 'POST',
            data: personData,
            url: '/register'
        }).done(function (data) {
            if (data.error) {
                $('.login-box-msg').html("<span class='alert-error' style='padding: 5px;'>Erro: " + data.error + "<span>");
                $('#register_btn').removeAttr('disabled');
            } else {
                $('.login-box-msg').html("<span class='alert-success' style='padding: 5px;'>Usuário cadastrado com sucesso.<span>");
            }
        }).fail(function (jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            $('#register_btn').removeAttr('disabled');
            $('.login-box-msg').html("<span class='alert-error' style='padding: 5px;'>Erro: " + data.jqXHR.statusText + "<span>");
            // }).always(function () {
            // $('#register_btn').removeAttr('disabled');
        });
    }
});