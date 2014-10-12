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
    side: {
      rows: []
    },
    main: {
      rows: []
    },
    blog: {
      rows: []
    }
  };

  easyAjax("api/tiles", function(data) {
    if (!data) return;
    $scope.$apply(function() {

      $scope.tileGroups["side"].rows = [
        [data["me"]],
        [data["me-text"]]
      ];
      $scope.tileGroups["main"].rows = [
        [data["intro"]],
        [data["projects"], data["cv"]],
        [data["github"], data["real-time"]],
      ];
      $scope.tileGroups["blog"].rows = [
        [data["blog-datacentred"]],
      ];

    });
  });

  $scope.updateHandlers = function() {
    fadeWork($('> * a', $('.tile-content').not(".no-link-fade")), fadedOutOpacity, true);
  }

  $scope.groupHasTileRows = function(group) {
    return $scope.tileGroups.hasOwnProperty(group);
  };

  $scope.groupGetTileRows = function(group) {
    return $scope.tileGroups[group].rows;
  }

});