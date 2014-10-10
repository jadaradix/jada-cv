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

function getTilesMakeRows(data, tiles, isSingleColumn) {
  tiles = $.map(tiles, function(tile, index) {
    return data[tile];
  });
  var r = [];
  if (isSingleColumn) {
    $.each(tiles, function(index, tile) {
      r.push([]);
      r[r.length - 1].push(tile);
    });
  } else {
    $.each(tiles, function(index, tile) {
      if ((index + 1) % 2) r.push([]);
      r[r.length - 1].push(tile);
    });
  }
  return r;
}

jadaSite.controller('tilesController', function ($scope) {

  $scope.tileGroupRows = {};
  easyAjax("api/tiles", function(data) {
    if (!data) return;
    $scope.$apply(function() {
      $scope.tileGroupRows["side"] = getTilesMakeRows(data, ["me", "me-text"], true);
      $scope.tileGroupRows["main"] = getTilesMakeRows(data, ["intro", "projects", "cv", "github", "real-time"]);
      $scope.tileGroupRows["blog"] = getTilesMakeRows(data, ["blog-datacentred"]);
      console.log($scope.tileGroupRows);
    });
  });

  $scope.groupHasTileRows = function(group) {
    return $scope.tileGroupRows.hasOwnProperty(group);
  };

  $scope.groupGetTileRows = function(group) {
    return $scope.tileGroupRows[group];
  }

});