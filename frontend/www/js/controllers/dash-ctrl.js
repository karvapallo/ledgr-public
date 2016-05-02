angular.module('ledgr.controllers')

  .controller('DashCtrl', function ($scope, $ionicModal, $rootScope, pouchDB, $window, $ionicPopup, $ionicNavBarDelegate, $timeout) {

    $scope._ = $window._;

    $rootScope.$watchCollection('docs', function (val) {
      $scope.ledgers = [];
      angular.forEach(val, function (value) {
        if (value.type == 'ledger') {
          $scope.ledgers.push(value);
        }
      });

      $scope.ledgers.sort(function (a, b) {
        return new Date(a.created) - new Date(b.created);
      });

      $ionicNavBarDelegate.title('Ledgers - ' + $scope.ledgers.length);
    });

    $scope.$on('$ionicView.enter', function (event, data) {
      $timeout(function () {
        $ionicNavBarDelegate.title('Ledgers - ' + $scope.ledgers.length);
      });
    });

    $scope.delete = function (id, rev) {
      $ionicPopup.confirm({
        title: 'Delete Ledger?',
        template: 'Are you sure you want to delete this ledger?'
      }).then(function (res) {
        if (res) {
          pouchDB.delete(id, rev);
        }
      });
    };

  });
