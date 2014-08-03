(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('SubmissionModel.js'),
        submission_url = dir + '../../api/submission.php';

    ns.SubmissionModel = function SubmissionModel() {
        var that = this;

        that.submissions = ko.observableArray();

        that.lastFetchContest = ko.observable();

        that.fetchSubmission = function (contest_id) {
            var deferred = $.Deferred();

            $.ajax({
                url: submission_url,
                type: 'get',
                dataType: 'json',
                data: { contest_id: contest_id },
                success: function (data) {
                    if (!that.submissions().some(function (contest) { return contest.contest_id === data.contest_id; })) {
                        that.submissions.push(data);
                    }

                    that.lastFetchContest(data);

                    deferred.resolve(data);
                },
                error: deferred.reject
            });

            return deferred.promise();
        };

        return that;
    };

}());