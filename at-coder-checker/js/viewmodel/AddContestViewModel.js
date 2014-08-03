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

        that.url = ko.observable();

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