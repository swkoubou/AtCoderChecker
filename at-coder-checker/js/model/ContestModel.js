(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('ContestModel.js'),
        contests_url = dir + '../../api/contest.php';

    /**
     * コンテストモデル
     *
     * @returns {swkoubou.atcoderchecker.model.ContestModel}
     * @constructor
     */
    ns.ContestModel = function ContestModel() {
        var that = this;

        /**
         * コンテストリスト
         *
         * @type {function():Array | function(*)}
         */
        that.contests = ko.observableArray();

        /**
         * サーバからコンテストリストを取得する
         *
         * @returns {jQuery.Deferred}
         */
        that.fetchContests = function () {
            var deferred = $.Deferred();

            $.ajax({
                url: contests_url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    // URLで降順にソート
                    data = data.sort(function (a, b) { return a.url < b.url ? 1 : -1; });

                    that.contests(data);
                    deferred.resolve(data);
                },
                error: deferred.reject
            });

            return deferred.promise();
        };

        /**
         * コンテストを追加する
         *
         * @returns {jQuery.Deferred}
         */
        that.addContest = function (url) {
            var deferred = $.Deferred();

            $.ajax({
                url: contests_url,
                type: 'post',
                dataType: 'json',
                data: { url: url },
                success: deferred.resolve,
                error: deferred.reject
            });

            return deferred.promise();
        };

        return that;
    };

}());