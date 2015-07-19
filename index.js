var fs = require("fs");
var yans = require("yans");

var server = new yans({
  "port": 1024,
  "directory": __dirname,
  "viewPath": "build",
  "logging": true,
  "loggingFormat": ":method :url -> HTTP :status; :response-time ms",
  "staticDirectories": ["css", "fonts", "js", "static"]
});

server.start(function(err, port) {
  if (!err) {
    console.log("-> Server started! (port " + port.toString() + ")");
  } else {
    console.error("-> Server failed to start (" + err.toString() + ")");
    return process.exit(1);
  }
});

server.app.get("/api/tiles", function(req, res) {
  res.sendFile(__dirname + "/tiles.json");
});

server.app.get("/api/songs", function(req, res) {
  res.sendFile([]);
});

server.app.get("/*/", function(req, res) {
  var urlBit = req.params[0];
  if (urlBit.length == 0) urlBit = "index";
  if (urlBit[urlBit.length - 1] == "/") urlBit = urlBit.substring(0, urlBit.length - 1);
  fs.readFile(__dirname + "/pages/" + urlBit + ".html", function (err, data) {
    if (err) urlBit = "404";
    return res.sendFile(__dirname + "/pages/" + urlBit + ".html");
  });
});