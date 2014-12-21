(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.viewmodel');

    /**
     * ユーザViewModel
     */
    ns.UserViewModel = function UserViewModel(user_model) {
        var that = this;

        that.users = ko.observableArray();

        user_model.users.subscribe(function (users) {
            // 入学年度, 名前で昇順にソート
            users = users.sort(function (a, b) {
                return (a.enrollment_year === b.enrollment_year ? a.name > b.name : a.enrollment_year > b.enrollment_year) ? 1 : -1;
            });

            users.forEach(function (user) {
                // ユーザ表示名の決定
                user.displayName = user.name + '<br>(' + user.user_id + ')';
                user.displayNameInline = user.name + '(' + user.user_id + ')';

                // 提出用リンク作成
                user.submissionUrl = ko.observable();

                // 選択されたコンテストの正答submission数
                user.acceptNum = ko.observable(0);

                // tableに表示するか否か （可能なら）localStorageに値を保持する
                (function () {
                    var x = ko.observable(true),
                        key = 'user.' + user.user_id + '.visible';

                    if (localStorage) {
                        x(localStorage.getItem(key) !== 'false');

                        user.visible = ko.computed({
                            read: function () {
                                return x();
                            },
                            write: function (value) {
                                value = Boolean(value);
                                localStorage.setItem(key, value);
                                x(value);
                            }
                        });
                    } else {
                        user.visible = x;
                    }
                }());

            });

            that.users(users);
        });

        return that;
    };

}());