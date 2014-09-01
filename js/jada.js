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

function showMainContent(content, callback, hideHideLink) {
  var main = $('main');
  var mainRow = $("#main");
  var mainTile = $($(".tile", mainRow)[0]);
  var mainTileContent = $($(".content", mainTile)[0]);
  mainTileContent.html(content);
  updateHandlers();
  $(".hide-link", mainTile).css("display", hideHideLink ? "none" : "block");
  mainRow.css("display", "block");
  mainTile.fadeIn(waitTime * 2);
  var scrollTop = mainRow.offset().top - main.offset().top + parseInt(mainTile.css("padding-top").substr(0, 1));
  // console.log("NEW:")
  // console.log("add " + mainRow.offset().top + " [mainRow.offset().top]");
  // console.log("take away " + main.offset().top + " [main.offset().top]");
  // console.log("add " + parseInt(mainTile.css("padding-top").substr(0, 1)) + " [parseInt(mainTile.css(\"padding-top\").substr(0, 1))]");
  $("body").animate(
    { scrollTop: scrollTop },
    waitTime * 2,
    "swing",
    function() {
      if (callback) callback()
    }
  );
}

function showMain(id, callback, hideHideLink) {
  if (!hideHideLink) hideHideLink = false;
  var html = $("#" + id).html();
  if (!html) return;
  showMainContent(html, callback, hideHideLink);
}

function hideMain() {
  var main = $('main');
  var mainRow = $("#main");
  var mainTile = $($(".tile", mainRow)[0]);
  $("body").animate(
    { scrollTop: 0 },
    waitTime * 2,
    "swing"
  );
  mainTile.fadeOut(waitTime * 2, function() {
    mainRow.css("display", "none");
  });
  return false;
}

function updateHandlersStaticContent() {
  showMain($(this).attr("data-show-static"), null, ($(this).attr("data-hide-hide-link") != undefined));
  return false;
}

function updateHandlers() {
  //Static Content
  $("*[data-show-static]")
    .off("click", updateHandlersStaticContent)
    .on("click", updateHandlersStaticContent);
  //Hide Main Content
  $("*[data-hide-main]")
    .off("click", hideMain)
    .on("click", hideMain);
  //Tile Links
  fadeWork($('> * a', $('.tile-content').not(".no-link-fade")), fadedOutOpacity, true);
}

$(window).load(function() {

  async.waterfall([
    function(next) {
      updateHandlers();
      fadeWork($(".tile-content", $(".tile").not(".static")), fadedOutOpacity, false);
      fadeWork($('.tile.tile-me-text .icons a'), fadedOutIconsOpacity, true);
      var i = 0;
      $(".tile-content", $(".tile")).not(".hide").each(function() {
        var el = $(this);
        setTimeout(function() {
          var opacity = el.parent().hasClass("static") ? 1 : fadedOutOpacity;
          el.fadeTo(waitTime * 2, opacity);
        }, i * tileFadeDelay);
        i += 1;
      });
    }
  ]);

});