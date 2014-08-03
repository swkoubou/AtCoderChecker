(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('UserModel.js'),
        users_url = dir + '../../api/user.php';

    /**
     * ユーザモデル
     *
     * @returns {swkoubou.atcoderchecker.model.UserModel}
     * @constructor
     */
    ns.UserModel = function UserModel() {
        var that = this;

        /**
         * ユーザデータリスト
         * （オブザーバデザイン）
         *
         * @type {function():Array | function(*)}
         */
        that.users = ko.observableArray();

        /**
         * サーバからユーザリストを取得する
         *
         * @returns jQuery.Deferred
         */
        that.fetchUsers = function () {
            var deferred = $.Deferred();

            $.ajax({
                url: users_url,
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

        /**
         * ユーザを追加する
         *
         */
        that.addUser = function (user_id, name, enrollment_year) {
            var deferred = $.Deferred();

            $.ajax({
                url: users_url,
                type: 'post',
                dataType: 'json',
                data: {
                    user_id: user_id,
                    name: name,
                    enrollment_year: enrollment_year
                },
                success: deferred.resolve,
                error: deferred.reject
            });

            return deferred.promise();
        };

        return that;
    };

}());