'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _NumField = require('./NumField');

var _NumField2 = _interopRequireDefault(_NumField);

var _BoolField = require('./BoolField');

var _BoolField2 = _interopRequireDefault(_BoolField);

var _DateField = require('./DateField');

var _DateField2 = _interopRequireDefault(_DateField);

var _ListField = require('./ListField');

var _ListField2 = _interopRequireDefault(_ListField);

var _NestField = require('./NestField');

var _NestField2 = _interopRequireDefault(_NestField);

var _TextField = require('./TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _RadioField = require('./RadioField');

var _RadioField2 = _interopRequireDefault(_RadioField);

var _SelectField = require('./SelectField');

var _SelectField2 = _interopRequireDefault(_SelectField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoField = function (_BaseField) {
    (0, _inherits3.default)(AutoField, _BaseField);

    function AutoField() {
        (0, _classCallCheck3.default)(this, AutoField);
        return (0, _possibleConstructorReturn3.default)(this, (AutoField.__proto__ || Object.getPrototypeOf(AutoField)).apply(this, arguments));
    }

    (0, _createClass3.default)(AutoField, [{
        key: 'getChildContextName',
        value: function getChildContextName() {
            return this.context.uniforms.name;
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.getFieldProps(undefined, { ensureValue: false });

            if (props.component === undefined) {
                if (props.allowedValues) {
                    if (props.checkboxes && props.fieldType !== Array) {
                        props.component = _RadioField2.default;
                    } else {
                        props.component = _SelectField2.default;
                    }
                } else {
                    switch (props.fieldType) {
                        case Date:
                            props.component = _DateField2.default;break;
                        case Array:
                            props.component = _ListField2.default;break;
                        case Number:
                            props.component = _NumField2.default;break;
                        case Object:
                            props.component = _NestField2.default;break;
                        case String:
                            props.component = _TextField2.default;break;
                        case Boolean:
                            props.component = _BoolField2.default;break;
                    }

                    (0, _invariant2.default)(props.component, 'Unsupported field type: %s', props.fieldType.toString());
                }
            }

            return (0, _react.createElement)(props.component, this.props);
        }
    }]);
    return AutoField;
}(_BaseField3.default);

AutoField.displayName = 'AutoField';
exports.default = AutoField;