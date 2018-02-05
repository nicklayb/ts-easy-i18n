interface Dictionary<T> {
    [key: string]: T;
}

interface Formattable {
    key: string,
    params: any[]
}

interface Formatter {
    (text: string, params?: any[]): string
}

type LanguageBundle = Dictionary<any>;
type FormatterBundle = Dictionary<Formatter>;

export {
    Formatter,
    FormatterBundle,
    LanguageBundle,
    Dictionary,
    Formattable
};
