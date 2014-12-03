var jadaSite = angular.module('jadaSite', ['angularMoment']).config(function($sceProvider) {
  $sceProvider.enabled(false);
});


jadaSite.controller('tilesController', ['$scope', '$compile', function ($scope, $compile) {

  //
  // TILES
  //

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

      var body = $("body");
      var mainTile = $("#tile-main");
      var mainGroup = mainTile.parents(".tile-group");
      var mainTileContentDiv = $(".tile-content", mainTile);
      var scrollTop = mainGroup.offset().top - parseInt(mainGroup.css("margin-top").substr(0, 2));
      mainTileContentDiv.css("opacity", "1");
      body.animate(
        { scrollTop: scrollTop },
        1000,
        "swing"
      );

    }
  }

  $scope.getClasses = function(tile, mode) {
    r = [];
    switch(mode) {
      case "tile":
        if (tile.hidden) r.push("hidden");
        if (tile.static) r.push("static");
        if (tile.spread) r.push("spread");
        if (tile.preserveBottomPadding) r.push("preserve-bottom-padding");
        if (tile.customClasses) r = r.concat(tile.customClasses);
        break;
      case "tileContent":
        if (tile.noOverflow) r.push("no-overflow");
        if (tile.noLinkFade) r.push("no-link-fade");
        if (tile.central) r.push("central");
        if (tile.id == "stats") {
          if ($scope.hasSongs()) {
            r.push("fade");
          }
        } else {
          r.push("fade");
        }
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
        //[data["blog-birthday"], data["blog-year-so-far"]],
        //[data["blog-dundee-nds"], data["blog-repcoin"]],
        [data["blog-unix"], data["blog-datacentred"]],
        [data["blog-infolab21"], data["blog-christmas-2013"]]
      ];

    });

    setTimeout(function() {
      fadeAll("fade", "do-fade-weak");
    }, 0);

  });

  //
  // SONGS
  //

  $scope.songs = [];

  $scope.refreshSongs = function(firstCallback) {
    var tile = $scope.tileGroups["side"].rows[1][0];
    setTimeout(function() {
      easyAjax("api/stats", function(data) {
        if (!data) return;
        $scope.$apply(function() {
          $scope.songs = $.map(data["songs"], function(song, index) {
            song["when"] = moment.unix(song["when"]);
            return song;
          }).splice(0, 3);
        });
        setTimeout(function() {
          setTimeout($scope.refreshSongs, 0);
        }, 5000 + 1100);
        if (firstCallback) firstCallback();
      });
    }, 1100);
  }

  $scope.hasSongs = function() {
    return ($scope.songs.length > 0);
  }

  setTimeout(function() {
    $scope.refreshSongs(function() {
      setTimeout(function() {
        fadeAll("fade", "do-fade-weak");
      }, 0);
    });
  }, 1000);

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