var waitTime = 250;
var fadedOutOpacity = 0.9;
var fadedOutIconsOpacity = 0.5;
var tileFadeDelay = 75;

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

function fadeAll() {
  var i = 0;
  $(".fade").each(function() {
    var el = $(this);
    setTimeout(function() {
      opacity = fadedOutOpacity;
      el.fadeTo(waitTime * 2, opacity);
    }, i * tileFadeDelay);
    i += 1;
  });
}

$(window).load(function() {
  async.waterfall([
    function(next) {
      fadeWork($(".tile-content", $(".tile").not(".static")), fadedOutOpacity, false);
      fadeWork($('.tile.tile-me-text .icons a'), fadedOutIconsOpacity, true);
    }
  ]);
});