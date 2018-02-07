import { LanguageBundle, Dictionary } from './types';
import {
    trans,
    bindParams,
    getLocaleObject
} from './translate';

interface EvaluableRule {
    text: string;
    evaluate: (count: number) => boolean;
}

class ExactRule implements EvaluableRule {
    count: number | null;
    text: string;
    constructor(text: string, count?: number) {
        this.count = (count !== undefined) ? count : null;
        this.text = text;
    }

    evaluate(count: number) {
        return (this.count === null || this.count === count);
    }
}

class RangeRule implements EvaluableRule {
    min: number;
    max: number | null;
    text: string;

    constructor(text: string, min: number, max?: number) {
        this.max = max !== undefined ? max : Infinity;
        this.min = min;
        this.text = text;
    }

    evaluate(count: number) {
        return count >= this.min && (!this.max || count <= this.max);
    }
}

function createExactRule(text: string, count?: number) : ExactRule {
    return new ExactRule(text, count);
}

function createRangeRule(text: string, min: number = 0, max?: number) : RangeRule {
    return new RangeRule(text, min, max);
}

function pluralize(rules: EvaluableRule[], count: number): string {
    for (let key in rules) {
        const rule = rules[key];
        if (rule.evaluate(count)) {
            return rule.text;
        }
    }
    return rules[0].text;
}

function transChoice(slug: string, count: number, params?: Dictionary<Object>): string {
    const translated = getLocaleObject(slug);
    let text = slug;
    if (translated.constructor === Array) {
        text = pluralize(translated, count);
    } else if (translated.constructor === String) {
        text = translated;
    }
    params = Object.assign(params || {}, { count });
    return bindParams(text, params);
}

export {
    transChoice,
    createExactRule,
    createRangeRule
};
