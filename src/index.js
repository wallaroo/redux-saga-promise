// @flow
import dot from "./dot-prop"

export default function createMiddleware(opt: { actionProperty: string } = {actionProperty: "meta.async"}): Function {
    return store => next => action => {
        if (dot.get(action, opt.actionProperty)) {
            return new Promise((resolve, reject) => {
                dot.set(action, opt.actionProperty, {resolve, reject});
                next(action);
            });
        } else {
            return next(action)
        }
    }
}