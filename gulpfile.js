const gulp = require('gulp');
const run = require('gulp-run');
const imagemin = require('gulp-imagemin');

let src = './process',
    app = './public';

gulp.task('js', function () {
    return gulp.src(src + '/js/**')
        .pipe(gulp.dest(app + '/js'));
});

gulp.task('css', function () {
    return gulp.src(src + '/css/**')
        .pipe(gulp.dest(app + '/css'));
});

gulp.task('vendors', function () {
    gulp.src('node_modules/bootstrap/dist/fonts/**/*')
        .pipe(gulp.dest(app + '/lib/bootstrap/fonts'));

    gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest(app + '/lib/bootstrap/css'));

    gulp.src('node_modules/bootstrap/dist/css/bootstrap-theme.min.css')
        .pipe(gulp.dest(app + '/lib/bootstrap/css'));

    gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest(app + '/lib/bootstrap/js'));

    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(app + '/lib/jquery'));

    gulp.src('node_modules/jquery-ui-dist/jquery-ui.min.js')
        .pipe(gulp.dest(app + '/lib/jquery-ui/js'));

    gulp.src('node_modules/jquery-ui-dist/jquery-ui.min.css')
        .pipe(gulp.dest(app + '/lib/jquery-ui/css'));

    gulp.src('node_modules/jquery-ui-dist/jquery-ui.theme.min.css')
        .pipe(gulp.dest(app + '/lib/jquery-ui/css'));

    gulp.src('node_modules/jquery-ui-dist/images/*')
        .pipe(gulp.dest(app + '/lib/jquery-ui/css/images'));

    gulp.src('node_modules/knockout/build/output/knockout-latest.js')
        .pipe(gulp.dest(app + '/lib/knockout'));

    gulp.src('node_modules/moment/min/moment.min.js')
        .pipe(gulp.dest(app + '/lib/moment'));

    // gulp.src('node_modules/moment-timezone/builds/moment-timezone.min.js')
    //     .pipe(gulp.dest(app + '/lib/moment/timezone'));

    // gulp.src('node_modules/moment-timezone/builds/moment-timezone-with-data.min.js')
    //     .pipe(gulp.dest(app + '/lib/moment/timezone'));

    // gulp.src('node_modules/moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js')
    //     .pipe(gulp.dest(app + '/lib/moment/timezone'));

    gulp.src('node_modules/moment/locale/pt-br.js')
        .pipe(gulp.dest(app + '/lib/moment/locale'));

    gulp.src('node_modules/select2/dist/js/select2.full.min.js')
        .pipe(gulp.dest(app + '/lib/select2/js'));

    gulp.src('node_modules/select2/dist/js/i18n/pt-BR.js')
        .pipe(gulp.dest(app + '/lib/select2/i18n'));

    gulp.src('node_modules/select2/dist/css/select2.min.css')
        .pipe(gulp.dest(app + '/lib/select2/css'));

    // gulp.src('node_modules/select2-bootstrap-theme/dist/select2-bootstrap.min.css')
    //     .pipe(gulp.dest(app + '/lib/select2-bootstrap-theme/css'));

    gulp.src('node_modules/pnotify/dist/pnotify.css')
        .pipe(gulp.dest(app + '/lib/pnotify/css'));

    gulp.src('node_modules/pnotify/dist/pnotify.buttons.css')
        .pipe(gulp.dest(app + '/lib/pnotify/css'));

    gulp.src('node_modules/pnotify/dist/pnotify.js')
        .pipe(gulp.dest(app + '/lib/pnotify/js'));

    gulp.src('node_modules/pnotify/dist/pnotify.buttons.js')
        .pipe(gulp.dest(app + '/lib/pnotify/js'));

    gulp.src('node_modules/pnotify/dist/pnotify.callbacks.js')
        .pipe(gulp.dest(app + '/lib/pnotify/js'));

    gulp.src('node_modules/pnotify/dist/pnotify.confirm.js')
        .pipe(gulp.dest(app + '/lib/pnotify/js'));

    gulp.src('node_modules/pnotify/dist/pnotify.mobile.js')
        .pipe(gulp.dest(app + '/lib/pnotify/js'));

    // gulp.src('node_modules/corejs-typeahead/dist/typeahead.bundle.min.js')
    //     .pipe(gulp.dest(app + '/lib/corejs-typeahead'));

    gulp.src('node_modules/font-awesome/fonts/**/*')
        .pipe(gulp.dest(app + '/lib/font-awesome/fonts'));

    gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest(app + '/lib/font-awesome/css'));

    // gulp.src('node_modules/daterangepicker/daterangepicker.min.js')
    //     .pipe(gulp.dest(app + '/lib/daterangepicker/js'));
    // gulp.src('node_modules/daterangepicker/daterangepicker-bs3.min.css')
    //     .pipe(gulp.dest(app + '/lib/daterangepicker/css'));

    gulp.src('node_modules/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css')
        .pipe(gulp.dest(app + '/lib/bootstrap3-dialog/css'));

    gulp.src('node_modules/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js')
        .pipe(gulp.dest(app + '/lib/bootstrap3-dialog/js'));

    gulp.src('node_modules/bootstrap3-dialog/dist/locales/bootstrap-datepicker.pt-BR.min.js')
        .pipe(gulp.dest(app + '/lib/bootstrap3-dialog/locales'));

    // gulp.src('node_modules/bootstrap-fileinput/css/fileinput.min.css')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-fileinput/css'));

    // gulp.src('node_modules/bootstrap-fileinput/js/fileinput.min.js')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-fileinput/js'));

    // gulp.src('node_modules/bootstrap-fileinput/js/locales/pt-BR.js')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-fileinput/js/locales'));

    gulp.src('node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css')
        .pipe(gulp.dest(app + '/lib/bootstrap-switch/css'));

    gulp.src('node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js')
        .pipe(gulp.dest(app + '/lib/bootstrap-switch/js'));

    gulp.src('node_modules/sweetalert2/dist/sweetalert2.min.css')
        .pipe(gulp.dest(app + '/lib/sweetalert2/css'));

    gulp.src('node_modules/sweetalert2/dist/sweetalert2.min.js')
        .pipe(gulp.dest(app + '/lib/sweetalert2/js'));

    // gulp.src('node_modules/jquery-form-validator/form-validator/jquery.form-validator.min.js')
    //     .pipe(gulp.dest(app + '/lib/jquery-form-validator/js'));

    // gulp.src('node_modules/jquery-form-validator/form-validator/theme-default.min.css')
    //     .pipe(gulp.dest(app + '/lib/jquery-form-validator/css'));

    gulp.src('node_modules/icheck/icheck.min.js')
        .pipe(gulp.dest(app + '/lib/icheck'));

    gulp.src('node_modules/icheck/skins/square/*')
        .pipe(gulp.dest(app + '/lib/icheck/square'));

    // gulp.src('node_modules/jquery-mask-plugin/dist/jquery.mask.min.js')
    //     .pipe(gulp.dest(app + '/lib/jquery-mask/js'));

    gulp.src('node_modules/jquery.maskedinput/src/jquery.maskedinput.js')
        .pipe(gulp.dest(app + '/lib/jquery.maskedinput/js'));

    gulp.src('node_modules/fastclick/lib/fastclick.js')
        .pipe(gulp.dest(app + '/lib/fastclick'));

    // gulp.src('node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput.css')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-tagsinput/css'));

    // gulp.src('node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-tagsinput/js'));

    // gulp.src('node_modules/webui-popover/dist/jquery.webui-popover.min.css')
    //     .pipe(gulp.dest(app + '/lib/webui-popover/css'));

    // gulp.src('node_modules/webui-popover/dist/jquery.webui-popover.min.js')
    //     .pipe(gulp.dest(app + '/lib/webui-popover/js'));

    gulp.src('node_modules/pikaday/css/pikaday.css')
        .pipe(gulp.dest(app + '/lib/pikaday/css'));

    gulp.src('node_modules/pikaday/pikaday.js')
        .pipe(gulp.dest(app + '/lib/pikaday/js'));

    gulp.src('process/js/pikaday.pt-BR.js')
        .pipe(gulp.dest(app + '/lib/pikaday/js/locales'));

    // gulp.src('node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-datepicker/css'));

    // gulp.src('node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-datepicker/js'));

    // gulp.src('node_modules/bootstrap-datepicker/dist/locales/bootstrap-datepicker.pt-BR.min.js')
    //     .pipe(gulp.dest(app + '/lib/bootstrap-datepicker/locales'));

    // gulp.src('node_modules/jquery.counterup/jquery.counterup.min.js')
    //     .pipe(gulp.dest(app + '/lib/jquery.counterup/js'));

    // gulp.src('node_modules/fancybox/dist/img/*')
    //     .pipe(gulp.dest(app + '/lib/fancybox/img'));

    // gulp.src('node_modules/fancybox/dist/css/jquery.fancybox.css')
    //     .pipe(gulp.dest(app + '/lib/fancybox/css'));

    // gulp.src('node_modules/fancybox/dist/helpers/js/*.js')
    //     .pipe(gulp.dest(app + '/lib/fancybox/helpers/js'));

    // gulp.src('node_modules/fancybox/dist/js/*.js')
    //     .pipe(gulp.dest(app + '/lib/fancybox/js'));

    // gulp.src('node_modules/jquery-placeholder/jquery.placeholder.js')
    //     .pipe(gulp.dest(app + '/lib/jquery-placeholder/js'));

    gulp.src('node_modules/smoothscroll/smoothscroll.min.js')
        .pipe(gulp.dest(app + '/lib/smoothscroll/js'));

    gulp.src('node_modules/jquery-slimscroll/jquery.slimscroll.min.js')
        .pipe(gulp.dest(app + '/lib/jquery-slimscroll'));

    gulp.src('node_modules/ionicons/dist/css/ionicons.min.css')
        .pipe(gulp.dest(app + '/lib/ionicons/css'));

    gulp.src('node_modules/ionicons/dist/fonts/*')
        .pipe(gulp.dest(app + '/lib/ionicons/fonts'));

    gulp.src('node_modules/jquery.easing/jquery.easing.min.js')
        .pipe(gulp.dest(app + '/lib/jquery.easing/js'));

    // gulp.src('node_modules/rateyo/min/jquery.rateyo.min.css')
    //     .pipe(gulp.dest(app + '/lib/rateyo/css'));

    // gulp.src('node_modules/rateyo/min/jquery.rateyo.min.js')
    //     .pipe(gulp.dest(app + '/lib/rateyo/js'));

    gulp.src('node_modules/pace-js/themes/orange/pace-theme-flash.css')
        .pipe(gulp.dest(app + '/lib/pace-js/themes'));

    gulp.src('node_modules/pace-js/pace.min.js')
        .pipe(gulp.dest(app + '/lib/pace-js/js'));

    gulp.src('node_modules/jsgrid/dist/i18n/jsgrid-pt-br.js')
        .pipe(gulp.dest(app + '/lib/jsgrid/i18n'));

    gulp.src('node_modules/jsgrid/dist/jsgrid.min.js')
        .pipe(gulp.dest(app + '/lib/jsgrid/js'));

    gulp.src('node_modules/jsgrid/dist/jsgrid.min.css')
        .pipe(gulp.dest(app + '/lib/jsgrid/css'));

    gulp.src('node_modules/jsgrid/dist/jsgrid-theme.min.css')
        .pipe(gulp.dest(app + '/lib/jsgrid/css'));

    gulp.src('node_modules/hotkeys-js/dist/hotkeys.min.js')
        .pipe(gulp.dest(app + '/lib/hotkeys-js/js'));

    gulp.src('node_modules/jquery.scrollto/jquery.scrollTo.min.js')
        .pipe(gulp.dest(app + '/lib/jquery.scrollto/js'));

    // gulp.src('node_modules/autosize/dist/autosize.min.js')
    //     .pipe(gulp.dest(app + '/lib/autosize/js'));

    gulp.src('node_modules/ckeditor/*.js')
        .pipe(gulp.dest(app + '/lib/ckeditor'));

    gulp.src('node_modules/ckeditor/contents.css')
        .pipe(gulp.dest(app + '/lib/ckeditor'));

    gulp.src('node_modules/ckeditor/plugins/autogrow/*')
        .pipe(gulp.dest(app + '/lib/ckeditor/plugins/autogrow'));

    // gulp.src('node_modules/ckeditor/plugins/save/**')
    //     .pipe(gulp.dest(app + '/lib/ckeditor/plugins/save'));

    gulp.src('node_modules/ckeditor/skins/moono-lisa/**')
        .pipe(gulp.dest(app + '/lib/ckeditor/skins/moono-lisa'));

    gulp.src('node_modules/ckeditor/lang/pt-br.js')
        .pipe(gulp.dest(app + '/lib/ckeditor/lang'));

    gulp.src('node_modules/ckeditor/lang/en.js')
        .pipe(gulp.dest(app + '/lib/ckeditor/lang'));

    // gulp.src('node_modules/ContentTools/build/content-tools.min.css')
    //     .pipe(gulp.dest(app + '/lib/ContentTools'));

    // gulp.src('node_modules/ContentTools/build/content-tools.min.js')
    //     .pipe(gulp.dest(app + '/lib/ContentTools'));

    // gulp.src('node_modules/ContentTools/build/images/*')
    //     .pipe(gulp.dest(app + '/lib/ContentTools/images'));

    // gulp.src('node_modules/froala-editor/js/froala_editor.pkgd.min.js')
    //     .pipe(gulp.dest(app + '/lib/froala-editor/js'));

    // gulp.src('node_modules/froala-editor/css/froala_editor.pkgd.min.css')
    //     .pipe(gulp.dest(app + '/lib/froala-editor/css'));

    // gulp.src('node_modules/froala-editor/css/froala_style.min.css')
    //     .pipe(gulp.dest(app + '/lib/froala-editor/css'));

    // gulp.src('node_modules/froala-editor/js/languages/pt_br.js')
    //     .pipe(gulp.dest(app + '/lib/froala-editor/js/languages'));

    gulp.src('node_modules/bootstrap-validator/dist/validator.min.js')
        .pipe(gulp.dest(app + '/lib/bootstrap-validator/js'));

    gulp.src('process/lib/kendo/js/kendo.web.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.core.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.userevents.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.selectable.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.calendar.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.popup.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.datepicker.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.timepicker.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/kendo.datetimepicker.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js'));

    gulp.src('process/lib/kendo/js/cultures/kendo.culture.pt-BR.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js/cultures'));

    gulp.src('process/lib/kendo/js/messages/kendo.messages.pt-BR.min.js')
        .pipe(gulp.dest(app + '/lib/kendo/js/messages'));

    gulp.src('process/lib/kendo/styles/fonts/**')
        .pipe(gulp.dest(app + '/lib/kendo/Styles/fonts'));

    gulp.src('process/lib/kendo/styles/kendo.common.min.css')
        .pipe(gulp.dest(app + '/lib/kendo/styles'));

    gulp.src('process/lib/kendo/styles/kendo.common-bootstrap.min.css')
        .pipe(gulp.dest(app + '/lib/kendo/styles'));

    gulp.src('process/lib/kendo/styles/kendo.bootstrap.min.css')
        .pipe(gulp.dest(app + '/lib/kendo/styles'));

    gulp.src('process/lib/kendo/styles/bootstrap/**')
        .pipe(gulp.dest(app + '/lib/kendo/Styles/Bootstrap'));
});

gulp.task('imageMin', function () {
    gulp.src(src + '/img/**')
        .pipe(imagemin())
        .pipe(gulp.dest(app + '/img'))
});

// gulp.task('watch', ['serve'], function () {
//     gulp.watch(src + '/js/*', ['js']);
//     gulp.watch(src + '/css/*', ['css']);
// });

// gulp.task('serve', ['js', 'css', 'imageMin'], function () {
//     run('node ./bin/www').exec();
// });

// gulp.task('default', ['watch', 'vendors', 'serve']);

gulp.task('watch', ['js', 'css', 'imageMin'], function () {
    gulp.watch(src + '/js/**', ['js']);
    gulp.watch(src + '/css/**', ['css']);
});

gulp.task('default', ['watch', 'vendors']);