(function(){
    var app = angular.module('after');

    app.controller('ManagerCtrl', ['$scope','Manager', function($scope, Manager) {

        $scope.manager = new Manager({id:1});

        console.log($scope.manager);

        console.log('managerCtrl', $scope.manager);
    }]);

}());