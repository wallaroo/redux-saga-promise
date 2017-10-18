var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isObj(x) {
    var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    return x !== null && (type === 'object' || type === 'function');
}

function getPathSegments(path) {
    var pathArr = path.split('.');
    var parts = [];

    for (var i = 0; i < pathArr.length; i++) {
        var p = pathArr[i];

        while (p[p.length - 1] === '\\' && pathArr[i + 1] !== undefined) {
            p = p.slice(0, -1) + '.';
            p += pathArr[++i];
        }

        parts.push(p);
    }

    return parts;
}

export default {
    get: function get(obj, path, value) {
        if (!isObj(obj) || typeof path !== 'string') {
            return value === undefined ? obj : value;
        }

        var pathArr = getPathSegments(path);

        for (var i = 0; i < pathArr.length; i++) {
            if (!Object.prototype.propertyIsEnumerable.call(obj, pathArr[i])) {
                return value;
            }

            obj = obj[pathArr[i]];

            if (obj === undefined || obj === null) {
                // `obj` is either `undefined` or `null` so we want to stop the loop, and
                // if this is not the last bit of the path, and
                // if it did't return `undefined`
                // it would return `null` if `obj` is `null`
                // but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
                if (i !== pathArr.length - 1) {
                    return value;
                }

                break;
            }
        }

        return obj;
    },
    set: function set(obj, path, value) {
        if (!isObj(obj) || typeof path !== 'string') {
            return obj;
        }

        var root = obj;
        var pathArr = getPathSegments(path);

        for (var i = 0; i < pathArr.length; i++) {
            var p = pathArr[i];

            if (!isObj(obj[p])) {
                obj[p] = {};
            }

            if (i === pathArr.length - 1) {
                obj[p] = value;
            }

            obj = obj[p];
        }

        return root;
    },
    delete: function _delete(obj, path) {
        if (!isObj(obj) || typeof path !== 'string') {
            return;
        }

        var pathArr = getPathSegments(path);

        for (var i = 0; i < pathArr.length; i++) {
            var p = pathArr[i];

            if (i === pathArr.length - 1) {
                delete obj[p];
                return;
            }

            obj = obj[p];

            if (!isObj(obj)) {
                return;
            }
        }
    },
    has: function has(obj, path) {
        if (!isObj(obj) || typeof path !== 'string') {
            return false;
        }

        var pathArr = getPathSegments(path);

        for (var i = 0; i < pathArr.length; i++) {
            if (isObj(obj)) {
                if (!(pathArr[i] in obj)) {
                    return false;
                }

                obj = obj[pathArr[i]];
            } else {
                return false;
            }
        }

        return true;
    }
};