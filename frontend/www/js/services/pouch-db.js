angular.module('ledgr.services').service('pouchDB', ['$rootScope', '$q', function ($rootScope, $q) {
	var database;
	var changeListener;

	this.setDatabase = function (databaseName) {
		database = new PouchDB(databaseName, {
			ajax: {
				cache: false,
				timeout: 10000
			},
			cache: false
		});
	};

	this.startListening = function () {
		changeListener = database.changes({
			live: true,
			retry: true,
			include_docs: true,
			// attachments: true,
			// since: 0,
			// batches_limit: 5,
			// batch_size: 5
		}).on("change", function (change) {
			if (!change.deleted) {
				$rootScope.$apply(function ($rootScope) {
					$rootScope.$broadcast("pouchDB:change", change);
				});
			} else {
				$rootScope.$apply(function ($rootScope) {
					$rootScope.$broadcast("pouchDB:delete", change);
				});
			}
		});
	};

	this.stopListening = function () {
		changeListener.cancel();
	};

	this.sync = function (remoteDatabase) {
		database.sync(remoteDatabase, {
			live: true,
			retry: true,
			//include_docs: true,
			//attachments: true,
			//since: 0,
			// batches_limit: 5,
			// batch_size: 5

		}).on("change", function (change) {
			console.log('sync change: ', change);
		}).on('active', function (info) {
			$rootScope.$broadcast("pouchDB:syncActive", info);
		}).on('paused', function (info) {
			$rootScope.$broadcast("pouchDB:syncPaused");
		});
	};

	this.save = function (jsonDocument) {
		var deferred = $q.defer();
		if (!jsonDocument._id) {
			database.post(jsonDocument).then(function (response) {
				deferred.resolve(response);
			}).catch(function (error) {
				deferred.reject(error);
			});
		} else {
			database.put(jsonDocument).then(function (response) {
				deferred.resolve(response);
			}).catch(function (error) {
				deferred.reject(error);
			});
		}
		return deferred.promise;
	};

	this.delete = function (documentId, documentRevision) {
		return database.remove(documentId, documentRevision);
	};

	this.get = function (documentId) {
		return database.get(documentId, { attachments: true });
	};

	this.getAllDocs = function () {
		return database.allDocs({ include_docs: true, attachments: true });
	};

	this.destroy = function () {
		database.destroy();
	};
}]);
