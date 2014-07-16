(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.viewmodel'),
        model_ns = util.namespace('swkoubou.atcoderchecker.model');

    ns.HogeViewModel = function HogeViewModel(models) {
        var that = this,
            safe_models = models || {},
            user_model = safe_models.user_model || new model_ns.UserModel(),
            contest_model = safe_models.contest_model || new model_ns.ContestModel();

        that.contest_list = ko.observableArray();
        that.current_contest = ko.observable();
        that.users = ko.observableArray();
        that.submissions = ko.observableArray();
        that.problems = ko.observable();

        that.current_contest_id = ko.observable();

        contest_model.contestList.subscribe(function (contests) {
            that.contest_list(contests);
        });

        user_model.users.subscribe(function (users) {
            users.forEach(function (user) {
                user.displayName = user.name + '(' + user.user_id + ')';
            });
            that.users(users);
        });

        that.update_current_contest = function () {
            return $.when(
                    user_model.fetchUsers(),
                    contest_model.fetchContest(that.current_contest().contest_id)
                ).done(function () {
                    var contest = contest_model.lastFetchContest(),
                        users = _.pluck(user_model.users(), 'user_id'),
                        problems = contest.problems,
                        submissions_ary = _.map(users, function (user) {
                            return _.map(problems, function (problem) {
                                return _.where(problem.submissions, { user_id: user })[0] || null;
                            });
                        }),
                        submissions = _.object(users, submissions_ary);

                    that.submissions(submissions);

                    problems.forEach(function (problem) {
                        problem.displayName = problem.assignment + ': ' + problem.name;
                    });
                    that.problems(problems);
                });
        };

        that.decideItem = function (e) {
//        window.addEventListener('popstate', function () {
//
//        });

            // view用にdelay
            setTimeout(function () {
                $.pjax({
                    url: 'submission.php?contest_id=' + e.contest_id,
                    container: 'body'
                });
            }, 1000);

            $(document).on('pjax:success', function () {
                ko.applyBindings(that, document.getElementById('container-submission'));
            });

            that.current_contest(e);
            that.update_current_contest();
        };

        return that;
    };
}());