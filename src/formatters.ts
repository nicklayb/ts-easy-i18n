import { FormatterBundle, Formatter, Formattable, Dictionary } from './types';

const PARAM_SPLITTER = ',';
const KEY_SPLITTER = '|';
const ARGS_SPLITTER = ':';

let formatters: FormatterBundle = {};

function formatterExists(formatter: string) {
    return (formatters[formatter]);
}

function parseFormatter(key: string) : Formattable {
    let params: any[] = [];
    if (key.includes(ARGS_SPLITTER)) {
        const paramIndex = key.indexOf(ARGS_SPLITTER);
        params = key.slice((paramIndex + 1)).split(PARAM_SPLITTER);
        key = key.slice(0, paramIndex);
    }
    return { key, params };
}

function extractFormatters(formatString: string): Formattable[] {
    return formatString.split(KEY_SPLITTER).map(parseFormatter);
}

function parseFormatters(formatterKeys: string[]) {
    return formatterKeys.map(parseFormatter);
}

function format(text: string, formatterKeys: string[] = []): string {
    parseFormatters(formatterKeys).forEach(formatter => {
        text = (formatterExists(formatter.key)) ? formatters[formatter.key](text, formatter.params) : text;
    });
    return text;
}

function registerFormatters(newFormatters: Dictionary<Formatter>) {
    formatters = Object.assign({}, formatters, newFormatters);
}

function getFormatters(): FormatterBundle {
    return formatters;
}

export {
    format,
    getFormatters,
    registerFormatters,
    extractFormatters
};
