(function(){
    var app = angular.module('after');

    /**
     * Header default do App
     * */
    app.directive('appHeader', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/shared/appHeaderView.html',
            replace: true
        }
    });

    /**
     * Footer default do App
     * */
    app.directive('appFooter', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/shared/appFooterView.html',
            replace: true
        }
    });

    /**
     * Header of the Site
     * */
    app.directive('siteHeader', function() {
        return {
            restrict: 'A',
            templateUrl: 'app/shared/siteHeaderView.html',
            replace: true,
            link: function() {
                var teste = $('body').scrollspy({
                    target: '.navbar-fixed-top',
                    offset: 100
                });

                console.log(teste);
            }
        }
    });

    /**
     * Site main section
     * */

}());