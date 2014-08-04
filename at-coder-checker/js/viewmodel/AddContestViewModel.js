(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.viewmodel');

    /**
     * コンテスト追加ViewModel
     *
     * @param contest_model {swkoubou.atcoderchecker.model.ContestModel}
     * @returns {swkoubou.atcoderchecker.viewmodel.AddContestViewModel}
     * @constructor
     */
    ns.AddContestViewModel = function AddContestViewModel(contest_model) {
        var that = this;

        /**
         * 追加するコンテストURL
         *
         * @type {function():string | function(string)}
         */
        that.url = ko.observable();

        /**
         * コンテストを追加する
         *
         * @returns {jQuery.Deferred}
         */
        that.add = function () {
            return contest_model.addContest(that.url())
                .then(function () {
                    // 成功時は入力情報削除
                    that.url(null);
                });
        };

        return that;
    };

}());