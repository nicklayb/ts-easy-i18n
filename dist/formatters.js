"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var PARAM_SPLITTER = ',';
var KEY_SPLITTER = '|';
var ARGS_SPLITTER = ':';
var formatters = {};
function formatterExists(formatter) {
    return formatters[formatter];
}
function parseFormatter(key) {
    var params = [];
    if (key.includes(ARGS_SPLITTER)) {
        var paramIndex = key.indexOf(ARGS_SPLITTER);
        params = key.slice(paramIndex + 1).split(PARAM_SPLITTER);
        key = key.slice(0, paramIndex);
    }
    return { key: key, params: params };
}
function extractFormatters(formatString) {
    return formatString.split(KEY_SPLITTER).map(parseFormatter);
}
exports.extractFormatters = extractFormatters;
function parseFormatters(formatterKeys) {
    return formatterKeys.map(parseFormatter);
}
function format(text) {
    var formatterKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    parseFormatters(formatterKeys).forEach(function (formatter) {
        text = formatterExists(formatter.key) ? formatters[formatter.key](text, formatter.params) : text;
    });
    return text;
}
exports.format = format;
function registerFormatters(newFormatters) {
    formatters = (0, _assign2.default)({}, formatters, newFormatters);
}
exports.registerFormatters = registerFormatters;
function getFormatters() {
    return formatters;
}
exports.getFormatters = getFormatters;