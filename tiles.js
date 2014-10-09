var tilesPath = "tiles";
var outputPath = "build/tiles.json"

var async = require('async');
var fs = require('fs');
var _ = require('underscore')._;
_.str = require('underscore.string');

async.waterfall([

  //Collect Tile Directories
  function(next) {
    var tileDirectories = _.filter(fs.readdirSync(tilesPath), function(tileDirectory) {
      return (tileDirectory != ".DS_Store");
    });
    next(null, tileDirectories);
  },

  //Collect Tiles from Directories
  function(tileDirectories, next) {
    var tiles = [];
    _.each(tileDirectories, function(tileDirectory) {
      var path = tilesPath + "/" + tileDirectory;
      var data = JSON.parse(fs.readFileSync(path + "/data.json"));
      var contentFileExtension = ".html";
      var contentFiles = _.filter(fs.readdirSync(path), function(contentFile) {
        return (_.str.endsWith(contentFile, contentFileExtension));
      });
      _.each(contentFiles, function(contentFile) {
        var contentFileKey = contentFile.substr(0, contentFile.length - (contentFileExtension).length);
        data[contentFileKey] = fs.readFileSync(path + "/" + contentFile).toString();
      });
      tiles.push(data);
    });
    next(null, tiles);
  },

  //Write Tiles to Output Path
  function(tiles, next) {
    fs.writeFileSync(outputPath, JSON.stringify(tiles));
  }

]);