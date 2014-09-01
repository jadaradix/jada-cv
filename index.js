function Server() {

  var _self = this;

  var express = require('express');
  var path = require('path');
  var fs = require('fs');
  var request = require('request');
  var moment = require('moment');

  //Express
  _self.expressInstance = express();
  _self.expressInstance.use(express.static(__dirname + '/'));

  _self.expressInstance.all("/*", function(request, resource, next) {
    resource.header("Access-Control-Allow-Origin", "*");
    resource.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  _self.expressInstance.get("/git", function(eRequest, eResource) {

    var today = moment();
    var memberAt;
    var memberFor;

    var options = {
      url: "https://api.github.com/users/jadaradix",
      headers: {
        "User-Agent": "jadaSite",
        "Authorization": "token b78c1de02bcbe9dd7ca051d298b5a60dd7c6513e"
      }
    };

    request(options, function(error, response, body) {
      var serveStatus = 200;
      var serveData;
      if (!error && response.statusCode == 200) {
        var bodyJson = JSON.parse(body);
        memberAt = moment(bodyJson.created_at);
        memberFor = today.diff(memberAt, "months");
        serveData = {
          "member_for": memberFor
        }
      } else {
        serveData = {
          "error": "Something went wrong. Sorry."
        }
      }
      eResource.status(serveStatus);
      eResource.send(serveData);
    });

  });

  function stringStartsWith(string, startsWith) {
    return (string.lastIndexOf(startsWith, 0) === 0);
  }

  _self.expressInstance.get("/*", function(eRequest, eResource) {

    var requestName = eRequest.params[0];

    // Log
    console.log("Request: " + requestName);

    var serveStatus;
    var serveFileName;
    if (stringStartsWith(requestName, "sites/dsgm")) {
      serveFileName = "404.html";
      serveStatus = 404;
    } else {
      var lastCharacter = requestName.substr(requestName.length - 1);
      if (lastCharacter == '/') requestName = requestName.substr(0, requestName.length - 1);
      var fileName = requestName + ".html";
      if (fs.existsSync(fileName)) {
        serveFileName = fileName;
        serveStatus = 200;
      } else {
        serveFileName = "404.html";
        serveStatus = 404;
      }
    }

    // Log
    console.log("Served " + serveFileName + " (" + serveStatus + ")");

    eResource.status(serveStatus);
    eResource.sendFile(
      serveFileName,
      { root: __dirname }
    );

  });

  var port = process.env.PORT || 80;
  _self.expressInstance.listen(port, function() {
    console.log("Hello! I'm listening on port " + port);
  });

}

var jadaServer = new Server();