import { trans, getLanguages, setCurrentLocale, getCurrentLocale, registerLang, getLocaleText } from './translate';
import { format, registerFormatters, getFormatters } from './formatters';

function process(text:string, params = {}, ...formatterKeys: string []) {
    return format(trans(text, params), formatterKeys);
}

export {
    getLanguages,
    getCurrentLocale,
    setCurrentLocale,
    registerLang,
    getLocaleText,

    trans,

    format,
    getFormatters,
    registerFormatters,

    process
};
