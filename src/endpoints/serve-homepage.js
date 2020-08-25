const db = require('../database');
const templates = require('../templates');

/** @function homepage
 * Serves the home page 
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object
 */
function serveHomepage(req, res) {
  // Get all posts in the database
  var posts = db.prepare("SELECT * FROM posts ORDER BY date DESC").all();
  // Get the newest post 
  var post = posts[0];
  // Generate the html snippets
  var postHtml = templates['post.html'](post);
  var listHtml = templates['post-list.html']({posts: posts});
  // Set the title
  var title = post.title;
  // Generate the page html
  var html = templates['layout.html']({post: postHtml, list: listHtml, title: title});
  // Serve the HTML
  res.setHeader('Content-Type', "text/html");
  res.setHeader('Content-Length', html.length);
  res.end(html);
}

module.exports = serveHomepage;