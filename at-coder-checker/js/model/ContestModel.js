(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.model'),
        dir = util.getDirectPath('ContestModel.js'),
        contest_list_url = dir + '../../api/contest.php';

    ns.ContestModel = function ContestModel() {
        var that = this;

        that.contests = ko.observableArray();

        that.fetchContest = function () {
            var deferred = $.Deferred();

            $.ajax({
                url: contest_list_url,
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