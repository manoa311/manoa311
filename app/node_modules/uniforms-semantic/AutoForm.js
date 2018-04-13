'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AutoForm = require('uniforms/AutoForm');

var _AutoForm2 = _interopRequireDefault(_AutoForm);

var _ValidatedQuickForm = require('./ValidatedQuickForm');

var _ValidatedQuickForm2 = _interopRequireDefault(_ValidatedQuickForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Auto = function Auto(parent) {
    var _class, _temp;

    return _temp = _class = function (_AutoForm$Auto) {
        (0, _inherits3.default)(_class, _AutoForm$Auto);

        function _class() {
            (0, _classCallCheck3.default)(this, _class);
            return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        return _class;
    }(_AutoForm2.default.Auto(parent)), _class.Auto = Auto, _temp;
};

exports.default = Auto(_ValidatedQuickForm2.default);