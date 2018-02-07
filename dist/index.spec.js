"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-env mocha */
const chai_1 = require("chai");
const i18n = __importStar(require("../src/index"));
require("mocha");
const index_1 = require("../src/index");
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
const uc = (text, params) => text.toUpperCase();
const surround = (text, params) => params ? params[0] + text + params[1] : text;
describe('trans', () => {
    beforeEach(beforeTrans);
    it('should translate hi with a name', () => {
        const key = 'hi';
        const name = 'Bob';
        const expectation = `Hi ${name}`;
        const result = i18n.trans(key, {
            name
        });
        chai_1.expect(result).equal(expectation);
    });
    it('should translate an unparametered text', () => {
        const key = 'how_are_you';
        const locale = 'en';
        const expectation = i18n.getLanguages()[locale][key];
        const result = i18n.trans(key);
        chai_1.expect(result).equal(expectation);
    });
    it('should return the same key', () => {
        const key = 'is_this_the_real_life';
        const expectation = key;
        const result = i18n.trans(key);
        chai_1.expect(result).equal(expectation);
    });
    it('should translate how are you to french', () => {
        const key = 'how_are_you';
        const locale = 'fr';
        const expectation = i18n.getLanguages()[locale][key];
        i18n.setCurrentLocale(locale);
        const result = i18n.trans(key);
        chai_1.expect(result).equal(expectation);
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
        chai_1.expect(i18n.getLanguages()[key]).equal(trans);
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
        chai_1.expect(i18n.trans(text_key)).equal(trans[text_key]);
    });
});
describe('getCurrentLocale', () => {
    beforeEach(beforeTrans);
    it('should change the locale to french', () => {
        const locale = 'fr';
        i18n.setCurrentLocale(locale);
        const result = i18n.getCurrentLocale();
        chai_1.expect(result).equal(locale);
    });
});
describe('registerFormatters', () => {
    it('should register an uppercase formatter', () => {
        i18n.registerFormatters({
            uc
        });
        chai_1.expect(i18n.getFormatters()['uc']).equal(uc);
    });
});
describe('format', () => {
    it('should format a name to uppercase', () => {
        const baseText = 'John';
        const expectation = baseText.toUpperCase();
        i18n.registerFormatters({
            uc
        });
        chai_1.expect(i18n.format(baseText, 'uc'.split('|'))).equal(expectation);
    });
    it('should format a name to uppercase and split surround with parentheses', () => {
        const baseText = 'John';
        const expectation = '(' + baseText.toUpperCase() + ')';
        i18n.registerFormatters({
            uc, surround
        });
        chai_1.expect(i18n.format(baseText, 'uc|surround:(,)'.split('|'))).equal(expectation);
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
        chai_1.expect(i18n.process(key, params, formatters)).equal(expectation);
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
        chai_1.expect(i18n.getLocaleText('account.profile')).equal(trans.account.profile);
    });
    it('should gives correct Firstname', () => {
        chai_1.expect(i18n.getLocaleText('account.user.firstname')).equal(trans.account.user.firstname);
    });
    it('should gives incorrect email', () => {
        const key = 'account.user.email';
        chai_1.expect(i18n.getLocaleText(key)).equal(key);
    });
    it('should gives incorrect user', () => {
        const key = 'account.user';
        chai_1.expect(i18n.getLocaleText(key)).equal(key);
    });
});
describe('transChoice', () => {
    const trans = {
        account: {
            posts: [
                index_1.createExactRule('No post', 0),
                index_1.createExactRule('Some posts'),
            ],
            comments: [
                index_1.createExactRule('No comment', 0),
                index_1.createRangeRule('Many comments', 1, 5),
                index_1.createRangeRule('A lot of comments', 6),
            ],
            followers: [
                index_1.createExactRule('No follower', 0),
                index_1.createExactRule(':count followers')
            ],
            status: [
                index_1.createExactRule(':fullname does not have friends', 0),
                index_1.createExactRule(':fullname has :count friends'),
            ]
        }
    };
    beforeEach(() => {
        i18n.registerLang('en', trans);
        i18n.setCurrentLocale('en');
    });
    it('should translate without plural', () => {
        const key = 'account.posts';
        chai_1.expect(i18n.transChoice(key, 0)).equal(trans.account.posts[0].text);
    });
    it('should translate with plural', () => {
        const key = 'account.posts';
        chai_1.expect(i18n.transChoice(key, 2)).equal(trans.account.posts[1].text);
    });
    it('should translate with quantity', () => {
        const key = 'account.comments';
        chai_1.expect(i18n.transChoice(key, 0)).equal(trans.account.comments[0].text);
    });
    it('should translate with quantity in range', () => {
        const key = 'account.comments';
        chai_1.expect(i18n.transChoice(key, 3)).equal(trans.account.comments[1].text);
    });
    it('should translate with quantity at maximum', () => {
        const key = 'account.comments';
        chai_1.expect(i18n.transChoice(key, 100)).equal(trans.account.comments[2].text);
    });
    it('should translate with implicit param', () => {
        const key = 'account.followers';
        const count = 100;
        chai_1.expect(i18n.transChoice(key, count)).equal(trans.account.followers[1].text.replace(':count', count.toString()));
    });
    it('should translate with explicit param', () => {
        const key = 'account.status';
        const count = 100;
        const fullname = 'Super Mario';
        chai_1.expect(i18n.transChoice(key, count, { fullname })).equal(trans.account.status[1].text.replace(':count', count.toString()).replace(':fullname', fullname));
    });
});
