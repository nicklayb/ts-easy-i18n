"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_LOCALE = 'en';
const KEY_SPLITTER = '.';
let _currentLocale = DEFAULT_LOCALE;
const returnables = [Array, String];
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
        let qualifiedKey = `:${key}`;
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
        let list = getLocaleBundle();
        const splitted = slug.split('.');
        for (let i = 0; i < splitted.length; i++) {
            const next = list[splitted[i]];
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
    const object = getLocaleObject(slug);
    return (object.constructor === String) ? object : slug;
}
exports.getLocaleText = getLocaleText;
function trans(text, params) {
    return (params) ? bindParams(getLocaleText(text), params) : bindParams(getLocaleText(text), {});
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
