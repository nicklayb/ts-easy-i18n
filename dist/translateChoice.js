"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var translate_1 = require("./translate");

var ExactRule = function () {
    function ExactRule(text, count) {
        (0, _classCallCheck3.default)(this, ExactRule);

        this.count = count !== undefined ? count : null;
        this.text = text;
    }

    (0, _createClass3.default)(ExactRule, [{
        key: "evaluate",
        value: function evaluate(count) {
            return this.count === null || this.count === count;
        }
    }]);
    return ExactRule;
}();

var RangeRule = function () {
    function RangeRule(text, min, max) {
        (0, _classCallCheck3.default)(this, RangeRule);

        this.max = max !== undefined ? max : Infinity;
        this.min = min;
        this.text = text;
    }

    (0, _createClass3.default)(RangeRule, [{
        key: "evaluate",
        value: function evaluate(count) {
            return count >= this.min && (!this.max || count <= this.max);
        }
    }]);
    return RangeRule;
}();

function createExactRule(text, count) {
    return new ExactRule(text, count);
}
exports.createExactRule = createExactRule;
function createRangeRule(text) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var max = arguments[2];

    return new RangeRule(text, min, max);
}
exports.createRangeRule = createRangeRule;
function pluralize(rules, count) {
    for (var key in rules) {
        var rule = rules[key];
        if (rule.evaluate(count)) {
            return rule.text;
        }
    }
    return rules[0].text;
}
function transChoice(slug, count, params) {
    var translated = translate_1.getLocaleObject(slug);
    var text = slug;
    if (translated.constructor === Array) {
        text = pluralize(translated, count);
    } else if (translated.constructor === String) {
        text = translated;
    }
    params = (0, _assign2.default)(params || {}, { count: count });
    return translate_1.bindParams(text, params);
}
exports.transChoice = transChoice;