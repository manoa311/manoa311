'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _BaseForm = require('./BaseForm');

var _BaseForm2 = _interopRequireDefault(_BaseForm);

var _joinName = require('./joinName');

var _joinName2 = _interopRequireDefault(_joinName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Used for calculating labels and placeholders.
var flowingProp = function flowingProp(prop, schema, state, fallback) {
    var propDisabled = prop === '' || prop === false;
    var propSet = prop !== undefined;
    var schemaDisabled = schema === '' || schema === false;
    var schemaValue = schema === true || schema === undefined ? fallback : schema;
    var stateDisabled = !state;

    var value = propDisabled || !propSet && (schemaDisabled || stateDisabled) ? '' : propSet ? prop === true ? schemaDisabled ? '' : schemaValue : prop : schemaValue;

    return [value, schemaValue];
};

var BaseField = function (_Component) {
    (0, _inherits3.default)(BaseField, _Component);

    function BaseField() {
        (0, _classCallCheck3.default)(this, BaseField);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BaseField.__proto__ || Object.getPrototypeOf(BaseField)).apply(this, arguments));

        (0, _invariant2.default)(_this.context.uniforms, '<%s /> must be rendered within a form.', _this.constructor.displayName);

        _this.options = {
            ensureValue: true,
            explicitInitialValue: false,
            includeParent: false,
            overrideValue: false
        };

        _this.randomId = _this.context.uniforms.randomId();

        _this.findValue = _this.findValue.bind(_this);
        _this.findField = _this.findField.bind(_this);
        _this.findError = _this.findError.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(BaseField, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, _, _ref) {
            var nextContext = _ref.uniforms;

            var prevProps = this.props;
            var prevContext = this.context.uniforms;

            if (!(0, _isEqual2.default)(prevProps, nextProps)) {
                return true;
            }

            var _nextContext$state = nextContext.state,
                nextMap = _nextContext$state.changedMap,
                nextState = (0, _objectWithoutProperties3.default)(_nextContext$state, ['changedMap']);
            var _prevContext$state = prevContext.state,
                prevMap = _prevContext$state.changedMap,
                prevState = (0, _objectWithoutProperties3.default)(_prevContext$state, ['changedMap']);


            if (!(0, _isEqual2.default)(prevState, nextState)) {
                return true;
            }

            var prevName = (0, _joinName2.default)(prevContext.name, prevProps.name);
            var nextName = (0, _joinName2.default)(nextContext.name, nextProps.name);

            if (prevName !== nextName) {
                return true;
            }

            if (!(0, _isEqual2.default)((0, _get2.default)(prevMap, prevName), (0, _get2.default)(nextMap, nextName))) {
                return true;
            }

            // Fields which are using parent props, need to be updated when parent value change
            if (this.options.includeParent && nextName.indexOf('.') !== -1) {
                var prevParentValue = (0, _get2.default)(prevContext.model, prevName.replace(/(.+)\..+$/, '$1'));
                var nextParentValue = (0, _get2.default)(nextContext.model, nextName.replace(/(.+)\..+$/, '$1'));

                if (!(0, _isEqual2.default)(prevParentValue, nextParentValue)) {
                    return true;
                }
            }

            var prevValue = (0, _get2.default)(prevContext.model, prevName);
            var nextValue = (0, _get2.default)(nextContext.model, nextName);

            if (!(0, _isEqual2.default)(prevValue, nextValue)) {
                return true;
            }

            if (prevContext.error !== nextContext.error) {
                var prevError = prevContext.error && prevContext.schema.getError(prevName, prevContext.error);
                var nextError = nextContext.error && nextContext.schema.getError(nextName, nextContext.error);

                if (!(0, _isEqual2.default)(prevError, nextError)) {
                    return true;
                }

                // Fields like List or Nest should update, whenever their children error has changed
                if (nextValue === Object(nextValue) && !(nextValue instanceof Date)) {
                    return true;
                }
            }

            if (nextContext.schema !== prevContext.schema) {
                return true;
            }

            return false;
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                uniforms: {
                    name: this.getChildContextName(),
                    error: this.getChildContextError(),
                    model: this.getChildContextModel(),
                    state: this.getChildContextState(),
                    schema: this.getChildContextSchema(),
                    onChange: this.getChildContextOnChange(),
                    randomId: this.context.uniforms.randomId
                }
            };
        }
    }, {
        key: 'getChildContextName',
        value: function getChildContextName() {
            return (0, _joinName2.default)(null, this.context.uniforms.name, this.props.name);
        }
    }, {
        key: 'getChildContextError',
        value: function getChildContextError() {
            return this.context.uniforms.error;
        }
    }, {
        key: 'getChildContextModel',
        value: function getChildContextModel() {
            return this.context.uniforms.model;
        }
    }, {
        key: 'getChildContextState',
        value: function getChildContextState() {
            var state = this.context.uniforms.state;
            var props = this.props;

            var propagate = function propagate(name) {
                return props[name] === undefined || props[name] === null ? state[name] : !!props[name];
            };

            return (0, _extends3.default)({}, state, {

                label: propagate('label'),
                disabled: propagate('disabled'),
                placeholder: propagate('placeholder'),
                showInlineError: propagate('showInlineError')
            });
        }
    }, {
        key: 'getChildContextSchema',
        value: function getChildContextSchema() {
            return this.context.uniforms.schema;
        }
    }, {
        key: 'getChildContextOnChange',
        value: function getChildContextOnChange() {
            return this.context.uniforms.onChange;
        }

        // eslint-disable-next-line complexity

    }, {
        key: 'getFieldProps',
        value: function getFieldProps(name, options) {
            var context = this.context.uniforms;
            var props = this.props;
            var state = this.getChildContextState();

            options = (0, _extends3.default)({}, this.options, options);

            if (name === undefined) {
                name = (0, _joinName2.default)(context.name, props.name);
            }

            var changed = !!(0, _get2.default)(context.state.changedMap, name);

            var error = context.schema.getError(name, context.error);
            var errorMessage = context.schema.getErrorMessage(name, context.error);
            var field = context.schema.getField(name);
            var fieldType = context.schema.getType(name);
            var fields = context.schema.getSubfields(name);
            var schemaProps = context.schema.getProps(name, (0, _extends3.default)({}, state, props));

            var initialValue = options.explicitInitialValue ? context.schema.getInitialValue(name, props) : undefined;

            var parent = options.includeParent && name.indexOf('.') !== -1 ? this.getFieldProps(name.replace(/(.+)\..+$/, '$1'), { includeParent: false }) : null;

            var _flowingProp = flowingProp(props.label, schemaProps.label, state.label, ''),
                _flowingProp2 = (0, _slicedToArray3.default)(_flowingProp, 2),
                label = _flowingProp2[0],
                none = _flowingProp2[1];

            var _flowingProp3 = flowingProp(props.placeholder, schemaProps.placeholder, state.placeholder, label || none),
                _flowingProp4 = (0, _slicedToArray3.default)(_flowingProp3, 1),
                placeholder = _flowingProp4[0];

            var value = void 0;
            if (props.value === undefined || options.overrideValue) {
                value = (0, _get2.default)(context.model, name);

                if (value === undefined && !changed && !options.explicitInitialValue) {
                    value = context.schema.getInitialValue(name, props);
                }
            }

            // This prevents (un)controlled input change warning.
            // More info: https://fb.me/react-controlled-components.
            if (value === undefined && options.ensureValue) {
                value = '';
            }

            return (0, _extends3.default)({
                // 0. Constant props.
                findError: this.findError,
                findField: this.findField,
                findValue: this.findValue,
                id: this.randomId

            }, state, {

                // 2. Calculated field props.
                changed: changed,
                error: error,
                errorMessage: errorMessage,
                field: field,
                fieldType: fieldType,
                fields: fields,
                onChange: function onChange(value) {
                    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : name;
                    return context.onChange(key, value);
                },
                parent: parent,
                value: value

            }, options.explicitInitialValue && { initialValue: initialValue }, schemaProps, props, (options.explicitInitialValue || options.overrideValue) && { value: value }, {

                // 6. Calculated _special_ field props.
                label: label,
                name: name,
                placeholder: placeholder
            });
        }
    }, {
        key: 'findError',
        value: function findError(name) {
            return this.context.uniforms.schema.getError(name, this.context.uniforms.error);
        }
    }, {
        key: 'findField',
        value: function findField(name) {
            return this.context.uniforms.schema.getField(name);
        }
    }, {
        key: 'findValue',
        value: function findValue(name) {
            return (0, _get2.default)(this.context.uniforms.model, name);
        }
    }]);
    return BaseField;
}(_react.Component);

BaseField.displayName = 'Field';
BaseField.contextTypes = _BaseForm2.default.childContextTypes;
BaseField.childContextTypes = _BaseForm2.default.childContextTypes;
exports.default = BaseField;
BaseField.propTypes = process.env.NODE_ENV !== "production" ? {
    id: _propTypes2.default.string,

    name: _propTypes2.default.string.isRequired,
    disabled: _propTypes2.default.bool,

    label: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string, _propTypes2.default.node]),
    placeholder: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.string])
} : {};