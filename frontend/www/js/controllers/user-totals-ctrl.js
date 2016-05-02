angular.module('ledgr.controllers')
  .controller('UserTotalsCtrl', function ($scope, $stateParams, $rootScope) {

    $scope.ledgers = [];

    $scope.$stateParams = $stateParams;

    $rootScope.$watchCollection('docs', function (val) {
      $scope.ledgers = [];
      angular.forEach(val, function (value, key) {
        if (value.type == 'ledger' && (_.find(value.creditors, { _id: $stateParams.userId }) || _.find(value.debtors, { _id: $stateParams.userId }))) {
          $scope.ledgers.push(value);
        }
      });

      $scope.ledgers.sort(function (a, b) {
        return new Date(a.created) - new Date(b.created);
      });
    });
  });
