const templates = require('../templates');
const db = require('../database');

/** @function showPost 
 * Serves the specified post as a resonse.  The post id should be in req.params.id
 * @param {http.IncomingMessage} req - the request object 
 * @param {http.ServerResponse} res - the response object 
 */
function showPost(req, res) {
  // Determine the post ID
  const id = parseInt(req.params.id, 10);
  // Retreive the post from the database 
  var post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  post.date = new Date(post.date);
  // Get all posts in the database
  var posts = db.prepare("SELECT * FROM posts ORDER BY date DESC").all();
  // Set the title 
  var title = post.title;
  // Generate the HTML
  var postHtml = templates['post.html'](post);
  var listHtml = templates['post-list.html']({posts: posts});
  var html = templates['layout.html']({post: postHtml, list: listHtml, title: title});
  // Serve the HTML
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Length", html.length);
  res.end(html);
}

module.exports = showPost;