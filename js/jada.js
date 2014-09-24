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

var mainContentShowing = false;

function showMainContent(content, callback, hideHideLink) {
  var body = $('body');
  var mainTile = $(".tile-main");
  var mainRow = mainTile.parents(".tile-row");
  var mainTileContentDiv = $(".tile-content > div", mainTile);
  var mainTileContent = $(".content", mainTileContentDiv);
  $(".hide-link", mainTile).css("display", hideHideLink ? "none" : "block");
  mainRow.css("display", "block");
  mainTile.fadeIn(waitTime * 2);
  var scrollTop = 
    mainRow.offset().top
     - body.offset().top
     - parseInt(mainTile.css("padding-top").substr(0, 1));
  async.waterfall([
    function(next) {
      body.animate(
      { scrollTop: scrollTop },
      waitTime * 2,
      "swing",
      next);
    },
    function(next) {
      if (mainContentShowing) {
        mainTileContentDiv.fadeOut(waitTime, next);
      } else {
        next();
      }
    },
    function(next) {
      mainTileContent.html(content);
      updateHandlers();
      mainTileContentDiv.fadeIn(waitTime, next);
    },
    function(next) {
      mainContentShowing = true;
      if (callback) callback();
    }
  ]);
}

function showMain(id, callback, hideHideLink) {
  if (!hideHideLink) hideHideLink = false;
  var html = $("#" + id).html();
  if (!html) return;
  showMainContent(html, callback, hideHideLink);
}

function hideMain() {
  var body = $('body');
  var mainTile = $(".tile-main");
  var mainRow = mainTile.parents(".tile-row");
  var mainTileContentDiv = $(".tile-content > div", mainTile);
  var mainTileContent = $(".content", mainTileContentDiv);
  async.waterfall([
    function(next) {
      mainTileContentDiv.fadeOut(waitTime, next);
    },
    function(next) {
      body.animate(
        { scrollTop: 0 },
        waitTime * 2,
        "swing"
      );
      mainTile.fadeOut(waitTime * 2, next);
    },
    function(next) {
      mainRow.css("display", "none");
    }
  ]);
  mainContentShowing = false;
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

      var blogUrl = "api/blog";

      function blogSuccess(blogPosts) {
        blogDone(blogPosts);
      }

      function blogFail(error) {
        console.log(error);
        blogDone([]);
      }

      function blogDone(blogPosts) {
        console.log(blogPosts);
        next();
      }

      var ajaxRequest = $.ajax(blogUrl);
      ajaxRequest.done(function(response) {
        if (!response['error']) {
          blogSuccess(response);
        } else {
          blogFail(response['error']);
        }
      });
      ajaxRequest.fail(function(response) {
        blogFail("I couldn't reach '" + blogUrl + "'");
      });

    },
    function(next) {
      updateHandlers();
      fadeWork($(".tile-content", $(".tile").not(".static")), fadedOutOpacity, false);
      fadeWork($('.tile.tile-me-text .icons a'), fadedOutIconsOpacity, true);
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
  ]);

});