$(document).ready(function () {
    var topOffset = 50;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 768) {
        $('div.navbar-collapse').addClass('collapse');
        topOffset = 100; // 2-row-menu
    } else {
        $('div.navbar-collapse').removeClass('collapse');
    }

    var height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
    height = height - topOffset;
    if (height < 1) height = 1;
    if (height > topOffset) {
        $("#page-wrapper").css("min-height", (height) + "px");
    }

    $("ul.side-nav li:first").addClass("active").show();
    $("ul.side-nav li").click(function() {
        $("ul.side-nav li").removeClass("active");
    });
    $(".navbar-brand").click(function() {
        $("ul.side-nav li:first").addClass("active");
    });
});
