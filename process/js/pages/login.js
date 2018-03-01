$(function () {
    $('#login_username').focus();
});

$("form").submit(function (e) {

    e.preventDefault();
    let $lg_username = $('#login_username').val();
    let $lg_password = $('#login_password').val();
    let $lg_remember_me = $('#remember_me').prop('checked');

    $('#login_btn').prop("disabled", true);;

    $.ajax({
        type: 'POST',
        data: {
            username: $lg_username,
            password: $lg_password,
            remember_me: $lg_remember_me
        },
        url: '/login'
    }).done(function (data) {
        window.location.replace('/');
    }).fail(function (jqXHR, textStatus) {
        $('#login_btn').removeAttr('disabled');
        $('.login-box-msg').html("<span class='alert-error' style='padding: 5px;'>Erro: " + jqXHR.statusText + "<span>");
        // }).always(function () {
        //     $('#login_btn').html("Login").removeAttr('disabled');
    });

});