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

function switchMainContent(content, callback) {
  var main = $('main');
  var mainRow = $("#main");
  var mainTile = $($("#main .tile")[0]);
  mainTile.html(content);
  mainRow.css("display", "block");
  mainTile.fadeIn(waitTime * 2);
  main.animate(
    { scrollTop: mainRow.offset().top - (spacing * 2) + main.scrollTop() },
    waitTime * 2,
    "swing",
    function(){ if (callback) callback() }
  );
}

function switchMain(id, callback) {
  var html = $("#" + id);
  if (!html) return;
  switchMainContent(html, callback);
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
        switchMain("about-me");
        return false;
      });
    });
  }
]);