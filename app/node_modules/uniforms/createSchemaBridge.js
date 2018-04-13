'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createSchemaBridge;

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _GraphQLBridge = require('./GraphQLBridge');

var _GraphQLBridge2 = _interopRequireDefault(_GraphQLBridge);

var _JSONSchemaBridge = require('./JSONSchemaBridge');

var _JSONSchemaBridge2 = _interopRequireDefault(_JSONSchemaBridge);

var _SimpleSchema2Bridge = require('./SimpleSchema2Bridge');

var _SimpleSchema2Bridge2 = _interopRequireDefault(_SimpleSchema2Bridge);

var _SimpleSchemaBridge = require('./SimpleSchemaBridge');

var _SimpleSchemaBridge2 = _interopRequireDefault(_SimpleSchemaBridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bridges = [_GraphQLBridge2.default, _JSONSchemaBridge2.default, _SimpleSchemaBridge2.default, _SimpleSchema2Bridge2.default];

var isBridge = function isBridge(schema) {
    return schema && schema.getError && schema.getErrorMessage && schema.getErrorMessages && schema.getField && schema.getInitialValue && schema.getProps && schema.getSubfields && schema.getType && schema.getValidator;
};

function createSchemaBridge(schema) {
    // There's no need for an extra wrapper.
    if (isBridge(schema)) {
        return schema;
    }

    var Bridge = bridges.find(function (bridge) {
        return bridge.check(schema);
    });

    (0, _invariant2.default)(Bridge, 'Unrecognised schema: %s', schema);

    return new Bridge(schema);
}