function Server() {

  var _self = this;

  var express = require('express');
  var path = require('path');
  var fs = require('fs');

  _self.serveFile = function(fileName, resource) {
    resource.sendFile(
      fileName,
      {
        root: __dirname
      }
    );
  }

  //Express
  _self.expressInstance = express();
  _self.expressInstance.use(express.static(__dirname + '/'));

  _self.expressInstance.all("/api/*", function(request, resource, next) {
    resource.header("Access-Control-Allow-Origin", "*");
    resource.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  _self.expressInstance.get("/*//", function(request, resource) {
    var requestName = request.params[0];
    var fileName = requestName + ".html";
    console.log(fileName);
    if (fs.existsSync(fileName)) {
      _self.serveFile(fileName, resource);
    } else {
      resource.status(404);
      _self.serveFile("404.html", resource);
    }

  });

  var port = process.env.PORT || 1024;
  _self.expressInstance.listen(port, function() {
    console.log("Hello! I'm listening on port " + port + ".");
  });

}

var jadaServer = new Server();