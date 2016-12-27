$(function () {
    angular.element('[ng-app=sogo]').scope().$on('onNavbarLoaded', function () {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        adjustMinHeight();
    });

    angular.element(window).bind('resize', adjustMinHeight);

    function adjustMinHeight() {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var topOffset = (width < 768) ? 100 : 50;

        var height = ((window.innerHeight > 0) ? window.innerHeight : screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    }

    angular.element('[ng-app=sogo]').scope().$on('$stateChangeSuccess', function (event, toState) {
        $('ul.side-nav a').each(function (i, el) {
            var parent = $(this).parent();
            if (el.href.includes(toState.name)) {
                parent.addClass("active");
            } else {
                parent.removeClass("active");
            }
        });
    });
});
