'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Bridge2 = require('./Bridge');

var _Bridge3 = _interopRequireDefault(_Bridge2);

var _joinName = require('./joinName');

var _joinName2 = _interopRequireDefault(_joinName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var graphql = void 0;
try {
    var r = require; // Silence Meteor missing module warning
    graphql = r('graphql');
} catch (_) {/* Ignore it. */}

var extractFromNonNull = function extractFromNonNull(x) {
    return x && x.type instanceof graphql.GraphQLNonNull ? (0, _extends3.default)({}, x, { type: x.type.ofType }) : x;
};

var GraphQLBridge = function (_Bridge) {
    (0, _inherits3.default)(GraphQLBridge, _Bridge);

    function GraphQLBridge(schema, validator) {
        var extras = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        (0, _classCallCheck3.default)(this, GraphQLBridge);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GraphQLBridge.__proto__ || Object.getPrototypeOf(GraphQLBridge)).call(this));

        _this.extras = extras;
        _this.schema = schema;
        _this.validator = validator;
        return _this;
    }

    // This bridge has 3 arguments, so it cannot be constructed implicite in the
    // createSchemaBridge.


    (0, _createClass3.default)(GraphQLBridge, [{
        key: 'getError',
        value: function getError(name, error) {
            return error && error.details && error.details.find && error.details.find(function (error) {
                return error.name === name;
            }) || null;
        }
    }, {
        key: 'getErrorMessage',
        value: function getErrorMessage(name, error) {
            var scopedError = this.getError(name, error);
            return !scopedError ? '' : scopedError.message;
        }
    }, {
        key: 'getErrorMessages',
        value: function getErrorMessages(error) {
            if (error) {
                if (Array.isArray(error.details)) {
                    return error.details.map(function (error) {
                        return error.message;
                    });
                }

                if (error.message) {
                    return [error.message];
                }
            }

            if (error !== undefined) {
                return [error];
            }

            return [];
        }
    }, {
        key: 'getField',
        value: function getField(name) {
            var returnExtracted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            return (0, _joinName2.default)(null, name).reduce(function (definition, next, index, array) {
                if (next === '$' || next === '' + parseInt(next, 10)) {
                    (0, _invariant2.default)(definition.type instanceof graphql.GraphQLList, 'Field not found in schema: "%s"', name);
                    definition = { type: extractFromNonNull(definition.type.ofType) };
                } else if (definition.type && definition.type._fields) {
                    definition = definition.type._fields[next];
                } else {
                    definition = definition[next];
                }

                (0, _invariant2.default)(definition, 'Field not found in schema: "%s"', name);

                var isLast = array.length - 1 === index;

                if (isLast && !returnExtracted) {
                    return definition;
                }

                var extracted = extractFromNonNull(definition);

                if (isLast && returnExtracted || !(extracted.type instanceof graphql.GraphQLObjectType)) {
                    return extracted;
                }

                (0, _invariant2.default)(extracted.type.getFields, 'Field not found in schema: "%s"', name);

                return extracted.type.getFields();
            }, this.schema.getFields());
        }
    }, {
        key: 'getInitialValue',
        value: function getInitialValue(name) {
            var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var type = this.getType(name);

            if (type === Array) {
                var item = this.getInitialValue((0, _joinName2.default)(name, '0'));
                var items = props.initialCount || 0;

                return [].concat((0, _toConsumableArray3.default)(Array(items))).map(function () {
                    return item;
                });
            }

            if (type === Object) {
                return {};
            }

            var defaultValue = this.getField(name).defaultValue;

            return defaultValue === undefined ? this.extras[name] && this.extras[name].initialValue : defaultValue;
        }

        // eslint-disable-next-line complexity

    }, {
        key: 'getProps',
        value: function getProps(nameNormal) {
            var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var nameGeneric = nameNormal.replace(/\.\d+/, '.$');

            var field = this.getField(nameGeneric, false);
            var fieldType = extractFromNonNull(field.type);

            var extra = (0, _extends3.default)({}, this.extras[nameGeneric], this.extras[nameNormal]);

            var ready = (0, _extends3.default)({
                label: '',
                required: field.type instanceof graphql.GraphQLNonNull

            }, extra, props);

            if (props.label === true && extra.label) {
                ready.label = extra.label;
            } else if (props.label !== undefined && !props.label) {
                ready.label = '';
            }

            if (fieldType instanceof graphql.GraphQLScalarType && fieldType.name === 'Float') {
                ready.decimal = true;
            }

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

            return ready;
        }
    }, {
        key: 'getSubfields',
        value: function getSubfields(name) {
            if (!name) {
                return Object.keys(this.schema.getFields());
            }

            var fieldType = this.getField(name).type;

            if (fieldType instanceof graphql.GraphQLObjectType || fieldType instanceof graphql.GraphQLInputObjectType) {
                return Object.keys(fieldType.getFields());
            }

            return [];
        }
    }, {
        key: 'getType',
        value: function getType(name) {
            var fieldType = this.getField(name).type;

            if (fieldType instanceof graphql.GraphQLList) return Array;
            if (fieldType instanceof graphql.GraphQLObjectType) return Object;
            if (fieldType instanceof graphql.GraphQLInputObjectType) return Object;
            if (fieldType instanceof graphql.GraphQLScalarType) {
                if (fieldType.name === 'ID') return String;
                if (fieldType.name === 'Int') return Number;
                if (fieldType.name === 'Float') return Number;
                if (fieldType.name === 'String') return String;
                if (fieldType.name === 'Boolean') return Boolean;
            }

            return fieldType;
        }
    }, {
        key: 'getValidator',
        value: function getValidator() /* options */{
            return this.validator;
        }
    }], [{
        key: 'check',
        value: function check() /* schema */{
            return false;
        }
    }]);
    return GraphQLBridge;
}(_Bridge3.default);

exports.default = GraphQLBridge;