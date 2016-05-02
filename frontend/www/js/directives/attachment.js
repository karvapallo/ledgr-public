angular.module('ledgr.directives')

  .directive('attachment', function (pouchDB) {
    return {
      scope: {
        attachment: '='
      },
      link: function (scope, element, attr) {
        element.css('display', 'none');
        pouchDB.get(scope.attachment).then(function onAttachmentGet(result) {
          if (result._attachments) {
            var attachment = _.find(result._attachments, function (val) { return val });
            if (attachment && attachment.data) {
              element.attr('src', 'data:image/jpeg;base64,' + attachment.data);
              element.css('display', 'inline');
            }
          }
        });
      }
    }
  });
