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

}());