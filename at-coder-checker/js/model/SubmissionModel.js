(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('SubmissionModel.js'),
        submission_url = dir + '../../api/submission.php';

    /**
     * サブミッションモデル
     *
     * @returns {swkoubou.atcoderchecker.model.SubmissionModel}
     * @constructor
     */
    ns.SubmissionModel = function SubmissionModel() {
        var that = this;

        /**
         * サブミッションリスト
         *
         * @type {function():Array | function(*)}
         */
        that.submissions = ko.observableArray();

        /**
         * 最後にサーバから取得した、コンテストとサブミッションのデータ
         *
         * @type {Object}
         */
        that.lastFetchSubmission = ko.observable();

        /**
         * サーバから指定したコンテストIDのサブミッションを取得する
         *
         * @param contest_id {number}
         * @returns {jQuery.Deferred}
         */
        that.fetchSubmission = function (contest_id) {
            var deferred = $.Deferred();

            $.ajax({
                url: submission_url,
                type: 'get',
                dataType: 'json',
                data: { contest_id: contest_id },
                success: function (data) {
                    // もし既に存在しているコンテストデータだったら一旦削除する
                    that.submissions.remove(function (submission) { return submission.contest_id === data.contest_id; });

                    that.submissions.push(data);

                    that.lastFetchSubmission(data);

                    deferred.resolve(data);
                },
                error: deferred.reject
            });

            return deferred.promise();
        };

        return that;
    };

}());