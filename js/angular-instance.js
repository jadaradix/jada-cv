var jadaSite = angular.module('jadaSite', ['angularMoment']).config(function($sceProvider) {
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
    if (tile.static) return;
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
        // [data["blog-unix"], data["blog-datacentred"]],
        // [data["blog-infolab21"], data["blog-christmas-2013"]]
        [data["blog-unix"], data["blog-christmas-2013"]]
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
        if (tile.central) r.push("central");
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


jadaSite.controller('statsController', ['$scope', '$compile', function ($scope, $compile) {

  $scope.songs = [
    {
      "name": "Defying Gravity - Original Cast Recording 2003",
      "artist": "Kristin Chenoweth",
      "album": "Wicked",
      "url": "http:\/\/www.last.fm\/music\/Kristin+Chenoweth\/_\/Defying+Gravity+-+Original+Cast+Recording%2F2003",
      "image": "http:\/\/userserve-ak.last.fm\/serve\/300x300\/45065045.png",
      "when": moment.unix(1414692295),
      "nowPlaying": true
    },
    {
      "name": "Jump",
      "artist": "Girls Aloud",
      "album": "The Sound of Girls Aloud",
      "url": "http:\/\/www.last.fm\/music\/Girls+Aloud\/_\/Jump",
      "image": "http:\/\/userserve-ak.last.fm\/serve\/300x300\/83233187.png",
      "when": moment.unix(1414678737)
    },
    {
      "name": "Fight For This Love - Cahill Club Mix",
      "artist": "Cheryl Cole",
      "album": "The Ultimate Workout Collection: Keep On Running",
      "url": "http:\/\/www.last.fm\/music\/Cheryl+Cole\/_\/Fight+For+This+Love+-+Cahill+Club+Mix",
      "image": null,
      "when": moment.unix(1414673981)
    },

  ];

  $scope.nowPlayingSong = $.grep($scope.songs, function(song, index) {
    return (song.nowPlaying);
  })[0];

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