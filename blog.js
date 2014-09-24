var async = require('async');
var fs = require('fs');

async.waterfall([

  function(next) {
    var blogPostDirs = fs.readdirSync("blog-posts");
    async.filter(
      blogPostDirs,
      function(blogPostDir, callback) {
        var matches = (blogPostDir != ".DS_Store");
        callback(matches);
      },
      function(results) {
        next(null, results);
      }
    );
  },

  function(blogPostDirs, next) {

    var blog = [];
    async.each(
      blogPostDirs,
      function(blogPostDir, callback) {
        var path = "blog-posts/" + blogPostDir;
        var data = JSON.parse(fs.readFileSync(path + "/data.json"));
        data["content"] = fs.readFileSync(path + "/content.html").toString().substring(1);
        blog.push(data);
        callback();
      },
      function(results) {
        blog = JSON.stringify(blog);
        fs.writeFileSync("build/blog.json", blog);
      }
    );

  }

]);