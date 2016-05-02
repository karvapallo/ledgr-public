angular.module('ledgr.controllers')

  .controller('LedgerCtrl', function ($scope, $ionicModal, $rootScope, pouchDB, randomString, $cordovaCamera, $stateParams, $state, $ionicPopup, $window) {

    $scope.users = {};

    $rootScope.$watchCollection('docs', function (val) {
      $scope.users = {};
      angular.forEach(val, function (value, key) {
        if (value.type == 'user') {
          $scope.users[key] = value;
        }
      });
    });

    $scope.onEnter = function onEnter() {
      $scope.potentialCreditors = angular.copy($scope.users);
      $scope.potentialDebtors = angular.copy($scope.users);

      $scope.title = ($stateParams.documentId) ? 'Edit Ledger' : $scope.title = 'Add New Ledger';

      if ($stateParams.ledgerId) {
        pouchDB.get($stateParams.ledgerId).then(function (result) {
          $scope.$apply(function () {
            $scope.newLedger = result;

            _.each($scope.potentialCreditors, function (creditor) {
              _.each($scope.newLedger.creditors, function (c) {
                if (c._id == creditor._id) {
                  creditor.checked = true;
                }
              });
            });

            _.each($scope.potentialDebtors, function (debtor) {
              _.each($scope.newLedger.debtors, function (d) {
                if (d._id == debtor._id) {
                  debtor.checked = true;
                }
              });
            });
          });
        });
      } else {
        $scope.newLedger = {
          type: 'ledger',
          creditors: [],
          debtors: [],
          purchase: '',
          cost: 0.0,
          created: new Date(),
          _attachments: {}
        };
      }
    };

    $scope.$on('$ionicView.enter', function () {
      $scope.onEnter();
    });

    $scope.addNewCreditor = function addNewCreditor() {
      $ionicModal.fromTemplateUrl('templates/creditor-list-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.addNewDebtor = function addNewDebtor() {
      $ionicModal.fromTemplateUrl('templates/debtor-list-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    };

    $scope.addCreditor = function addCreditor() {
      var creditors = _.filter($scope.potentialCreditors, function (val) {
        return val.checked;
      });

      _.each(creditors, function (newCreditor) {
        _.each($scope.newLedger.creditors, function (existingCreditor) {
          if (existingCreditor._id == newCreditor._id) {
            newCreditor.loaned = existingCreditor.loaned;
          }
        });
      });

      $scope.newLedger.creditors = creditors;

      $scope.modal.remove();
    };

    $scope.addDebtor = function addDebtor() {
      var debtors = _.filter($scope.potentialDebtors, function (val) {
        return val.checked;
      });

      _.each(debtors, function (newDebtor) {
        _.each($scope.newLedger.debtors, function (existingDebtor) {
          if (existingDebtor._id == newDebtor._id) {
            newDebtor.owed = existingDebtor.owed;
          }
        });
      });

      $scope.newLedger.debtors = debtors;

      $scope.modal.remove();
    };

    $scope.saveNewLedger = function saveNewLedger(newLedgerForm) {

      if (!newLedgerForm.$valid || $scope.total() != 0 || !$scope.newLedger.creditors.length || !$scope.newLedger.debtors.length) {
        $ionicPopup.alert({
          title: 'You didn\'t fill all fields properly!',
          template: 'Please double check the ledger that it has all fields filled.'
        });
        return false;
      }

      $scope.newLedger.updated = new Date();

      pouchDB.save($scope.newLedger).then(function (response) {
        $window.history.back();
      }, function (error) {
        console.log("ERROR -> " + error);
      });
    };

    $scope.total = function total() {
      var val = parseFloat(_.sum(_.map($scope.newLedger.creditors, 'loaned')) - _.sum(_.map($scope.newLedger.debtors, 'owed')));
      return (!_.isNaN(val)) ? val.toFixed(2) : 'Missing values';
    };

    $scope.deleteImage = function deleteImage(key) {
      $ionicPopup.confirm({
        title: 'Delete Image?',
        template: 'Are you sure you want to delete this image?'
      }).then(function (res) {
        if (res) {
          delete $scope.newLedger._attachments[key];
        }
      });
    };

    $scope.divideEqually = function divideEqually() {
      var calculateEqualDebt = function calculateEqualDebt() {
        var loaned = _.sum(_.map($scope.newLedger.creditors, 'loaned'));
        var equal = loaned / $scope.newLedger.debtors.length;
        _.each($scope.newLedger.debtors, function (debtor) {
          debtor.owed = equal;
        });
      };

      var found = _.find($scope.newLedger.debtors, function(debtor) {
        return parseFloat(debtor.owed) > 0
      });

      if (found) {
        $ionicPopup.confirm({
          title: 'Divide Equally?',
          template: 'You have changed the owed amounts by hand, this will override those changes, are you sure you want to?'
        }).then(function (res) {
          if (res) {
            calculateEqualDebt();
          }
        });
      } else {
        calculateEqualDebt();
      }
    };

    $scope.takePicture = function takePicture() {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1280,
        targetHeight: 1280,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        if (!$scope.newLedger._attachments) {
          $scope.newLedger._attachments = {};
        }
        $scope.newLedger._attachments[randomString()] = {
          'content-type': 'image/jpeg',
          data: imageData
        };
      }, function(err) {
        // error
      });
    }
  });
