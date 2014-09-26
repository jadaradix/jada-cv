var jadaSite = angular.module('jadaSite', []).config(function($sceProvider) {
  $sceProvider.enabled(false);
});

jadaSite.controller('blogController', function ($scope) {

  $scope.tileRows = [];

  $scope.hasTileRows = function() {
    return ($scope.tileRows.length > 0); 
  };

  function blogDone(blogPosts) {
    var r = [];
    $.each(blogPosts, function(index, blogPost) {
      if ((index + 1) % 2) r.push([]);
      r[r.length - 1].push(blogPost);
    });
    $scope.$apply(function() {
      $scope.tileRows = r;
    });
    console.log($scope.tileRows);
    fadeAll();
  }

  function blogSuccess(blogPosts) {
    blogDone(blogPosts);
  }

  function blogFail(error) {
    console.log(error);
    blogDone([]);
  }

  var blogUrl = "api/blog";
  var ajaxRequest = $.ajax(blogUrl);
  ajaxRequest.done(function(response) {
    if (!response['error']) {
      blogSuccess(response);
    } else {
      blogFail(response['error']);
    }
  });
  ajaxRequest.fail(function(response) {
    blogFail("I couldn't reach '" + blogUrl + "'");
  });

});