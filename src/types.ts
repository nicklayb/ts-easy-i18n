interface Dictionary<T> {
    [key: string]: T;
}

interface Formattable {
    key: string,
    params: any[]
}

type LanguageBundle = Dictionary<any>;
type Formatter = (text: string, params?: any[]) => string;
type FormatterBundle = Dictionary<Formatter>;

export {
    Formatter,
    FormatterBundle,
    LanguageBundle,
    Dictionary,
    Formattable
};
