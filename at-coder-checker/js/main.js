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
    vm.usersDisplay = ko.observableArray();
    vm.contestList = ko.observableArray();
    vm.currentContestId = ko.observable();
    vm.submissions = ko.observableArray();
    vm.problems = ko.observable();

    // 現在のコンテスト
    vm.currentContest = ko.computed(function () {
        var contest_id = vm.currentContestId(),  // 購読
            contests = contest_model.contests(); // 購読

        return contest_id ? _.where(contests, { contest_id: contest_id })[0] : null;
    });

    // ユーザリストが更新されたら、整形・ソートして、表示用にVMにぶち込む
    user_model.users.subscribe(function (users) {
        // 入学年度, 名前で昇順にソート
        users = users.sort(function (a, b) {
            return a.enrollment_year === b.enrollment_year ? a.name > b.name : a.enrollment_year > b.enrollment_year;
        });

        // ユーザ表示名の決定
        vm.usersDisplay(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));

        vm.users(users);
    });

    // コンテストリストが更新されたら、URLでソートしてVMにぶち込む
    contest_model.contests.subscribe(function (contests) {
        // URLで昇順にソート
        vm.contestList(contests.sort(function (a, b) { return a.url > b.url; }));
    });

    // 現在のコンテストを更新する
    vm.updateCurrentContest = function () {
        if (!vm.currentContestId()) {
            return $.Deferred().reject();
        }

        return $.when(
            // 他の人がユーザリストを更新した可能性もあるため、ユーザリストも一緒に更新する
            user_model.fetchUsers(),
            submission_model.fetchSubmission(vm.currentContestId())
        ).then(function () {
            var fetched_submission = submission_model.lastFetchSubmission(),
                users = _.pluck(user_model.users(), 'user_id'),
                problems = fetched_submission.problems,
                contest = vm.currentContest(),
                // 表示用にサブミッションリストを整形する
                submissions_ary = _.map(fetched_submission.problems, function (problem) {
                    var submissions = _.indexBy(problem.submissions, 'user_id');

                    return _.object(users, _.map(users, function (user) {
                        var submission = submissions[user];

                        if (!submission) {
                            return null;
                        }

                        // 提出のリンクURLを作成
                        submission.submission_url = contest.url + '/submissions/' + submission.submission_id;

                        return submissions[user];
                    }));
                }),
                // submissions[問題ID][ユーザID] = サブミッションデータ
                submissions = _.object(_.pluck(problems, 'problem_id'), submissions_ary);

            vm.submissions(submissions);

            // 問題のリンクURLを作成
            _.each(problems, function (problem) {
                problem.displayName = problem.assignment + ': ' + problem.name;
                problem.url = contest.url + '/tasks/' + problem.screen_name;
            });

            vm.problems(problems);

            // updated_timeが更新されてるから取得しなおす
            contest_model.fetchContests();
        });
    };

    // 選択しているコンテストが変更されたら、コンテストを更新
    vm.currentContestId.subscribe(function () {
        vm.updateCurrentContest();
    });

    // ユーザ追加に成功したら、現在のコンテストを更新
    (function (f) {
        add_user_view_model.add = function () {
            return f.apply(this, arguments).then(vm.updateCurrentContest);
        };
    }(add_user_view_model.add));

    // コンテスト追加に成功したら、コンテストリストを更新して、そのコンテストを選択状態にする
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

    /*** ローディングの設定 ***/
    loading_view_model.wrapDeferredAll(add_user_view_model, ['add']);
    loading_view_model.wrapDeferredAll(add_contest_view_model, ['add']);
    loading_view_model.wrapDeferredAll(vm, ['updateCurrentContest']);
    /*** /ローディングの設定 ***/

    /***** 以下初期動作 *****/

    loading_view_model.isLoading(true);
    contest_model.fetchContests().always(function () {
        loading_view_model.isLoading(false);
    });

    ko.applyBindings(vm);
});