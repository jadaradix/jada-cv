function Server() {

  var _self = this;

  var express = require('express');
  var path = require('path');
  var fs = require('fs');

  //Express
  _self.expressInstance = express();
  _self.expressInstance.use(express.static(__dirname + '/'));

  _self.expressInstance.all("/api/*", function(request, resource, next) {
    resource.header("Access-Control-Allow-Origin", "*");
    resource.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  _self.expressInstance.get("/*", function(request, resource) {
    var requestName = request.params[0];
    var lastCharacter = requestName.substr(requestName.length - 1);
    if (lastCharacter == '/') requestName = requestName.substr(0, requestName.length - 1);
    var fileName = requestName + ".html";
    console.log("Request: " + fileName);
    var serveStatus;
    var serveFileName;
    if (fs.existsSync(fileName)) {
      serveStatus = 200;
      serveFileName = fileName;
    } else {
      serveStatus = 404;
      serveFileName = "404.html";
    }
    resource.status(serveStatus);
    resource.sendFile(
      serveFileName,
      { root: __dirname }
    );
    console.log("Served " + serveFileName + " (" + serveStatus + ")");
  });

  var port = process.env.PORT || 1024;
  _self.expressInstance.listen(port, function() {
    console.log("Hello! I'm listening on port " + port);
  });

}

var jadaServer = new Server();