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
            var is_all = contest_id === undefined || contest_id === null;

            return $.ajax({
                url: submission_url,
                type: 'get',
                dataType: 'json',
                data: is_all ? null : { contest_id: contest_id }
            }).then(function (data) {
                var datum;

                if (is_all) {
                    // submissionデータを全て入れ替える
                    that.submissions(data.submissions);
                    that.lastFetchSubmission(data.submissions[0]);
                } else {
                    datum = data.submissions[0];

                    // もし既に存在しているコンテストデータだったら一旦削除する
                    that.submissions.remove(function (submission) { return submission.contest_id === datum.contest_id; });

                    that.submissions.push(datum);
                    that.lastFetchSubmission(datum);
                }
            });
        };

        return that;
    };

}());