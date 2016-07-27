(function(){
    var app = angular.module('after');

    app.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('site');

        $stateProvider
            .state('site', {
                url: '',
                templateUrl: 'app/site/index.html',
                abstract: true
            })
            .state('site.index', {
                url: '/site',
                templateUrl: 'app/site/home/home.html'
            })
            .state('site.manager', {
                url:'/site/manager',
                templateUrl: 'app/site/manager/addManagerView.html'
            });
    });
}());