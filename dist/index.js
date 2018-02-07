"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translate_1 = require("./translate");
exports.trans = translate_1.trans;
exports.getLanguages = translate_1.getLanguages;
exports.setCurrentLocale = translate_1.setCurrentLocale;
exports.getCurrentLocale = translate_1.getCurrentLocale;
exports.registerLang = translate_1.registerLang;
exports.getLocaleText = translate_1.getLocaleText;
const formatters_1 = require("./formatters");
exports.format = formatters_1.format;
exports.registerFormatters = formatters_1.registerFormatters;
exports.getFormatters = formatters_1.getFormatters;
exports.extractFormatters = formatters_1.extractFormatters;
const translateChoice_1 = require("./translateChoice");
exports.transChoice = translateChoice_1.transChoice;
exports.createExactRule = translateChoice_1.createExactRule;
exports.createRangeRule = translateChoice_1.createRangeRule;
function process(text, params, formatterKeys) {
    return formatters_1.format(translate_1.trans(text, params || {}), formatterKeys || []);
}
exports.process = process;
