(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.viewmodel');

    /**
     * ユーザモデル
     *
     * @returns {swkoubou.atcoderchecker.viewmodel.AddUserViewModel}
     * @constructor
     */
    ns.AddUserViewModel = function AddUserViewModel(user_model) {
        var that = this;

        that.userId = ko.observable();

        that.userName = ko.observable();

        that.enrollmentYear = ko.observable();

        that.add = function () {
            return user_model.addUser(that.userId(), that.userName(), that.enrollmentYear())
                .then(function () {
                    // 成功時は入力情報削除
                    that.userId(null);
                    that.userName(null);
                    that.enrollmentYear(null);
                    console.log(arguments);
                });
        };

        return that;
    };

}());