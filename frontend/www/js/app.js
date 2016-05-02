angular.module('ledgr', ['ionic', 'ngCordova', 'ledgr.controllers', 'ledgr.services', 'ledgr.directives', 'angularRandomString'])

	.run(function ($ionicPlatform, pouchDB, $rootScope, $timeout, $ionicNavBarDelegate) {
		$ionicPlatform.ready(function () {

			$rootScope.docs = {};

			$rootScope.$on("pouchDB:change", function (event, data) {
				$rootScope.docs[data.doc._id] = data.doc;
			});

			$rootScope.$on("pouchDB:delete", function (event, data) {
				delete $rootScope.docs[data.doc._id];
			});

			$rootScope.syncing = false;

			$rootScope.$on('pouchDB:syncActive', function (info) {
				$rootScope.$apply(function ($rootScope) {
					$rootScope.syncing = true;
				});
			});

			$rootScope.$on('pouchDB:syncPaused', function () {
				$rootScope.$apply(function ($rootScope) {
					$rootScope.syncing = false;
				});
			});


			pouchDB.setDatabase('ledgr');
			pouchDB.startListening();
			pouchDB.sync('http://localhost:5984/ledgr');

			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.config(function ($stateProvider, $urlRouterProvider) {

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		$stateProvider

			// setup an abstract state for the tabs directive
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'templates/tabs.html'
			})

			// Each tab has its own nav history stack:

			.state('tab.dash', {
				url: '/dash',
				views: {
					'tab-dash': {
						templateUrl: 'templates/tab-dash.html',
						controller: 'DashCtrl'
					}
				}
			})

			.state('tab.ledger-detail', {
				url: '/ledgers/:ledgerId',
				views: {
					'tab-dash': {
						templateUrl: 'templates/add-new-ledger.html',
						controller: 'LedgerCtrl'
					}
				}
			})

			.state('tab.add-new-ledger', {
				url: '/add-new-ledger',
				views: {
					'tab-dash': {
						templateUrl: 'templates/add-new-ledger.html',
						controller: 'LedgerCtrl'
					}
				}
			})

			.state('tab.ledger-images', {
				url: '/ledgers/:ledgerId/images/:imageId',
				views: {
					'tab-dash': {
						templateUrl: 'templates/ledger-images.html',
						controller: 'LedgerImagesCtrl'
					}
				}
			})

			.state('tab.users', {
				url: '/users',
				views: {
					'tab-users': {
						templateUrl: 'templates/tab-users.html',
						controller: 'UsersCtrl'
					}
				}
			})

			.state('tab.add-new-user', {
				url: '/add-new-user',
				views: {
					'tab-users': {
						templateUrl: 'templates/add-new-user.html',
						controller: 'UsersCtrl'
					}
				}
			})

			.state('tab.user-detail', {
				url: '/users/:userId',
				views: {
					'tab-users': {
						templateUrl: 'templates/add-new-user.html',
						controller: 'UsersCtrl'
					}
				}
			})

			.state('tab.totals', {
				url: '/totals',
				views: {
					'tab-totals': {
						templateUrl: 'templates/tab-totals.html',
						controller: 'TotalsCtrl'
					}
				}
			})

			.state('tab.user-totals', {
				url: '/totals/:userId',
				views: {
					'tab-totals': {
						templateUrl: 'templates/user-totals.html',
						controller: 'UserTotalsCtrl'
					}
				}
			})

			.state('tab.user-ledger-detail', {
				url: '/totals/:userId/ledgers/:ledgerId',
				views: {
					'tab-totals': {
						templateUrl: 'templates/add-new-ledger.html',
						controller: 'LedgerCtrl'
					}
				}
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/dash');

	});

// Define controllers module name
angular.module('ledgr.controllers', []);

// Define services module name
angular.module('ledgr.services', []);

// Define directives module name
angular.module('ledgr.directives', []);
