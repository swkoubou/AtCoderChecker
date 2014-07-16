$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        view_ns = util.namespace('swkoubou.atcoderchecker.view'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        vm = {
            view: new view_ns.ContestListView()
        };

    vm.contest_list = ko.observableArray();
    vm.current_contest_id = ko.observable();
    vm.current_contest = ko.observable();
    vm.users = ko.observableArray();
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

    user_model.users.subscribe(function (users) {
        vm.users(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));
    });

    //

    vm.decideItem = function (e) {
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
            ko.applyBindings(vm, document.getElementById('container-submission'));
        });

        vm.current_contest(e);
        vm.update_current_contest();
    };

    //

    contest_model.fetchContestList();

    ko.applyBindings(vm, document.getElementById('container-contestlist'));
});