function fadeAll(fromClass, toClass, delay) {
  console.log("here... with " + fromClass);
  if (!delay) delay = 150;
  var i = 0;
  $("." + fromClass).each(function(index, element) {
    console.log(element);
    setTimeout(function() {
      $(element).addClass(toClass);
      setTimeout(function() {
        $(element).removeClass(fromClass);
      }, 1 * 1000 * 1.1);
    }, i * delay);
    i += 1;
  });
}

function easyAjax(url, callback) {

  function ajaxSuccess(data) {
    callback(data);
  }

  function ajaxFail(error) {
    console.log(error);
    callback(null);
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