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
    vm.contestList = contest_model.contests;
    vm.currentContestId = ko.observable();

    // 表示する全ての提出と問題、コンテスト
    vm.viewAllSubmissions = ko.observable({});
    vm.viewAllProblems = ko.observable({});
    vm.viewAllContestIds = ko.observableArray();

    // 現在のコンテスト
    vm.currentContest = ko.computed(function () {
        var contest_id = vm.currentContestId(),  // 購読
            contests = contest_model.contests(); // 購読

        return contest_id ? _.where(contests, { contest_id: contest_id })[0] : null;
    });

    // ユーザリストが更新されたら、整形・ソートして、表示用にVMにぶち込む
    user_model.users.subscribe(function (users) {
        var contest = vm.currentContest();

        // 入学年度, 名前で昇順にソート
        users = users.sort(function (a, b) {
            return (a.enrollment_year === b.enrollment_year ? a.name > b.name : a.enrollment_year > b.enrollment_year) ? 1 : -1;
        });

        users.forEach(function (user) {
            // ユーザ表示名の決定
            user.displayName = user.name + '<br>(' + user.user_id + ')';

            // ユーザ毎の提出リンクを作成
            user.submissionUrl = contest ? contest.url + 'submissions/all?user_screen_name=' + user.user_id : null;
        });

        vm.users(users);
    });

    // 現在のコンテストを更新する
    vm.updateCurrentContest = function () {
        var current_contest_id = vm.currentContestId();
        vm.viewAllContestIds.removeAll();

        return $.when(
            // 他の人がユーザリストを更新した可能性もあるため、ユーザリストも一緒に更新する
            user_model.fetchUsers(),
            submission_model.fetchSubmission(current_contest_id)
        ).then(function () {
            var submissions_ary, problems, contest, targets,
                submissions = {},
                all_submissions = {},
                all_problems = {},
                contest_list = vm.contestList(),
                users = _.pluck(user_model.users(), 'user_id');

            targets = (current_contest_id === null || current_contest_id === undefined) ?
                //submission_model.submissions() :
                submission_model.submissions().sort(function (a, b) {
                    var contest_a = _.where(contest_list, { contest_id: a.contest_id })[0],
                        contest_b = _.where(contest_list, { contest_id: b.contest_id })[0];
                    return contest_a.url < contest_b.url ? -1 : 1;
                }) :
                [submission_model.lastFetchSubmission()];

            _.each(targets, function (target_submission) {
                problems = target_submission.problems;
                contest = _.where(contest_list, { contest_id: target_submission.contest_id })[0];

                // 表示用にサブミッションリストを整形する
                submissions_ary = _.map(target_submission.problems, function (problem) {
                    return _.object(users, _.map(users, function (user) {
                        var a_submission,
                            user_submission = _.where(problem.submissions, { user_id: user });

                        if (!user_submission.length) { return null; }


                        // 最もスコアが高く、最も最後に提出したものを表示用にする
                        a_submission = user_submission.sort(function (a, b) {
                            return (a.score !== b.score ? a.score < b.score : a.submission_id < b.submission_id) ? 1 : -1;
                        })[0];

                        // 提出のリンクURLを作成
                        a_submission.submission_url = contest.url + '/submissions/' + a_submission.submission_id;

                        // 表示用lにlanguageの加工
                        a_submission.language = a_submission.language.replace(/\(.*\)/, '');

                        return a_submission;
                    }));
                });

                // submissions[問題ID][ユーザID] = サブミッションデータ
                submissions = _.object(_.pluck(problems, 'problem_id'), submissions_ary);
                all_submissions[target_submission.contest_id] = submissions;

                // 問題のリンクURLと表示名の作成
                _.each(problems, function (problem) {
                    problem.displayName = problem.assignment + ': ' + problem.name;
                    problem.url = contest.url + '/tasks/' + problem.screen_name;
                });
                all_problems[target_submission.contest_id] = problems;

                if (problems.length) {
                    problems[0].isFirst = true;
                }
            });

            vm.viewAllSubmissions(all_submissions);
            vm.viewAllProblems(all_problems);
            vm.viewAllContestIds(_.pluck(targets, 'contest_id'));

        }).then(contest_model.fetchContests); // updated_timeが更新されてるから取得しなおす;
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
    contest_model.fetchContests()
        .then(function () {
            vm.updateCurrentContest();
        })
        .always(function () {
            loading_view_model.isLoading(false);
        });

    ko.applyBindings(vm);
});