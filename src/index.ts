import { trans,
    getLanguages,
    setCurrentLocale,
    getCurrentLocale,
    registerLang,
    getLocaleText
} from './translate';
import { format,
    registerFormatters,
    getFormatters,
    extractFormatters
} from './formatters';
import { Dictionary } from './types';

function process(text:string, params:Dictionary<any> = {}, formatterKeys: string [] = []) {
    let translatedText = trans(text, params);
    return format(translatedText, formatterKeys);
}

export {
    getLanguages,
    getCurrentLocale,
    setCurrentLocale,
    registerLang,
    getLocaleText,
    extractFormatters,

    trans,

    format,
    getFormatters,
    registerFormatters,

    process
};
