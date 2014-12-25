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
        user_view_model = new viewmodel_ns.UserViewModel(user_model),
        config_view_model = new viewmodel_ns.ConfigViewModel(),
        vm = {
            alert: alert_view_model,
            loading: loading_view_model,
            addUser: add_user_view_model,
            addContest: add_contest_view_model,
            config: config_view_model
        };

    vm.users = user_view_model.users;
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

    // コンテストが変更されたら、ユーザ毎の提出リンクを再作成
    vm.currentContest.subscribe(function (current_contest) {
        var users = vm.users();

        users.forEach(function (user) {
            user.submissionUrl(current_contest ? current_contest.url + 'submissions/all?user_screen_name=' + user.user_id : null);
        });

        vm.users(users);
    });

    // 現在のコンテストを更新する
    vm.updateCurrentContest = function () {
        var current_contest_id = vm.currentContestId();

        // リセット 描画を抑制する
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
                user_ids = _.pluck(user_model.users(), 'user_id'),
                users = vm.users(),
                is_all = current_contest_id === null || current_contest_id === undefined;

            // ACカウントのリセット
            _.each(users, function (user) {
                user.acceptNum(0);
            });

            targets = is_all ?
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
                    return _.object(user_ids, _.map(user_ids, function (user_id) {
                        var a_submission,
                            user_submission = _.where(problem.submissions, { user_id: user_id }),
                            user = _.where(users, { user_id: user_id })[0];

                        if (!user_submission.length) { return null; }

                        // 最もスコアが高く、最も最後に提出したものを表示用にする
                        a_submission = user_submission.sort(function (a, b) {
                            return (a.score !== b.score ? a.score < b.score : a.submission_id < b.submission_id) ? 1 : -1;
                        })[0];

                        // 提出のリンクURLを作成
                        a_submission.submission_url = contest.url + '/submissions/' + a_submission.submission_id;

                        // 表示用lにlanguageの加工
                        a_submission.languageVersion = a_submission.language.replace(/(.*)(\(.*\))(.*)/, '$2');
                        a_submission.language = a_submission.language.replace(/\(.*\)/, '');

                        // AC数をカウント
                        if (a_submission.status === 'AC') {
                            user.acceptNum(user.acceptNum() + 1);
                        }

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

            // AC数降順、入学年度昇順, 名前昇順で昇順にソート
            users = users.sort(function (a, b) {
                if (a.acceptNum() !== b.acceptNum()) { return (a.acceptNum() < b.acceptNum()) ? 1 : -1; }
                if (a.enrollment_year !== b.enrollment_year) { return (a.enrollment_year > b.enrollment_year) ? 1 : -1; }
                return (a.name > b.name) ? 1 : -1;
            });

            vm.users(users);
            vm.viewAllSubmissions(all_submissions);
            vm.viewAllProblems(all_problems);
            vm.viewAllContestIds(_.pluck(targets, 'contest_id'));

            // レイアウト修正
            $('.scroll-div table').attr('_fixedhead', 'rows:1; cols:' + (is_all ? 2 : 1));
            FixedMidashi.create();
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

    // 全ユーザの可視状態変更用の変数
    vm.allUserVisible = ko.computed({
        read: function () {
            return _.every(vm.users(), function (user) { return user.visible(); });
        },
        write: function (value) {
            _.each(vm.users(), function (user) { user.visible(value); });
        }
    });

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