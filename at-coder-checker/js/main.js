$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        vm = {};

    vm.users = ko.observableArray();
    vm.contest_list = ko.observableArray();
    vm.current_contest_id = ko.observable();
    vm.submissions = ko.observableArray();
    vm.problems = ko.observable();

    user_model.users.subscribe(function (users) {
        vm.users(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));
    });

    contest_model.contestList.subscribe(function (contests) {
        vm.contest_list(contests);
    });

    vm.update_current_contest = function () {
        if (!vm.current_contest_id()) {
            return;
        }

        $.when(
            user_model.fetchUsers(),
            contest_model.fetchContest(vm.current_contest_id())
        ).done(function () {
            var contest = contest_model.lastFetchContest(),
                users = _.pluck(user_model.users(), 'user_id'),
                problems = contest.problems,
                submissions_ary = _.map(contest.problems, function (problem) {
                    var submissions = _.indexBy(problem.submissions, 'user_id');

                    return _.map(users, function (user) {
                        return submissions[user] ? submissions[user] : null;
                    });
                }),
                submissions = _.object(_.pluck(problems, 'problem_id'), submissions_ary);

            vm.submissions(submissions);
            vm.problems(problems);
        });
    };

    //

    contest_model.fetchContestList();

    ko.applyBindings(vm);

    //

    setTimeout(function () {
        vm.current_contest_id(1);
        vm.update_current_contest();
    }, 100);

});