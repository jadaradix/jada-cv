"use strict";

var async = require("async");
var _s = require("underscore.string");
var moment = require("moment");
var fs = require("fs");
var path = require("path");

var tilesPath = "tiles";
var outputPath = path.join("build", "tiles.json");

async.waterfall([

  //Collect Tile Directories
  function (next) {
    var tileDirectories = fs.readdirSync(tilesPath).filter(function (tileDirectory) {
      return (tileDirectory !== ".DS_Store");
    });
    return next(null, tileDirectories);
  },

  //Collect Tiles from Directories
  function (tileDirectories, next) {
    var tiles = {};
    tileDirectories.forEach(function(tileDirectory) {
      var path = tilesPath + "/" + tileDirectory;
      var data = JSON.parse(fs.readFileSync(path + "/data.json"));
      var contentFileExtension = ".html";
      var contentFiles = fs.readdirSync(path).filter(function (contentFile) {
        return (_s.endsWith(contentFile, contentFileExtension));
      });
      data.id = tileDirectory;
      data.contentPreview = "";
      if (data.tags && data.tags.when) {
        data.tags.when.text = moment.unix(data.tags.when.text).format("MMM D[,] ‘YY");
      }
      contentFiles.forEach(function (contentFile) {
        var contentFileKey = contentFile.substr(0, contentFile.length - (contentFileExtension).length);
        data[contentFileKey] = fs.readFileSync(path + "/" + contentFile).toString();
      });
      tiles[tileDirectory] = data;
    });
    next(null, tiles);
  },

  //Write Tiles to Output Path
  function (tiles) {
    fs.writeFileSync(outputPath, JSON.stringify(tiles));
  }

]);