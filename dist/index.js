"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_LOCALE = 'en';
const KEY_SPLITTER = '.';
let _currentLocale = DEFAULT_LOCALE;
let lang = {};
function localeIsAvailable(locale) {
    return !!lang[locale];
}
function setCurrentLocale(currentLocale) {
    _currentLocale = (localeIsAvailable(currentLocale)) ? currentLocale : DEFAULT_LOCALE;
}
exports.setCurrentLocale = setCurrentLocale;
function getCurrentLocale() {
    return _currentLocale;
}
exports.getCurrentLocale = getCurrentLocale;
function bindParams(text, params) {
    for (let key in params) {
        let qualifiedKey = ':' + key;
        text = text.replace(qualifiedKey, params[key]);
    }
    return text;
}
function getLocaleBundle() {
    return lang[getCurrentLocale()];
}
function getLocaleText(slug) {
    if (slug && slug.constructor === String) {
        const splitted = slug.toString().split(KEY_SPLITTER);
        let list = getLocaleBundle();
        for (let i = 0; i < splitted.length; i++) {
            const current = list[splitted[i]];
            if (current) {
                if (current.constructor === String) {
                    return current.toString();
                }
                list = current;
            }
        }
    }
    return slug;
}
exports.getLocaleText = getLocaleText;
function trans(text, params) {
    return bindParams(getLocaleText(text), params);
}
exports.trans = trans;
function registerLang(languageKey, translation = {}) {
    lang[languageKey] = translation;
}
exports.registerLang = registerLang;
function getLanguages() {
    return lang;
}
exports.getLanguages = getLanguages;
