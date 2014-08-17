var waitTime = 250;
var fadedOutOpacity = 0.85;
var fadedOutIconsOpacity = 0.5;

function fadeWork(selectorResult, opacity, setInitially) {
  if (setInitially) {
    selectorResult.css("opacity", opacity);
  }
  selectorResult.hover(
    function() {
      $(this).stop().fadeTo(waitTime, 1);
    },
    function() {
      $(this).stop().fadeTo(waitTime, opacity);
    }
  );
}

async.waterfall([
  function(next) {
    $(window).load(function() {
      $("#Fader").fadeOut(waitTime, next);
    });
  },
  function(next) {
    $(document).ready(function() {
      fadeWork($(".tile").not(".static"), fadedOutOpacity, false);
      fadeWork($('.tile.me-text p.icons a'), fadedOutIconsOpacity, true);
    });
    $(".tile").each(function() {
      var opacity = ($(this).hasClass("static") ? 1 : fadedOutOpacity);
      $(this).fadeTo(waitTime * 2, opacity);
    });
  }
]);