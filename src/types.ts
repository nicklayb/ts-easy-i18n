interface Dictionary<T> {
    [key: string]: T;
}

type LanguageBundle = Dictionary<any>;
type Formatter = (text: string, ...params: any[]) => string;
type FormatterBundle = Dictionary<Formatter>;

export {
    Formatter,
    FormatterBundle,
    LanguageBundle,
    Dictionary
};
