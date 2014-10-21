var jadaSite = angular.module('jadaSite', []).config(function($sceProvider) {
  $sceProvider.enabled(false);
});

jadaSite.controller('tilesController', ['$scope', '$compile', function ($scope, $compile) {

  $scope.tileGroups = {
    "side": { rows: [] },
    "40x-side": { rows: [] },
    "403-main": { rows: [] },
    "404-main": { rows: [] },
    "main": { rows: [] },
    "blog": { rows: [] }
  };

  $scope.currentTile = null;

  $scope.showTile = function(tile) {
    if (tile.hasOwnProperty("link")) {
      window.location = tile.link;
      return;
    } else {
      $scope.currentTile = tile;
    }
  }

  easyAjax("api/tiles", function(data) {
    if (!data) return;
    $scope.$apply(function() {

      $scope.tileGroups["side"].rows = [
        [data["me"]],
        [data["stats"]]
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
        [data["projects"], data["resume"]]
      ];
      $scope.tileGroups["blog"].rows = [
        [data["blog-unix"], data["blog-datacentred"]],
        [data["blog-infolab21"], data["blog-christmas-2013"]]
      ];

      setTimeout(function() {
        fadeAll("fade", "do-fade-weak");
      }, 0);

    });

  });

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

}]);

jadaSite.directive('remoteBind', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.remoteBind);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
    );
  };
}]);