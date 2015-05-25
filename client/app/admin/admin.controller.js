'use strict';

angular.module('budgetsApp')
    .controller('AdminCtrl', function ($scope, $http, Auth, User, $modal, socket, growl) {

        $scope.user = {};
        $scope.errors = {};
        var growlconfig = {};

        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        $scope.users = User.query(function() {
            socket.syncUpdates('user', $scope.users);
        });
        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('user');
        });
        /*
         $http.get('/api/users').success(function (users) {
         $scope.users = users;
         });
         */

        var myOtherModal = $modal({scope: $scope, template: 'user-save.html', show: false, animation: 'am-fade-and-scale'});
        $scope.createUser = function () {
            $scope.selectedUser = '';
            $scope.temp = {name:'', email: '', role:'', password:''};
            myOtherModal.$promise.then(myOtherModal.show);

        };
        $scope.cancelUser = function() {
            myOtherModal.hide();
        };

        $scope.temp = {name:'', email: '', role:''};

        $scope.editUser = function (id) {
            $scope.selectedUser = id;
            User.get({id: id}, function(data) {
                $scope.temp = data;
                myOtherModal.$promise.then(myOtherModal.show);
            });
        };

        $scope.saveUser = function () {
            var id = $scope.selectedUser;
            $scope.temp.createdBy = $scope.getCurrentUser().email;
            $scope.temp.date = new Date();
            if (id) {
                User.updateUser({id: id}, $scope.temp,
                    function () {
                        growl.success("The user has been updated", growlconfig);
                        myOtherModal.hide();
                        User.query(function(users) {
                            $scope.users = users;
                        });
                    });
            } else {
                delete $scope.temp._id;
                User.save($scope.temp,
                    function () {
                        growl.success("The user has been saved", growlconfig);
                        myOtherModal.hide();
                        User.query(function(users) {
                            $scope.users = users;
                        });
                    });
            }
        };

        $scope.remoteProvider = function (provider) {
            return provider === 'google';
        };

        // Pre-fetch an external template populated with a custom scope
        var deleteModal = $modal({scope: $scope, template: 'components/templates/confirm.tpl.html', title:'Sure?',
            content:'Do you want to delete this user?', show: false});
        // Show when some event occurs (use $promise property to ensure the template has been loaded)
        $scope.deleteUser = function(id) {
            $scope.selectedUser = id;
            deleteModal.$promise.then(deleteModal.show());
        };

        $scope.answer = function (res) {
            //console.log(res);
            if (res === 'yes') {
                User.delete({id: $scope.selectedUser},
                    function () {
                        growl.success("The user has been deleted", growlconfig);
                        User.query(function(users) {
                            $scope.users = users;
                        });
                    });
            }
            deleteModal.hide();
        };


    });
