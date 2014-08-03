$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        submission_model = new model_ns.SubmissionModel(),
        vm = { };

    vm.users = user_model.users;
    vm.users_display = ko.observableArray();
    vm.contest_list = ko.observableArray();
    vm.current_contest_id = ko.observable();
    vm.submissions = ko.observableArray();
    vm.problems = ko.observable();

    user_model.users.subscribe(function (users) {
        vm.users_display(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));
    });

    contest_model.contests.subscribe(function (contests) {
        vm.contest_list(contests);
    });

    /**
     * 現在のコンテストを更新する
     *
     */
    vm.update_current_contest = function () {
        if (!vm.current_contest_id()) {
            return;
        }

        $.when(
            // 他の人がユーザリストを更新した可能性もあるため、ユーザリストも一緒に更新する
            user_model.fetchUsers(),
            submission_model.fetchSubmission(vm.current_contest_id())
        ).done(function () {
            var contest = submission_model.lastFetchSubmission(),
                users = _.pluck(user_model.users(), 'user_id'),
                problems = contest.problems,
                // 表示用にサブミッションリストを整形する。
                submissions_ary = _.map(contest.problems, function (problem) {
                    var submissions = _.indexBy(problem.submissions, 'user_id');

                    return _.object(users, _.map(users, function (user) {
                        return submissions[user] ? submissions[user] : null;
                    }));
                }),
                // submissions[問題ID][ユーザID] = サブミッションデータ
                submissions = _.object(_.pluck(problems, 'problem_id'), submissions_ary);

            vm.submissions(submissions);
            vm.problems(problems);
        });
    };

    //

    contest_model.fetchContests();

    ko.applyBindings(vm);

    //

//    setTimeout(function () {
//        vm.current_contest_id(1);
//        vm.update_current_contest();
//    }, 100);

});