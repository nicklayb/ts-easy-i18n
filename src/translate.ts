import { LanguageBundle, Dictionary } from './types';

const DEFAULT_LOCALE: string = 'en';
const KEY_SPLITTER: string = '.';
let _currentLocale = DEFAULT_LOCALE;

let lang: Dictionary<LanguageBundle> = {};

function localeIsAvailable(locale: string): boolean {
    return !!lang[locale];
}

function setCurrentLocale(currentLocale: string): void {
    _currentLocale = (localeIsAvailable(currentLocale)) ? currentLocale : DEFAULT_LOCALE;
}

function getCurrentLocale(): string {
    return _currentLocale;
}

function bindParams(text: string, params: Dictionary<any>): string {
    for (let key in params) {
        let qualifiedKey = ':' + key;
        text = text.replace(qualifiedKey, params[key]);
    }
    return text;
}

function getLocaleBundle(): LanguageBundle {
    return lang[getCurrentLocale()];
}

function getLocaleText(slug: string): string {
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

function trans(text: string, params: Dictionary<Object>): string {
    return bindParams(getLocaleText(text), params);
}

function registerLang(languageKey: string, translation = {}): void {
    lang[languageKey] = translation;
}

function getLanguages(): Dictionary<LanguageBundle> {
    return lang;
}

export {
    trans,
    getLanguages,
    setCurrentLocale,
    getCurrentLocale,
    getLocaleText,
    registerLang
};
