(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('UserModel.js'),
        url = dir + '../../stub/user.php';

    ns.UserModel = function UserModel() {
        var that = this;

        that.users = ko.observableArray();

        that.fetchUsers = function () {
            var deferred = $.Deferred();

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    that.users(data);
                    deferred.resolve(data);
                },
                error: deferred.reject
            });

            return deferred.promise();
        };

        return that;
    };

}());