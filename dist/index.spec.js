"use strict";

var __importStar = undefined && undefined.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-env mocha */
var chai_1 = require("chai");
var i18n = __importStar(require("../src/index"));
require("mocha");
var index_1 = require("../src/index");
var beforeTrans = function beforeTrans() {
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
var uc = function uc(text, params) {
    return text.toUpperCase();
};
var surround = function surround(text, params) {
    return params ? params[0] + text + params[1] : text;
};
describe('trans', function () {
    beforeEach(beforeTrans);
    it('should translate hi with a name', function () {
        var key = 'hi';
        var name = 'Bob';
        var expectation = "Hi " + name;
        var result = i18n.trans(key, {
            name: name
        });
        chai_1.expect(result).equal(expectation);
    });
    it('should translate an unparametered text', function () {
        var key = 'how_are_you';
        var locale = 'en';
        var expectation = i18n.getLanguages()[locale][key];
        var result = i18n.trans(key);
        chai_1.expect(result).equal(expectation);
    });
    it('should return the same key', function () {
        var key = 'is_this_the_real_life';
        var expectation = key;
        var result = i18n.trans(key);
        chai_1.expect(result).equal(expectation);
    });
    it('should translate how are you to french', function () {
        var key = 'how_are_you';
        var locale = 'fr';
        var expectation = i18n.getLanguages()[locale][key];
        i18n.setCurrentLocale(locale);
        var result = i18n.trans(key);
        chai_1.expect(result).equal(expectation);
    });
});
describe('registerLang', function () {
    beforeEach(beforeTrans);
    it('should register deutsch as a new language', function () {
        var key = 'de';
        var trans = {
            hi: 'Guten Tag :name',
            how_are_you: 'Wie geht es dir?'
        };
        i18n.registerLang(key, trans);
        chai_1.expect(i18n.getLanguages()[key]).equal(trans);
    });
});
describe('setCurrentLocale', function () {
    beforeEach(beforeTrans);
    it('should translate with a newly added deutsch language', function () {
        var key = 'de';
        var text_key = 'hi';
        var trans = {
            hi: 'Guten Tag :name',
            how_are_you: 'Wie geht es dir?'
        };
        i18n.registerLang(key, trans);
        i18n.setCurrentLocale(key);
        chai_1.expect(i18n.trans(text_key)).equal(trans[text_key]);
    });
});
describe('getCurrentLocale', function () {
    beforeEach(beforeTrans);
    it('should change the locale to french', function () {
        var locale = 'fr';
        i18n.setCurrentLocale(locale);
        var result = i18n.getCurrentLocale();
        chai_1.expect(result).equal(locale);
    });
});
describe('registerFormatters', function () {
    it('should register an uppercase formatter', function () {
        i18n.registerFormatters({
            uc: uc
        });
        chai_1.expect(i18n.getFormatters()['uc']).equal(uc);
    });
});
describe('format', function () {
    it('should format a name to uppercase', function () {
        var baseText = 'John';
        var expectation = baseText.toUpperCase();
        i18n.registerFormatters({
            uc: uc
        });
        chai_1.expect(i18n.format(baseText, 'uc'.split('|'))).equal(expectation);
    });
    it('should format a name to uppercase and split surround with parentheses', function () {
        var baseText = 'John';
        var expectation = '(' + baseText.toUpperCase() + ')';
        i18n.registerFormatters({
            uc: uc, surround: surround
        });
        chai_1.expect(i18n.format(baseText, 'uc|surround:(,)'.split('|'))).equal(expectation);
    });
});
describe('process', function () {
    beforeEach(beforeTrans);
    it('should translate and format a text', function () {
        var key = 'hi';
        var params = { name: 'John' };
        var formatters = 'uc|surround:(,)'.split('|');
        i18n.registerFormatters({
            uc: uc,
            surround: surround
        });
        var expectation = '(Hi John)'.toUpperCase();
        chai_1.expect(i18n.process(key, params, formatters)).equal(expectation);
    });
});
describe('getLocaleText', function () {
    var trans = {
        account: {
            user: {
                firstname: 'Firstname',
                lastname: 'Lastname'
            },
            profile: 'Profile'
        }
    };
    beforeEach(function () {
        i18n.registerLang('en', trans);
        i18n.setCurrentLocale('en');
    });
    it('should gives correct Profile', function () {
        chai_1.expect(i18n.getLocaleText('account.profile')).equal(trans.account.profile);
    });
    it('should gives correct Firstname', function () {
        chai_1.expect(i18n.getLocaleText('account.user.firstname')).equal(trans.account.user.firstname);
    });
    it('should gives incorrect email', function () {
        var key = 'account.user.email';
        chai_1.expect(i18n.getLocaleText(key)).equal(key);
    });
    it('should gives incorrect user', function () {
        var key = 'account.user';
        chai_1.expect(i18n.getLocaleText(key)).equal(key);
    });
});
describe('transChoice', function () {
    var trans = {
        account: {
            posts: [index_1.createExactRule('No post', 0), index_1.createExactRule('Some posts')],
            comments: [index_1.createExactRule('No comment', 0), index_1.createRangeRule('Many comments', 1, 5), index_1.createRangeRule('A lot of comments', 6)],
            followers: [index_1.createExactRule('No follower', 0), index_1.createExactRule(':count followers')],
            status: [index_1.createExactRule(':fullname does not have friends', 0), index_1.createExactRule(':fullname has :count friends')]
        }
    };
    beforeEach(function () {
        i18n.registerLang('en', trans);
        i18n.setCurrentLocale('en');
    });
    it('should translate without plural', function () {
        var key = 'account.posts';
        chai_1.expect(i18n.transChoice(key, 0)).equal(trans.account.posts[0].text);
    });
    it('should translate with plural', function () {
        var key = 'account.posts';
        chai_1.expect(i18n.transChoice(key, 2)).equal(trans.account.posts[1].text);
    });
    it('should translate with quantity', function () {
        var key = 'account.comments';
        chai_1.expect(i18n.transChoice(key, 0)).equal(trans.account.comments[0].text);
    });
    it('should translate with quantity in range', function () {
        var key = 'account.comments';
        chai_1.expect(i18n.transChoice(key, 3)).equal(trans.account.comments[1].text);
    });
    it('should translate with quantity at maximum', function () {
        var key = 'account.comments';
        chai_1.expect(i18n.transChoice(key, 100)).equal(trans.account.comments[2].text);
    });
    it('should translate with implicit param', function () {
        var key = 'account.followers';
        var count = 100;
        chai_1.expect(i18n.transChoice(key, count)).equal(trans.account.followers[1].text.replace(':count', count.toString()));
    });
    it('should translate with explicit param', function () {
        var key = 'account.status';
        var count = 100;
        var fullname = 'Super Mario';
        chai_1.expect(i18n.transChoice(key, count, { fullname: fullname })).equal(trans.account.status[1].text.replace(':count', count.toString()).replace(':fullname', fullname));
    });
});