function fadeAll(opacity) {
  if (!opacity) opacity = 0.85;
  var waitTime = 250;
  var tileFadeDelay = 75;
  var i = 0;
  $(".fade").each(function() {
    var el = $(this);
    var localOpacity = (el.attr("data-custom-fade") ? parseFloat(el.attr("data-custom-fade")) : opacity);
    setTimeout(function() {
      el.fadeTo(waitTime * 2, localOpacity);
    }, i * tileFadeDelay);
    i += 1;
  });
}

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