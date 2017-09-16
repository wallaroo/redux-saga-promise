"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createMiddleware;

var _dotProp = require("dot-prop");

var _dotProp2 = _interopRequireDefault(_dotProp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMiddleware() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { actionProperty: "meta.async" };

    return function (store) {
        return function (next) {
            return function (action) {
                if (_dotProp2.default.get(action, opt.actionProperty)) {
                    return new Promise(function (resolve, reject) {
                        _dotProp2.default.set(action, opt.actionProperty, { resolve: resolve, reject: reject });
                        next(action);
                    });
                } else {
                    return next(action);
                }
            };
        };
    };
}