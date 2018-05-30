"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_LOCALE = 'en';
var KEY_SPLITTER = '.';
var _currentLocale = DEFAULT_LOCALE;
var returnables = [Array, String];
var lang = {};
function localeIsAvailable(locale) {
    return !!lang[locale];
}
function setCurrentLocale(currentLocale) {
    _currentLocale = localeIsAvailable(currentLocale) ? currentLocale : DEFAULT_LOCALE;
}
exports.setCurrentLocale = setCurrentLocale;
function getCurrentLocale() {
    return _currentLocale;
}
exports.getCurrentLocale = getCurrentLocale;
function bindParams(text, params) {
    for (var key in params) {
        var qualifiedKey = ":" + key;
        text = text.replace(qualifiedKey, params[key]);
    }
    return text;
}
exports.bindParams = bindParams;
function getLocaleBundle() {
    return lang[getCurrentLocale()];
}
function getLocaleObject(slug) {
    if (slug && slug.constructor === String) {
        var list = getLocaleBundle();
        var splitted = slug.split('.');
        for (var i = 0; i < splitted.length; i++) {
            var next = list[splitted[i]];
            if (next) {
                if (returnables.includes(next.constructor)) {
                    return next;
                }
                list = next;
            }
        }
    }
    return slug;
}
exports.getLocaleObject = getLocaleObject;
function getLocaleText(slug) {
    var object = getLocaleObject(slug);
    return object.constructor === String ? object : slug;
}
exports.getLocaleText = getLocaleText;
function trans(text, params) {
    return params ? bindParams(getLocaleText(text), params) : bindParams(getLocaleText(text), {});
}
exports.trans = trans;
function registerLang(languageKey) {
    var translation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    lang[languageKey] = translation;
}
exports.registerLang = registerLang;
function getLanguages() {
    return lang;
}
exports.getLanguages = getLanguages;