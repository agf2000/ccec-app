const moment = require('moment');

module.exports.currency = function (value) {
    return "R$ " + parseFloat(value).toFixed(2);
};

module.exports.percent = function (value) {
    return "% " + parseFloat(value).toFixed(2);
};

module.exports.decimals = function (value) {
    return parseFloat(value).toFixed(2);
};

module.exports.json = function (context) {
    return JSON.stringify(context);
};

module.exports.formatDateFromNow = function (date) {
    return moment(date).fromNow();
};

module.exports.stringFilename = function (fileName) {
    return fileName.replace(/(\.[\w\d_-]+)$/i, '_thumb$1');
};

module.exports.formatRating = function (rating) {
    return rating.toFixed(1) + ' de 5 (Clique para avaliar)';
};

module.exports.formatPostTitle = function (title) {
    return 'Compro ' + title.replace('Compro', '')
};

module.exports.ifCond = function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
};