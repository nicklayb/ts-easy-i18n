"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const translate_1 = require("./translate");
class ExactRule {
    constructor(text, count) {
        this.count = (count !== undefined) ? count : null;
        this.text = text;
    }
    evaluate(count) {
        return (this.count === null || this.count === count);
    }
}
class RangeRule {
    constructor(text, min, max) {
        this.max = max !== undefined ? max : Infinity;
        this.min = min;
        this.text = text;
    }
    evaluate(count) {
        return count >= this.min && (!this.max || count <= this.max);
    }
}
function createExactRule(text, count) {
    return new ExactRule(text, count);
}
exports.createExactRule = createExactRule;
function createRangeRule(text, min = 0, max) {
    return new RangeRule(text, min, max);
}
exports.createRangeRule = createRangeRule;
function pluralize(rules, count) {
    for (let key in rules) {
        const rule = rules[key];
        if (rule.evaluate(count)) {
            return rule.text;
        }
    }
    return rules[0].text;
}
function transChoice(slug, count, params) {
    const translated = translate_1.getLocaleObject(slug);
    let text = slug;
    if (translated.constructor === Array) {
        text = pluralize(translated, count);
    }
    else if (translated.constructor === String) {
        text = translated;
    }
    params = Object.assign(params || {}, { count });
    return translate_1.bindParams(text, params);
}
exports.transChoice = transChoice;
