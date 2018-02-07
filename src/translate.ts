import { LanguageBundle, Dictionary } from './types';

const DEFAULT_LOCALE: string = 'en';
const KEY_SPLITTER: string = '.';

let _currentLocale = DEFAULT_LOCALE;

const returnables = [Array, String];

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
        let qualifiedKey = `:${key}`;
        text = text.replace(qualifiedKey, params[key]);
    }
    return text;
}

function getLocaleBundle(): LanguageBundle {
    return lang[getCurrentLocale()];
}

function getLocaleObject(slug: string): any {
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

function getLocaleText(slug: string): string {
    const object = getLocaleObject(slug);
    return (object.constructor === String) ? object : slug;
}

function trans(text: string, params?: Dictionary<Object>): string {
    return (params) ? bindParams(getLocaleText(text), params) : bindParams(getLocaleText(text), {});
}

function registerLang(languageKey: string, translation = {}): void {
    lang[languageKey] = translation;
}

function getLanguages(): Dictionary<LanguageBundle> {
    return lang;
}

export {
    trans,
    bindParams,
    getLanguages,
    setCurrentLocale,
    getCurrentLocale,
    getLocaleText,
    getLocaleObject,
    registerLang
};
