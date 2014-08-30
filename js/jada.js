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
  updateHandlers();
  mainRow.css("display", "block");
  mainTile.fadeIn(waitTime * 2);
  var scrollTop = mainRow.offset().top + main.scrollTop() - main.offset().top + parseInt(mainTile.css("padding-top").substr(0, 1));
  $("body").animate(
    { scrollTop: scrollTop },
    waitTime * 2,
    "swing",
    function() {
      if (callback) callback()
    }
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
  showMain($(this).attr("data-show-static"));
  return false;
}

function updateHandlersBlogContent() {
  return false;
}

function updateHandlers() {
  //Static Content
  $("*[data-show-static]")
    .off("click", updateHandlersStaticContent)
    .on("click", updateHandlersStaticContent);
  //Blog Content
  $("*[data-show-blog]")
    .off("click", updateHandlersBlogContent)
    .on("click", updateHandlersBlogContent);
  //Hide Main Content
  $("#hide-main-link")
    .off("click", hideMain)
    .on("click", hideMain);
  //Tile Links
  fadeWork($('.tile p a'), fadedOutOpacity, true);
}

$(window).load(function() {

  async.waterfall([
    function(next) {
      updateHandlers();
      fadeWork($(".tile-content", $(".tile").not(".static")), fadedOutOpacity, false);
      fadeWork($('.tile.me-text .icons a'), fadedOutIconsOpacity, true);
      $(".tile-content", $(".tile")).not(".hide").each(function() {
        var opacity = ($(this).parent().hasClass("static") ? 1 : fadedOutOpacity);
        $(this).fadeTo(waitTime * 2, opacity);
      });
      // $(".nano").nanoScroller();
    }
  ]);

});