'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseField2 = require('uniforms/BaseField');

var _BaseField3 = _interopRequireDefault(_BaseField2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _filterDOMProps = require('uniforms/filterDOMProps');

var _filterDOMProps2 = _interopRequireDefault(_filterDOMProps);

var _nothing = require('uniforms/nothing');

var _nothing2 = _interopRequireDefault(_nothing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HiddenField = function (_BaseField) {
    (0, _inherits3.default)(HiddenField, _BaseField);

    function HiddenField() {
        (0, _classCallCheck3.default)(this, HiddenField);

        var _this = (0, _possibleConstructorReturn3.default)(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).apply(this, arguments));

        _this.options = {
            ensureValue: true,
            overrideValue: true
        };
        return _this;
    }

    (0, _createClass3.default)(HiddenField, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_ref) {
            var valueDesired = _ref.value;

            if (valueDesired === undefined) {
                return;
            }

            var props = this.getFieldProps();
            if (props.value !== valueDesired) {
                props.onChange(valueDesired);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.getFieldProps();

            return props.noDOM ? _nothing2.default : _react2.default.createElement('input', (0, _extends3.default)({
                disabled: props.disabled,
                id: props.id,
                name: props.name,
                ref: props.inputRef,
                type: 'hidden',
                value: props.value
            }, (0, _filterDOMProps2.default)(props)));
        }
    }]);
    return HiddenField;
}(_BaseField3.default);

HiddenField.displayName = 'HiddenField';
exports.default = HiddenField;