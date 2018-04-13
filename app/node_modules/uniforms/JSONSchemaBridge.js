'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Bridge2 = require('./Bridge');

var _Bridge3 = _interopRequireDefault(_Bridge2);

var _joinName = require('./joinName');

var _joinName2 = _interopRequireDefault(_joinName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveRef = function resolveRef(referance, schema) {
    (0, _invariant2.default)(referance.startsWith('#'), 'Reference is not an internal reference, and only such are allowed: "%s"', referance);

    var resolvedReference = referance.split('/').filter(function (part) {
        return part && part !== '#';
    }).reduce(function (definition, next) {
        return definition[next];
    }, schema);

    (0, _invariant2.default)(resolvedReference, 'Reference not found in schema: "%s"', referance);

    return resolvedReference;
};

var JSONSchemaBridge = function (_Bridge) {
    (0, _inherits3.default)(JSONSchemaBridge, _Bridge);

    function JSONSchemaBridge(schema, validator) {
        (0, _classCallCheck3.default)(this, JSONSchemaBridge);

        var _this = (0, _possibleConstructorReturn3.default)(this, (JSONSchemaBridge.__proto__ || Object.getPrototypeOf(JSONSchemaBridge)).call(this));

        _this.schema = schema;
        _this._compiledSchema = {};
        _this.validator = validator;
        return _this;
    }

    (0, _createClass3.default)(JSONSchemaBridge, [{
        key: 'getError',
        value: function getError(name, error) {
            return error && error.details && error.details.find && error.details.find(function (detail) {
                return detail.dataPath && detail.dataPath.substring(1) === name;
            });
        }
    }, {
        key: 'getErrorMessage',
        value: function getErrorMessage(name, error) {
            var scopedError = this.getError(name, error) || {};

            return scopedError && scopedError.message || '';
        }
    }, {
        key: 'getErrorMessages',
        value: function getErrorMessages(error) {
            if (error) {
                if (Array.isArray(error.details)) {
                    return error.details.reduce(function (acc, _ref) {
                        var message = _ref.message;
                        return acc.concat(message);
                    }, []);
                }

                return [error.message || error];
            }

            return [];
        }
    }, {
        key: 'getField',
        value: function getField(name) {
            var _this2 = this;

            return (0, _joinName2.default)(null, name).reduce(function (definition, next, nextIndex, array) {
                // eslint-disable-line complexity
                var previous = (0, _joinName2.default)(array.slice(0, nextIndex));
                var isRequired = (definition.required || (_this2._compiledSchema[previous] || {}).required || []).includes(next);

                var _key = (0, _joinName2.default)(previous, next);
                var _definition = _this2._compiledSchema[_key] || {};

                if (next === '$' || next === '' + parseInt(next, 10)) {
                    (0, _invariant2.default)(definition.type === 'array', 'Field not found in schema: "%s"', name);
                    definition = Array.isArray(definition.items) ? definition.items[parseInt(next, 10)] : definition.items;
                } else if (definition.type === 'object') {
                    definition = definition.properties[next];
                } else {
                    var _filter$map = ['allOf', 'anyOf', 'oneOf'].filter(function (key) {
                        return definition[key];
                    }).map(function (key) {
                        return definition[key].find(function (_ref2) {
                            var _ref2$properties = _ref2.properties,
                                properties = _ref2$properties === undefined ? {} : _ref2$properties;
                            return properties[next];
                        });
                    }),
                        _filter$map2 = (0, _slicedToArray3.default)(_filter$map, 1),
                        _filter$map2$ = _filter$map2[0];

                    _filter$map2$ = _filter$map2$ === undefined ? {} : _filter$map2$;
                    var _filter$map2$$propert = _filter$map2$.properties,
                        combinedDefinition = _filter$map2$$propert === undefined ? {} : _filter$map2$$propert;


                    definition = combinedDefinition[next];
                }

                (0, _invariant2.default)(definition, 'Field not found in schema: "%s"', name);

                if (definition.$ref) {
                    definition = resolveRef(definition.$ref, _this2.schema);
                }

                ['allOf', 'anyOf', 'oneOf'].filter(function (key) {
                    return definition[key];
                }).forEach(function (key) {
                    _definition[key] = definition[key].map(function (def) {
                        return def.$ref ? resolveRef(def.$ref, _this2.schema) : def;
                    });
                });

                // Naive computation of combined type, properties and required
                if (['allOf', 'anyOf', 'oneOf'].filter(function (key) {
                    return definition[key];
                }).length) {
                    _definition.type = ([].concat(_definition.allOf, _definition.anyOf, _definition.oneOf).filter(function (def) {
                        return def;
                    }).find(function (def) {
                        return def.type;
                    }) || {}).type;

                    var _concat$filter$reduce = [].concat(_definition.allOf, _definition.anyOf, _definition.oneOf).filter(function (def) {
                        return def;
                    }).reduce(function (_ref3, _ref4) {
                        var _ref5 = (0, _slicedToArray3.default)(_ref3, 2),
                            _properties = _ref5[0],
                            _required = _ref5[1];

                        var properties = _ref4.properties,
                            required = _ref4.required;
                        return [(0, _extends3.default)(_properties, properties), _required.concat(required)];
                    }, [{}, []]),
                        _concat$filter$reduce2 = (0, _slicedToArray3.default)(_concat$filter$reduce, 2),
                        properties = _concat$filter$reduce2[0],
                        required = _concat$filter$reduce2[1];

                    _definition.properties = properties;
                    _definition.required = required;
                }

                _this2._compiledSchema[_key] = (0, _extends3.default)(_definition, { isRequired: isRequired });

                return definition;
            }, this.schema);
        }
    }, {
        key: 'getInitialValue',
        value: function getInitialValue(name) {
            var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _getField = this.getField(name),
                _default = _getField.default,
                _type = _getField.type;

            var _compiledSchema$name = this._compiledSchema[name],
                _compiledSchema$name$ = _compiledSchema$name.default,
                defaultValue = _compiledSchema$name$ === undefined ? _default : _compiledSchema$name$,
                _compiledSchema$name$2 = _compiledSchema$name.type,
                type = _compiledSchema$name$2 === undefined ? _type : _compiledSchema$name$2;


            if (type === 'array') {
                var item = this.getInitialValue((0, _joinName2.default)(name, '0'));
                var items = props.initialCount || 0;

                return [].concat((0, _toConsumableArray3.default)(Array(items))).map(function () {
                    return item;
                });
            }

            if (type === 'object') {
                return {};
            }

            return defaultValue;
        }
    }, {
        key: 'getProps',
        value: function getProps(name) {
            var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref6$label = _ref6.label,
                label = _ref6$label === undefined ? true : _ref6$label,
                opts = _ref6.options,
                props = (0, _objectWithoutProperties3.default)(_ref6, ['label', 'options']);

            var _getField2 = this.getField(name),
                _enum = _getField2.enum,
                _type = _getField2.type,
                _options = _getField2.options,
                uniforms = _getField2.uniforms;

            var _compiledSchema$name2 = this._compiledSchema[name],
                _compiledSchema$name3 = _compiledSchema$name2.enum,
                allowedValues = _compiledSchema$name3 === undefined ? _enum : _compiledSchema$name3,
                _compiledSchema$name4 = _compiledSchema$name2.options,
                options = _compiledSchema$name4 === undefined ? _options : _compiledSchema$name4,
                _compiledSchema$name5 = _compiledSchema$name2.type,
                fieldType = _compiledSchema$name5 === undefined ? _type : _compiledSchema$name5,
                isRequired = _compiledSchema$name2.isRequired;

            var _joinName$slice$map = (0, _joinName2.default)(null, name).slice(-1).map(function (str) {
                return str.replace(/([A-Z])/g, ' $1');
            }),
                _joinName$slice$map2 = (0, _slicedToArray3.default)(_joinName$slice$map, 1),
                fieldName = _joinName$slice$map2[0];

            var ready = (0, _extends3.default)({
                allowedValues: allowedValues
            }, fieldType === 'number' ? { decimal: true } : {}, {
                options: opts || options,
                label: label === true ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase() : label || '',
                required: isRequired
            });

            if (ready.options) {
                if (!Array.isArray(ready.options)) {
                    ready.transform = function (value) {
                        return ready.options[value];
                    };
                    ready.allowedValues = Object.keys(ready.options);
                } else {
                    ready.transform = function (value) {
                        return ready.options.find(function (option) {
                            return option.value === value;
                        }).label;
                    };
                    ready.allowedValues = ready.options.map(function (option) {
                        return option.value;
                    });
                }
            }

            return (0, _extends3.default)({}, uniforms, ready, props);
        }
    }, {
        key: 'getSubfields',
        value: function getSubfields(name) {
            if (!name) {
                return Object.keys(this.schema.properties);
            }

            var _getField3 = this.getField(name),
                _type = _getField3.type,
                _properties = _getField3.properties;

            var _compiledSchema$name6 = this._compiledSchema[name],
                _compiledSchema$name7 = _compiledSchema$name6.type,
                fieldType = _compiledSchema$name7 === undefined ? _type : _compiledSchema$name7,
                _compiledSchema$name8 = _compiledSchema$name6.properties,
                fieldProperties = _compiledSchema$name8 === undefined ? _properties : _compiledSchema$name8;


            if (fieldType === 'object') {
                return Object.keys(fieldProperties);
            }

            return [];
        }
    }, {
        key: 'getType',
        value: function getType(name) {
            var _getField4 = this.getField(name),
                _type = _getField4.type,
                fieldFormat = _getField4.format;

            var _compiledSchema$name$3 = this._compiledSchema[name].type,
                fieldType = _compiledSchema$name$3 === undefined ? _type : _compiledSchema$name$3;


            if (fieldFormat === 'date-time') return Date;
            if (fieldType === 'string') return String;
            if (fieldType === 'number') return Number;
            if (fieldType === 'integer') return Number;
            if (fieldType === 'object') return Object;
            if (fieldType === 'array') return Array;
            if (fieldType === 'boolean') return Boolean;

            (0, _invariant2.default)(fieldType !== 'null', 'Field "%s" can not be represented as a type null', name);

            return fieldType;
        }
    }, {
        key: 'getValidator',
        value: function getValidator() {
            return this.validator;
        }
    }], [{
        key: 'check',
        value: function check() {
            return false;
        }
    }]);
    return JSONSchemaBridge;
}(_Bridge3.default);

exports.default = JSONSchemaBridge;