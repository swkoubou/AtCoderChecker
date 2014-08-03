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
                    that.contests(data);
                    deferred.resolve(data);
                },
                error: deferred.reject
            });

            return deferred.promise();
        };

        return that;
    };

}());