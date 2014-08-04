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

    vm.users = ko.observableArray();
    vm.users_display = ko.observableArray();
    vm.contestList = ko.observableArray();
    vm.currentContest = ko.observable();
    vm.currentContestId = ko.observable();
    vm.submissions = ko.observableArray();
    vm.problems = ko.observable();

    // ユーザリストが更新されたら、整形・ソートして、表示用にVMにぶち込む
    user_model.users.subscribe(function (users) {
        users = users.sort(function (a, b) {
            return a.enrollment_year === b.enrollment_year ? a.name > b.name : a.enrollment_year > b.enrollment_year;
        });

        vm.users_display(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));

        vm.users(users);
    });

    contest_model.contests.subscribe(function (contests) {
        vm.contestList(contests.sort(function (a, b) { return a.url > b.url; }));
    });

    // current_contest_idに追従してcurrent_contestも更新
    vm.currentContestId.subscribe(function (contest_id) {
        vm.currentContest(contest_id ?
            _.where(contest_model.contests(), { contest_id: contest_id })[0] : null);
    });

    /**
     * 現在のコンテストを更新する
     *
     */
    vm.updateCurrentContest = function () {
        if (!vm.currentContestId()) {
            return $.Deferred().reject();
        }

        return $.when(
            // 他の人がユーザリストを更新した可能性もあるため、ユーザリストも一緒に更新する
            user_model.fetchUsers(),
            submission_model.fetchSubmission(vm.currentContestId())
        ).done(function () {
            var fetched_submission = submission_model.lastFetchSubmission(),
                users = _.pluck(user_model.users(), 'user_id'),
                problems = fetched_submission.problems,
                contest = vm.currentContest(),
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
    vm.currentContestId.subscribe(function () {
        vm.updateCurrentContest();
    });

    // ユーザ追加に成功したら、現在のコンテストも更新
    (function (f) {
        add_user_view_model.add = function () {
            return f.apply(this, arguments).then(vm.updateCurrentContest);
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
                        vm.currentContestId(new_contest[0].contest_id);
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
    loading_view_model.wrapDeferredAll(vm, ['updateCurrentContest']);

    //

    contest_model.fetchContests();

    ko.applyBindings(vm);
});