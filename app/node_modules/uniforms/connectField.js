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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = connectField;

var _react = require('react');

var _BaseField = require('./BaseField');

var _BaseField2 = _interopRequireDefault(_BaseField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var identity = function identity(x) {
    return x;
};

function connectField(component) {
    var _class, _temp;

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$baseField = _ref.baseField,
        baseField = _ref$baseField === undefined ? _BaseField2.default : _ref$baseField,
        _ref$mapProps = _ref.mapProps,
        mapProps = _ref$mapProps === undefined ? identity : _ref$mapProps,
        ensureValue = _ref.ensureValue,
        includeInChain = _ref.includeInChain,
        includeParent = _ref.includeParent,
        initialValue = _ref.initialValue;

    return _temp = _class = function (_baseField) {
        (0, _inherits3.default)(_class, _baseField);

        function _class() {
            (0, _classCallCheck3.default)(this, _class);

            var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

            _this.options.includeInChain = includeInChain === undefined ? true : includeInChain;
            _this.options.initialValue = initialValue === undefined ? true : initialValue;

            if (ensureValue !== undefined) _this.options.ensureValue = ensureValue;
            if (includeParent !== undefined) _this.options.includeParent = includeParent;
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: 'getChildContextName',
            value: function getChildContextName() {
                return this.options.includeInChain ? (0, _get3.default)(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'getChildContextName', this).call(this) : this.context.uniforms.name;
            }
        }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
                if (this.options.initialValue) {
                    var props = this.getFieldProps(undefined, {
                        ensureValue: false,
                        explicitInitialValue: true,
                        includeParent: false
                    });

                    // https://github.com/vazco/uniforms/issues/52
                    // If field is initially rendered with value, we treat it as an initial value.
                    if (this.props.value !== undefined && this.props.value !== props.value) {
                        props.onChange(this.props.value);
                        return;
                    }

                    if (props.required && props.initialValue !== undefined && props.value === undefined) {
                        props.onChange(props.initialValue);
                    }
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return (0, _react.createElement)(component, mapProps(this.getFieldProps()));
            }
        }]);
        return _class;
    }(baseField), _class.displayName = '' + (component.displayName || component.name) + (baseField.displayName || baseField.name), _temp;
}