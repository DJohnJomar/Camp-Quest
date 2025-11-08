const mongoSanitize = require('express-mongo-sanitize');
 
// deep-clone helper
function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepCopy);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepCopy(v)])
  );
}
 
// middleware
module.exports = function sanitizeV5(options = {}) {
  const hasOnSanitize = typeof options.onSanitize === 'function';
 
  return function (req, _res, next) {
 
    // still writable fields
    ['body', 'params', 'headers'].forEach(key => {
      if (req[key]) {
        const clean = mongoSanitize.sanitize(req[key], options);
        req[key] = clean;
        if (hasOnSanitize && mongoSanitize.has(clean, options.allowDots)) {
          options.onSanitize({req, key});
        }
      }
    });
 
    // updating handling of read-only req.query (getter in Express 5)
    if (req.query) {
      const cleanQuery = mongoSanitize.sanitize(deepCopy(req.query), options);
 
      // replace the getter with a concrete, sanitized value
      Object.defineProperty(req, 'query', {
        value: cleanQuery,
        writable: false,
        configurable: true,
        enumerable: true
      });
 
      if (hasOnSanitize && mongoSanitize.has(cleanQuery, options.allowDots)) {
        options.onSanitize({req, key: 'query'});
      }
    }
 
    next();
  };
};