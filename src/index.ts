import 'polyfill-array-includes';
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
import {
    transChoice,
    createExactRule,
    createRangeRule
} from './translateChoice';
import { Dictionary } from './types';

function processChoice(text:string, count:number, params?:Dictionary<any>, formatterKeys?: string []) {
    return format(transChoice(text, count, params || {}), formatterKeys || []);
}

function process(text:string, params?:Dictionary<any>, formatterKeys?: string []) {
    return format(trans(text, params || {}), formatterKeys || []);
}

export {
    getLanguages,
    getCurrentLocale,
    setCurrentLocale,
    registerLang,
    getLocaleText,
    extractFormatters,

    trans,

    transChoice,
    createExactRule,
    createRangeRule,

    format,
    getFormatters,
    registerFormatters,

    process,
    processChoice
};
