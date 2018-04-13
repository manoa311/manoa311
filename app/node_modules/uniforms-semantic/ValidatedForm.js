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

var _ValidatedForm = require('uniforms/ValidatedForm');

var _ValidatedForm2 = _interopRequireDefault(_ValidatedForm);

var _BaseForm = require('./BaseForm');

var _BaseForm2 = _interopRequireDefault(_BaseForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Validated = function Validated(parent) {
    var _class, _temp;

    return _temp = _class = function (_ValidatedForm$Valida) {
        (0, _inherits3.default)(_class, _ValidatedForm$Valida);

        function _class() {
            (0, _classCallCheck3.default)(this, _class);
            return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        return _class;
    }(_ValidatedForm2.default.Validated(parent)), _class.Validated = Validated, _temp;
};

exports.default = Validated(_BaseForm2.default);