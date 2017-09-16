import dot from "dot-prop";

export default function createMiddleware() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { actionProperty: "meta.async" };

    return function (store) {
        return function (next) {
            return function (action) {
                if (dot.get(action, opt.actionProperty)) {
                    return new Promise(function (resolve, reject) {
                        dot.set(action, opt.actionProperty, { resolve: resolve, reject: reject });
                        next(action);
                    });
                } else {
                    return next(action);
                }
            };
        };
    };
}