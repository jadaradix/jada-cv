var waitTime = 250;
var fadedOutOpacity = 0.9;
var fadedOutIconsOpacity = 0.5;
var tileFadeDelay = 75;

function fadeAll() {
  var i = 0;
  $(".fade").each(function() {
    var el = $(this);
    setTimeout(function() {
      opacity = fadedOutOpacity;
      el.fadeTo(waitTime * 2, opacity);
    }, i * tileFadeDelay);
    i += 1;
  });
}

var jadaSite = angular.module('jadaSite', []).config(function($sceProvider) {
  $sceProvider.enabled(false);
});

var ajaxRequestCount = 0;
var ajaxRequestTotal = 1;
function easyAjax(url, callback) {

  function ajaxDone() {
    ajaxRequestCount += 1;
    if (ajaxRequestCount == ajaxRequestTotal) {
      fadeAll();
      ajaxRequestCount = 0;
    }
  }

  function ajaxSuccess(data) {
    callback(data);
    ajaxDone();
  }

  function ajaxFail(error) {
    console.log(error);
    callback(null);
    ajaxDone();
  }

  var ajaxRequest = $.ajax(url);
  ajaxRequest.done(function(response) {
    if (!response['error']) {
      ajaxSuccess(response);
    } else {
      ajaxFail(response['error']);
    }
  });
  ajaxRequest.fail(function(response) {
    ajaxFail("I couldn't reach '" + url + "'");
  });

}

jadaSite.controller('tilesController', function ($scope) {

  $scope.tileGroups = {
    "side": { rows: [] },
    "40x-side": { rows: [] },
    "403-main": { rows: [] },
    "404-main": { rows: [] },
    "main": { rows: [] },
    "blog": { rows: [] }
  };

  $scope.currentTile = {
    "content": ""
  };

  $scope.setCurrentTile = function(tile) {
    $scope.currentTile = tile;
  }

  easyAjax("api/tiles", function(data) {
    if (!data) return;
    $scope.$apply(function() {

      $scope.tileGroups["side"].rows = [
        [data["me"]],
        [data["me-text"]]
      ];
      $scope.tileGroups["40x-side"].rows = [
        [data["me"]],
        [data["error-40x-label"]]
      ];
      $scope.tileGroups["403-main"].rows = [
        [data["error-403-content"], data["blank"]],
        [data["blank"], data["error-40x-image"]]
      ];
      $scope.tileGroups["404-main"].rows = [
        [data["error-404-content"], data["blank"]],
        [data["blank"], data["error-40x-image"]]
      ];
      $scope.tileGroups["main"].rows = [
        [data["intro"]],
        [data["projects"], data["cv"]]
        // [data["github"], data["real-time"]],
      ];
      $scope.tileGroups["blog"].rows = [
        [data["blog-datacentred"], data["blog-unix"]],
      ];

    });
  });

  $scope.debug = function() {
    console.log($scope.currentTile.content);
  }

  $scope.getClasses = function(tile, mode) {
    r = [];
    switch(mode) {
      case "tile":
        if (tile.hide) r.push("hide");
        if (tile.static) r.push("static");
        if (tile.spread) r.push("spread");
        if (tile.hide) r.push("hide");
        if (tile.preserveBottomPadding) r.push("preserve-bottom-padding");
        if (tile.customClasses) r = r.concat(tile.customClasses);
        break;
      case "tileContent":
        if (tile.noOverflow) r.push("no-overflow");
        if (tile.noLinkFade) r.push("no-link-fade");
        r.push("bg-" + tile.color);
        break;
      case "innerDiv":
        if (tile.noPadding) r.push("no-padding");
        break;
    }
    return r;
  }

  $scope.groupHasTileRows = function(group) {
    return $scope.tileGroups.hasOwnProperty(group);
  };

  $scope.groupGetTileRows = function(group) {
    return $scope.tileGroups[group].rows;
  }

});