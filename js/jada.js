var waitTime = 250;
var fadedOutOpacity = 0.85;
var fadedOutIconsOpacity = 0.5;
var spacing = 16;

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
      fadeWork($('.tile a.inner-link'), fadedOutOpacity, true);
      $(".tile").not(".hide").each(function() {
        var opacity = ($(this).hasClass("static") ? 1 : fadedOutOpacity);
        $(this).fadeTo(waitTime * 2, opacity);
      });
      $("#read-more-link").click(function() {
        $("#main").css("display", "block");
        $("#main .tile").fadeIn(waitTime * 2);
        $('main').animate({
          scrollTop: $("#main").offset().top - (spacing * 2)
        }, waitTime * 2);
        return false;
      });
    });
  }
]);