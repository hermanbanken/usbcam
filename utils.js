module.exports = {
    p,
};

/**
 * Wrap a callback function
 * @type {T}
 * @type {R}
 * @type {E}
 * @param {(cb: (E, T) => void) => R} fn
 * @returns {Promise<R,E>}
 */
function p(fn) {
    return new Promise((resolve, reject) => {
        const callback = (err, result) => err ? reject(err) : resolve(result);
        fn(callback);
    });
}
