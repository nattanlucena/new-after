(function() {
    var app = angular.module('after');


    /**
     * The data model for the Manager
     * */
    app.factory('Manager', ['$http', function($http) {
        function Manager(manager) {
            if(manager) {
                this.setData(manager);
            }
        };

        Manager.prototype = {
            setData: function(manager) {
                angular.extend(this, manager);
            },
            get: function(id) {
                var scope = this;
                scope.setData({id:1, name: 'teste'});
            },
            post: function(data) {
                console.log('post', data);
            },
            put: function(id, data) {
                console.log('put', id, data);
            },
            remove: function(id) {
                console.log('remove', id);
            }

        };

        return Manager;
    }]);
})();