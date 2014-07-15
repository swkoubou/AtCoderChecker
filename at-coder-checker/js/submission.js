$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        view_ns = util.namespace('swkoubou.atcoderchecker.view'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        vm = new view_ns.ContestListView(),
        qry = util.parseGetQuery(window.location.search),
        contest_id = Number(qry.contest_id);

    vm.contest_list = ko.observableArray();
    vm.current_contest = ko.observable();
    vm.users = ko.observableArray();
    vm.submissions = ko.observableArray();
    vm.problems = ko.observable();

    contest_model.contestList.subscribe(function (contests) {
        vm.current_contest(_.where(contests, { contest_id: contest_id })[0]);
    });

    user_model.users.subscribe(function (users) {
        vm.users(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));
    });

    contest_model.contestList.subscribe(function (contests) {
        vm.contest_list(contests);
    });

    user_model.users.subscribe(function (users) {
        vm.users(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));
    });

    //

    vm.update_current_contest = function () {
        $.when(
            user_model.fetchUsers(),
            contest_model.fetchContest(vm.current_contest().contest_id)
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

    ko.applyBindings(vm);

    contest_model.fetchContestList()
        .done(vm.update_current_contest);
});