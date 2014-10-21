function fadeAll(fromClass, toClass, delay) {
  if (!delay) delay = 150;
  var i = 0;
  $("." + fromClass).each(function(index, element) {
    setTimeout(function() {
      $(element).addClass(toClass);
      setTimeout(function() {
        $(element).removeClass(fromClass);
      }, 1 * 1000 * 1.1);
    }, i * delay);
    i += 1;
  });
}

var ajaxRequestCount = 0;
var ajaxRequestTotal = 1;
function easyAjax(url, callback) {

  function ajaxDone() {
    ajaxRequestCount += 1;
    if (ajaxRequestCount == ajaxRequestTotal) {
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