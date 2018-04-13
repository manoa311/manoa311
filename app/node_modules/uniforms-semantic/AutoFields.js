'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _AutoField = require('./AutoField');

var _AutoField2 = _interopRequireDefault(_AutoField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AutoFields = function AutoFields(_ref, _ref2) {
    var schema = _ref2.uniforms.schema;
    var autoField = _ref.autoField,
        element = _ref.element,
        fields = _ref.fields,
        omitFields = _ref.omitFields,
        props = (0, _objectWithoutProperties3.default)(_ref, ['autoField', 'element', 'fields', 'omitFields']);
    return (0, _react.createElement)(element, props, (fields || schema.getSubfields()).filter(function (field) {
        return omitFields.indexOf(field) === -1;
    }).map(function (field) {
        return (0, _react.createElement)(autoField, { key: field, name: field });
    }));
};

AutoFields.contextTypes = _AutoField2.default.contextTypes;

AutoFields.propTypes = {
    autoField: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
    element: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),

    fields: _propTypes2.default.arrayOf(_propTypes2.default.string),
    omitFields: _propTypes2.default.arrayOf(_propTypes2.default.string)
};

AutoFields.defaultProps = {
    autoField: _AutoField2.default,
    element: 'div',
    omitFields: []
};

exports.default = AutoFields;