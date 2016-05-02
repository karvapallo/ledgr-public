angular.module('ledgr.controllers')
  .controller('LedgerImagesCtrl', function (
    $scope,
    $stateParams,
    $ionicSlideBoxDelegate,
    $ionicScrollDelegate,
    pouchDB,
    $timeout
  ) {

    $scope.images = [];
    $scope.activeImage = false;
    $scope.zoomMin = 1;

    $scope.updateSlideStatus = function updateSlideStatus(slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };

    $scope.loadImages = function loadImages() {
      if ($stateParams.ledgerId) {
        pouchDB.get($stateParams.ledgerId).then(function (result) {
          $scope.$apply(function () {
            var i = 0;
            var activeImage = 0;
            _.each(result._attachments, function (image, key) {
              if (key == $stateParams.imageId) {
                activeImage = i;
              }
              $scope.images.push(image);
              i++;
            });
            $ionicSlideBoxDelegate.update();
            $timeout(function () {
              $scope.activeImage = activeImage;
            }, 300);
          });
        });
      }
    };

    $scope.$on('$ionicView.beforeEnter', function afterUserEnter() {
      $scope.images = [];
      $scope.activeSlide = 0;
      $scope.loadImages();
    });
  });
