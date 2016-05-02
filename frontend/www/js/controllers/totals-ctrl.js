angular.module('ledgr.controllers')
  .controller('TotalsCtrl', function ($scope, $rootScope, pouchDB) {


    $scope.users = [];

    $rootScope.$watchCollection('docs', function (val) {
      $scope.users = [];
      $scope.ledgers = [];
      angular.forEach(val, function (value, key) {
        if (value.type == 'user') {
          $scope.users.push(value);
        }
        if (value.type == 'ledger') {
          $scope.ledgers.push(value);
        }
      });

      _.each($scope.users, function (user) {
        user.total = 0.0;
        _.each($scope.ledgers, function (ledger) {
          _.each(ledger.creditors, function (creditor) {
            if (creditor._id == user._id) {
              user.total += parseFloat(creditor.loaned);
            }
          });
          _.each(ledger.debtors, function (debtor) {
            if (debtor._id == user._id) {
              user.total -= parseFloat(debtor.owed);
            }
          });
        });
      });
    });
  });
