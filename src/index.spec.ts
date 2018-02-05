/* eslint-env mocha */
import { expect } from 'chai';
import * as i18n from '../src/index';
import 'mocha';

const beforeTrans = () => {
    i18n.registerLang('en', {
        hi: 'Hi :name',
        how_are_you: 'How are you?'
    });

    i18n.registerLang('fr', {
        hi: 'Bonjour :name',
        how_are_you: 'Comment allez-vous?'
    });
    i18n.setCurrentLocale('en');
};

const uc = (text: string): string => text.toUpperCase();
const surround = (text: string, params: string[]) => args[0] + text + args[1];

describe('trans', () => {
    beforeEach(beforeTrans);

    it('should translate hi with a name', () => {
        const key = 'hi';
        const expectation = 'Hi Bob';
        const result = i18n.trans(key, {
            name: 'Bob'
        });
        expect(result).equal(expectation);
    });

    it('should translate an unparametered text', () => {
        const key = 'how_are_you';
        const locale = 'en';
        const expectation = i18n.getLanguages()[locale][key];
        const result = i18n.trans(key);
        expect(result).equal(expectation);
    });

    it('should return the same key', () => {
        const key = 'is_this_the_real_life';
        const expectation = key;
        const result = i18n.trans(key);
        expect(result).equal(expectation);
    });

    it('should translate how are you to french', () => {
        const key = 'how_are_you';
        const locale = 'fr';
        const expectation = i18n.getLanguages()[locale][key];
        i18n.setCurrentLocale(locale);
        const result = i18n.trans(key);
        expect(result).equal(expectation);
    });
});

describe('registerLang', () => {
    beforeEach(beforeTrans);
    it('should register deutsch as a new language', () => {
        const key = 'de';
        const trans = {
            hi: 'Guten Tag :name',
            how_are_you: 'Wie geht es dir?'
        };
        i18n.registerLang(key, trans);
        expect(i18n.getLanguages()[key]).equal(trans);
    });
});

describe('setCurrentLocale', () => {
    beforeEach(beforeTrans);
    it('should translate with a newly added deutsch language', () => {
        const key = 'de';
        const text_key = 'hi';
        const trans = {
            hi: 'Guten Tag :name',
            how_are_you: 'Wie geht es dir?'
        };
        i18n.registerLang(key, trans);
        i18n.setCurrentLocale(key);
        expect(i18n.trans(text_key)).equal(trans[text_key]);
    });
});

describe('getCurrentLocale', () => {
    beforeEach(beforeTrans);
    it('should change the locale to french', () => {
        const locale = 'fr';
        i18n.setCurrentLocale(locale);
        const result = i18n.getCurrentLocale();
        expect(result).equal(locale);
    });
});

describe('registerFormatters', () => {
    it('should register an uppercase formatter', () => {
        i18n.registerFormatters({
            uc
        });
        expect(i18n.getFormatters()['uc']).equal(uc);
    });
});

describe('format', () => {
    it('should format a name to uppercase', () => {
        const baseText = 'John';
        const expectation = baseText.toUpperCase();
        i18n.registerFormatters({
            uc
        });
        expect(i18n.format(baseText, 'uc'.split('|'))).equal(expectation);
    });

    it('should format a name to uppercase and split surround with parentheses', () => {
        const baseText = 'John';
        const expectation = '(' + baseText.toUpperCase() + ')';
        i18n.registerFormatters({
            uc, surround
        });
        expect(i18n.format(baseText, 'uc|surround:(,)'.split('|'))).equal(expectation);
    });
});

describe('process', () => {
    beforeEach(beforeTrans);
    it('should translate and format a text', () => {
        const key = 'hi';
        const params = { name: 'John' };
        const formatters = 'uc|surround:(,)'.split('|');
        i18n.registerFormatters({
            uc,
            surround,
        });
        const expectation = '(Hi John)'.toUpperCase();
        expect(i18n.process(key, params, formatters)).equal(expectation);
    });
});

describe('getLocaleText', () => {
    const trans = {
        account: {
            user: {
                firstname: 'Firstname',
                lastname: 'Lastname',
            },
            profile: 'Profile'
        }
    };
    beforeEach(() => {
        i18n.registerLang('en', trans);
        i18n.setCurrentLocale('en');
    });

    it('should gives correct Profile', () => {
        expect(i18n.getLocaleText('account.profile')).equal(trans.account.profile);
    });

    it('should gives correct Firstname', () => {
        expect(i18n.getLocaleText('account.user.firstname')).equal(trans.account.user.firstname);
    });

    it('should gives incorrect email', () => {
        const key = 'account.user.email';
        expect(i18n.getLocaleText(key)).equal(key);
    });

    it('should gives incorrect user', () => {
        const key = 'account.user';
        expect(i18n.getLocaleText(key)).equal(key);
    });
});

// describe('sayHello', () => {
//     beforeEach(() => {
//         dom.create();
//         sayHello();
//     });
//
//     afterEach(() => {
//         dom.destroy();
//     });
//
//     it('it adds <p> element to <body> in the document', () => {
//         expect(document.querySelectorAll('p').length).equal(1);
//     });
// });
