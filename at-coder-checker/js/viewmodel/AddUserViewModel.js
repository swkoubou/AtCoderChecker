(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.viewmodel');

    /**
     * ユーザ追加ViewModel
     *
     * @param user_model {swkoubou.atcoderchecker.model.UserModel}
     * @returns {swkoubou.atcoderchecker.viewmodel.AddUserViewModel}
     * @constructor
     */
    ns.AddUserViewModel = function AddUserViewModel(user_model) {
        var that = this;

        /**
         * 追加するユーザのユーザID
         *
         * @type {function():string | function(string)}
         */
        that.userId = ko.observable();

        /**
         * 追加するユーザのユーザ名
         *
         * @type {function():string | function(string)}
         */
        that.userName = ko.observable();

        /**
         * 追加するユーザの入学年度
         *
         * @type {function():number | function(number)}
         */
        that.enrollmentYear = ko.observable();

        /**
         * ユーザを追加する
         *
         * @returns {jQuery.Deferred}
         */
        that.add = function () {
            return user_model.addUser(that.userId(), that.userName(), that.enrollmentYear())
                .then(function () {
                    // 成功時は入力情報削除
                    that.userId(null);
                    that.userName(null);
                    that.enrollmentYear(null);
                });
        };

        return that;
    };

}());