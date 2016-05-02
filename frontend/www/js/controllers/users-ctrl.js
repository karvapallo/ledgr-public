angular.module('ledgr.controllers')
  .controller('UsersCtrl', function ($scope, pouchDB, $state, $stateParams, $rootScope, $ionicModal, $cordovaCamera, $ionicPopup, $ionicListDelegate, $timeout) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    /*
     if ($stateParams.documentId) {
     pouchDB.get($stateParams.documentId).then(function (result) {
     $scope.inputForm = result;
     });
     }
     */

    $scope.takePicture = function takePicture() {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 640,
        targetHeight: 640,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.newUser._attachments = {
          avatar: {
            'content-type': 'image/jpeg',
            data: imageData
          }
        }
      }, function(err) {
        // error
      });
    };

    if ($stateParams.userId) {
      pouchDB.get($stateParams.userId).then(function (result) {
        $scope.$apply(function () {
          $scope.newUser = result;
        });
      });
    } else {
      $scope.newUser = {
        name: '',
        email: '',
        type: 'user',
        hasPayed: false
      }
    }

    $scope.save = function () {
      pouchDB.save($scope.newUser).then(function (response) {
        $state.go('tab.users');
      }, function (error) {
        console.log("ERROR -> " + error);
      });
    };

    $scope.delete = function (id, rev) {
      var myPopup = $ionicPopup.confirm({
        title: 'Delete User?',
        template: 'Are you sure you want to delete this user?'
      }).then(function (res) {
        if(res) {
          pouchDB.delete(id, rev);
        }
      });
    };
  });
