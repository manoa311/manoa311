'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = changedKeys;

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _xorWith = require('lodash/xorWith');

var _xorWith2 = _interopRequireDefault(_xorWith);

var _joinName = require('./joinName');

var _joinName2 = _interopRequireDefault(_joinName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function changedKeys(root, valueA, valueB) {
    if (valueA === Object(valueA) && !(valueA instanceof Date)) {
        if (valueB) {
            var pairsA = void 0;
            var pairsB = void 0;

            if (Array.isArray(valueA)) {
                pairsA = valueA.map(function (value, index) {
                    return [value, index];
                });
                pairsB = valueB.map(function (value, index) {
                    return [value, index];
                });
            } else {
                pairsA = Object.keys(valueA).map(function (key) {
                    return [valueA[key], key];
                });
                pairsB = Object.keys(valueB).map(function (key) {
                    return [valueB[key], key];
                });
            }

            var changed = (0, _xorWith2.default)(pairsA, pairsB, _isEqual2.default).map(function (pair) {
                return (0, _joinName2.default)(root, pair[1]);
            });

            if (changed.length) {
                changed.unshift(root);
            }

            return changed;
        }

        return [root].concat(Object.keys(valueA).map(function (key) {
            return (0, _joinName2.default)(root, key);
        }));
    }

    return (0, _isEqual2.default)(valueA, valueB) ? [] : [root];
}