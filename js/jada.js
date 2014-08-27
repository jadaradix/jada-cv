var waitTime = 250;
var fadedOutOpacity = 0.9;
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

function showMainContent(content, callback) {
  var main = $('main');
  var mainNanoContent = $(".nano-content", main);
  var mainRow = $("#main");
  var mainTile = $($(".tile", mainRow)[0]);
  var mainTileContent = $($(".content", mainTile)[0]);
  mainTileContent.html(content);
  mainRow.css("display", "block");
  mainTile.fadeIn(waitTime * 2);
  var scrollTop = mainRow.offset().top + main.scrollTop() - main.offset().top + parseInt(mainTile.css("padding-top").substr(0, 1));
  main.animate(
    { scrollTop: scrollTop },
    waitTime * 2,
    "swing",
    function(){ if (callback) callback() }
  );
}

function showMain(id, callback) {
  var html = $("#" + id).html();
  if (!html) return;
  showMainContent(html, callback);
}

function hideMain() {
  var main = $('main');
  var mainNanoContent = $(".nano-content", main);
  var mainRow = $("#main");
  var mainTile = $($(".tile", mainRow)[0]);
  main.animate(
    { scrollTop: 0 },
    waitTime * 2,
    "swing"
  );
  mainTile.fadeOut(waitTime * 2, function() {
    mainRow.css("display", "none");
  });
}

$(window).load(function() {

  async.waterfall([
    function(next) {
      fadeWork($(".tile-content", $(".tile").not(".static")), fadedOutOpacity, false);
      fadeWork($('.tile.me-text .icons a'), fadedOutIconsOpacity, true);
      fadeWork($('.tile p a'), fadedOutOpacity, true);
      $(".tile-content", $(".tile")).not(".hide").each(function() {
        var opacity = ($(this).parent().hasClass("static") ? 1 : fadedOutOpacity);
        $(this).fadeTo(waitTime * 2, opacity);
      });
      $("*[data-show-div]").click(function() {
        showMain($(this).attr("data-show-div"));
        return false;
      });
      $("#hide-main-link").click(function() {
        hideMain();
        return false;
      });
      $(".nano").nanoScroller();
    }
  ]);

});