function Server() {

  var _self = this;

  _self.port = 1024;
  _self.port = process.env.PORT || _self.port;

  var express = require('express');
  var path = require('path');
  var fs = require('fs');
  var request = require('request');
  var moment = require('moment');

  _self.stringStartsWith = function (string, startsWith) {
    return (string.lastIndexOf(startsWith, 0) === 0);
  }

  _self.serveResource = null;
  _self.serve = function(serveStatus, serveFileName) {
    if (!_self.serveResource) return;
    _self.serveResource.status(serveStatus);
    _self.serveResource.sendFile(
      serveFileName,
      { root: __dirname }
    );
    // Log
    console.log(" => Served '%s' (%s)", serveFileName, serveStatus);
    console.log("");
  }

  _self.serve200 = function(serveFileName) {
    _self.serve(200, serveFileName);
  }

  _self.serve404 = function() {
    _self.serve(404, "404.html");
  }

  _self.serveJSON = function(jsonObject) {
    _self.serveResource.status(200);
    _self.serveResource.send(jsonObject);
  }

  _self.getGit = function(callback) {

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
      data = {};
      if (!error && response.statusCode == 200) {
        var bodyJson = JSON.parse(body);
        memberAt = moment(bodyJson.created_at);
        memberFor = today.diff(memberAt, "months");
        data = {
          "member_for": memberFor
        }
      } else {
        data = {
          "error": "Something went wrong. Sorry."
        }
      }
      callback(data);
    });
  }

  // Express
  _self.expressInstance = express();

  // Express routing
  _self.expressInstance.get("/*/", function(eRequest, eResource) {

    _self.serveResource = eResource;
    _self.serveResource.header("Access-Control-Allow-Origin", "*");
    _self.serveResource.header("Access-Control-Allow-Headers", "X-Requested-With");

    var requestName = eRequest.params[0];

    // Remove ending slash
    if (requestName.substr(requestName.length - 1) == '/') {
      requestName = requestName.substr(0, requestName.length - 1);
    }

    // Convert drectory to file
    if (fs.existsSync(requestName + ".html")) {
      requestName += ".html";
    }

    // Index
    if (requestName.length === 0) requestName = "index.html";

    // Log
    console.log("Requested '%s'", requestName);

    // Ignore DS Game Maker spam requests
    if (_self.stringStartsWith(requestName, "sites/dsgm")) {
      serve404();
      return;
    }

    if (fs.existsSync(requestName)) {
      _self.serve200(requestName);
      return;
    }

    if (requestName === "git") {
      _self.getGit(function(data) {
        _self.serveJSON(data);
      });
      return;
    }

    _self.serve404();
    return;

  });

  _self.expressInstance.listen(_self.port, function() {
    console.log("");
    console.log("Hello! I'm listening on port " + _self.port);
    console.log("");
  });

}

var jadaServer = new Server();