'use strict';

angular.module('budgetsApp')
    .controller('MainCtrl', function ($scope, BService, socket, $modal, Auth, growl) {

        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;

        var growlconfig = {};

        $scope.budgets = BService.query(function() {
            socket.syncUpdates('budget', $scope.budgets);
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('budget');
        });


        var myOtherModal = $modal({scope: $scope, template: 'newTemplate.html', show: false, animation: 'am-fade-and-scale'});
        $scope.createBudget = function () {
            $scope.selectedBudget = '';
            $scope.temp = {name: '',
                customer: '',
                instructorFee: 0,
                instructorHours: 0,
                instructorTotal: 0,
                vendorFee: 0,
                vendorCount: 0,
                vendorTotal: 0,
                manualsFee: 0,
                manualsCount: 0,
                manualsTotal: 0,
                expensesFee: 0,
                expensesCount: 0,
                expensesTotal: 0,
                travelCost: 0,
                travelCount: 0,
                travelTotal: 0,
                date: new Date(),
                comments: '',
                ic: 0,
                dc: 0,
                bi: 0,
                total: 0};
            myOtherModal.$promise.then(myOtherModal.show);
        };

        $scope.updateBudget = function () {
            $scope.temp.instructorTotal = $scope.temp.instructorFee * $scope.temp.instructorHours;
            $scope.temp.vendorTotal = $scope.temp.vendorFee * $scope.temp.vendorCount;
            $scope.temp.manualsTotal = $scope.temp.manualsFee * $scope.temp.manualsCount;
            $scope.temp.expensesTotal = $scope.temp.expensesFee * $scope.temp.expensesCount;
            $scope.temp.travelTotal = $scope.temp.travelCost * $scope.temp.travelCount;
            $scope.temp.ic = 0.2 * Number($scope.temp.total).toFixed(2);
            $scope.temp.dc = $scope.temp.instructorTotal + $scope.temp.vendorTotal + $scope.temp.manualsTotal +
                $scope.temp.expensesTotal + $scope.temp.travelTotal;
            $scope.temp.bi = ($scope.temp.total - $scope.temp.dc - $scope.temp.ic) * 100 / $scope.temp.total;
            //console.log('Updating totals: ' + JSON.stringify($scope.temp));
        };

        $scope.calculateBudget = function () {
            //console.log('Calculando...');
            $scope.temp.total = (-100 * $scope.temp.dc) / (25 - 80);
            $scope.updateBudget();
        };
        $scope.cancelBudget = function() {
            myOtherModal.hide();
        };

        $scope.temp = {name:'', createdBy: '', date:'', content:'', files:[]};

        $scope.editBudget = function (id) {
            $scope.selectedBudget = id;
            BService.get({id: id}, function(data) {
                $scope.temp = data;
                myOtherModal.$promise.then(myOtherModal.show);
            });
        };

        $scope.saveBudget = function () {
            var id = $scope.selectedBudget;
            $scope.temp.createdBy = $scope.getCurrentUser().email;
            $scope.temp.date = new Date();
            if (id) {
                BService.update({id: id}, $scope.temp,
                    function () {
                        growl.success("The budget has been updated", growlconfig);
                        myOtherModal.hide();
                    });
            } else {
                delete $scope.temp._id;
                BService.save($scope.temp,
                    function () {
                        growl.success("The budget has been saved", growlconfig);
                        myOtherModal.hide();
                    });
            }
        };

        // Pre-fetch an external template populated with a custom scope
        var deleteModal = $modal({scope: $scope, template: 'components/templates/confirm.tpl.html', title:'Sure?',
            content:'Do you want to delete this budget?', show: false});
        // Show when some event occurs (use $promise property to ensure the template has been loaded)
        $scope.deleteBudget = function(id) {
            $scope.selectedBudget = id;
            deleteModal.$promise.then(deleteModal.show());
        };

        $scope.answer = function (res) {
            //console.log(res);
            if (res === 'yes') {
                BService.delete({id: $scope.selectedBudget},
                    function () {
                        growl.success("The budget has been deleted", growlconfig);
                    });
            }
            deleteModal.hide();
        };

    });
