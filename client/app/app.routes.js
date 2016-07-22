(function(){
    var app = angular.module('after');

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('siteIndex');

        $stateProvider
            .state('site', {
                url: '',
                templateUrl: 'app/site/index.html',
                abstract: true
            })
            .state('site.index', {
                url: '/site',
                template: '<p> mosovu </p>'
            })

        /*$stateProvider
            .state('site', {
                url: '/site',
                templateUrl: 'app/site/index.html'
            })
            .state('manager', {
                url: '/site/manager',
                templateUrl: 'app/site/manager/addManagerView.html'
            })*/
    });
}());