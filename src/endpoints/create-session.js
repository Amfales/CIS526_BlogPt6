const bcrypt = require('bcrypt');
const templates = require('../templates');
const db = require('../database');
const serveError = require('../serve-error');
const sessions = require('../sessions');

/** @function createSession
 * A helper method invoked when session creation is
 * successful.  The request should have an object
 * as its body parameter with username and password set.
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 */
function createSession(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Retreive the user from the database
  var user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  // If there is no matching user, prompt the user to sign in again
  if(!user) return failure(req, res, "Usename/Password not found.  Please try again.");
  // If there is a matching user, verify thier password
  bcrypt.compare(password, user.cryptedPassword, (err, result) => {
    if(err) return serveError(req, res, 500, err);
    console.log('result', result);
    if(result) success(req, res, user);
    else return failure(req, res, "Username/Password not found. Please try again.");
  });
}

module.exports = createSession;

/** @function success
 * Helper function for creating the user session after 
 * a successful login attempt.
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 * @param {object} user - the user who signed in
 */
function success(req, res, user) {
  var sid = sessions.create(user);
  res.setHeader("Set-Cookie", `SID=${sid}; Secure; HTTPOnly`);
  res.statusCode = 302;
  res.setHeader("Location", "/");
  res.end();
}

/** @function failure 
 * A helper function for reporting issues logging a 
 * user in.
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 * @param {string} errorMessage - the error message for the user
 * @param {string} errorMessage - a message to display to the user
 */
function failure(req, res, errorMessage) {
  if(!errorMessage) errorMessage = "There was an error processing your request.  Please try again."
  var form = templates["signin.html"]({
    errorMessage: errorMessage
  });
  var html = templates["layout.html"]({
    title: "Sign In",
    post: form,
    list: ""
  });
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", html.length);
  res.end(html);
}