function Server() {

  var _self = this;

  //Express
  var express = require('express');
  _self.expressInstance = express();
  _self.expressInstance.use(express.static(__dirname + '/'));

  _self.expressInstance.all('/api/*', function(request, resource, next) {
    resource.header("Access-Control-Allow-Origin", "*");
    resource.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  _self.expressInstance.listen(process.env.PORT || 1024);

}

var jadaServer = new Server();