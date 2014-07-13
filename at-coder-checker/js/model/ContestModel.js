(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('ContestModel.js'),
        contest_list_url = dir + '../../stub/contest_list.php',
        contest_url = dir + '../../stub/contest.php';

    ns.ContestModel = function ContestModel() {
        var that = this;

        that.contestList = ko.observableArray();

        that.contests = ko.observableArray();

        that.lastFetchContest = ko.observable();

        that.fetchContestList = function () {
            var deferred = $.Deferred();

            $.ajax({
                url: contest_list_url,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    that.contestList(data);
                    deferred.resolve(data);
                },
                error: deferred.reject
            });

            return deferred.promise();
        };

        that.fetchContest = function (contest_id) {
            var deferred = $.Deferred();

            $.ajax({
                url: contest_url,
                type: 'get',
                dataType: 'json',
                data: { contest_id: contest_id },
                success: function (data) {
                    if (!that.contests().some(function (contest) { return contest.contest_id === data.contest_id; })) {
                        that.contests.push(data);
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