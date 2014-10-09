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

  $scope.tileRows = [];

  $scope.hasTileRows = function() {
    return ($scope.tileRows.length > 0); 
  };

  easyAjax("api/tiles", function(data) {
    if (!data) return;
    var r = [];
    $.each(data, function(index, blogPost) {
      if ((index + 1) % 2) r.push([]);
      r[r.length - 1].push(blogPost);
    });
    $scope.$apply(function() {
      $scope.tileRows = r;
      console.log(r);
    });
  });

});