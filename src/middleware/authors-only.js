const serveError = require('../serve-error');

/** @function authorsOnly 
 * This middleware prevents access to a route by users without the author role
 * If a user is not signed in, it will redirect them to the sign in route
 * If they are signed in and are not authors, a 403 unautorized error will be served
 * @param {http.IncomingRequest} req - the request object 
 * @param {http.ServerResponse} res - the response object 
 * @param {function} next - a callback to invoke when the request is fulfillable
 */
function authorsOnly(req, res, next) {
  if(!req.session) return res.writeHead(302, {"Location": "/signin"}).end();
  if(req.session.user && req.session.user.role === "Author") next();
  else serveError(req, res, 403, `User with role ${req.session.user.role} attempted to use an author-only route`);
}

module.exports = authorsOnly;