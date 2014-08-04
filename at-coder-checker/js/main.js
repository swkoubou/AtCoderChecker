$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        viewmodel_ns = util.namespace('swkoubou.atcoderchecker.viewmodel'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        submission_model = new model_ns.SubmissionModel(),
        add_user_view_model = new viewmodel_ns.AddUserViewModel(user_model),
        add_contest_view_model = new viewmodel_ns.AddContestViewModel(contest_model),
        alert_view_model = new viewmodel_ns.AlertViewModel(),
        loading_view_model = new viewmodel_ns.LoadingViewModel(),
        vm = {
            alert: alert_view_model,
            loading: loading_view_model,
            addUser: add_user_view_model,
            addContest: add_contest_view_model
        };

    vm.users = user_model.users;
    vm.users_display = ko.observableArray();
    vm.contest_list = ko.observableArray();
    vm.current_contest = ko.observable();
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

    // current_contest_idに追従してcurrent_contestも更新
    vm.current_contest_id.subscribe(function (contest_id) {
        vm.current_contest(contest_id ?
            _.where(contest_model.contests(), { contest_id: contest_id })[0] : null);
    });

    /**
     * 現在のコンテストを更新する
     *
     */
    vm.update_current_contest = function () {
        if (!vm.current_contest_id()) {
            return $.Deferred().reject();
        }

        return $.when(
            // 他の人がユーザリストを更新した可能性もあるため、ユーザリストも一緒に更新する
            user_model.fetchUsers(),
            submission_model.fetchSubmission(vm.current_contest_id())
        ).done(function () {
            var fetched_submission = submission_model.lastFetchSubmission(),
                users = _.pluck(user_model.users(), 'user_id'),
                problems = fetched_submission.problems,
                contest = vm.current_contest(),
                // 表示用にサブミッションリストを整形する。
                submissions_ary = _.map(fetched_submission.problems, function (problem) {
                    var submissions = _.indexBy(problem.submissions, 'user_id');

                    return _.object(users, _.map(users, function (user) {
                        var submission = submissions[user];
                        if (!submission) {
                            return null;
                        }

                        submission.submission_url = contest.url + '/submissions/' + submission.submission_id;

                        return submissions[user];
                    }));
                }),
                // submissions[問題ID][ユーザID] = サブミッションデータ
                submissions = _.object(_.pluck(problems, 'problem_id'), submissions_ary);

            vm.submissions(submissions);
            vm.problems(problems);
        });
    };

    // 選択しているコンテストが変更されたら、コンテストを更新
    vm.current_contest_id.subscribe(function () {
        vm.update_current_contest();
    });

    // ユーザ追加に成功したら、現在のコンテストも更新
    (function (f) {
        add_user_view_model.add = function () {
            return f.apply(this, arguments).then(vm.update_current_contest);
        };
    }(add_user_view_model.add));

    // コンテスト追加に成功したら、コンテストリストを更新して、そのコンテストに変える
    (function (f) {
        add_contest_view_model.add = function () {
            var url = add_contest_view_model.url();

            return f.apply(this, arguments)
                .then(contest_model.fetchContests)
                .then(function () {
                    var contests = contest_model.contests(),
                        new_contest = _.where(contests, { url:  url });

                    if (new_contest.length) {
                        vm.current_contest_id(new_contest[0].contest_id);
                    }
                });
        };
    }(add_contest_view_model.add));

    /*** アラートの設定 ***/
    alert_view_model.wrapDeferredAll(add_user_view_model, [{
        methodName: 'add',
        successMessage: 'ユーザ登録成功！',
        errorMessage: 'ユーザ登録失敗。'
    }]);

    alert_view_model.wrapDeferredAll(add_contest_view_model, [{
        methodName: 'add',
        successMessage: 'コンテスト登録成功！',
        errorMessage: 'コンテスト登録失敗。'
    }]);
    /*** /アラートの設定 ***/

    // ローディングの設定
    loading_view_model.wrapDeferredAll(add_user_view_model, ['add']);
    loading_view_model.wrapDeferredAll(add_contest_view_model, ['add']);
    loading_view_model.wrapDeferredAll(vm, ['update_current_contest']);

    //

    contest_model.fetchContests();

    ko.applyBindings(vm);

    setTimeout(function () { vm.current_contest_id(13); }, 1000);
});