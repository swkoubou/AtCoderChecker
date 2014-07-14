$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        view_ns = util.namespace('swkoubou.atcoderchecker.view'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        vm = new view_ns.ContestListView();

    vm.contest_list = ko.observableArray();
    vm.current_contest_id = ko.observable();

    user_model.users.subscribe(function (users) {
        vm.users(users.map(function (user) {
            return user.name + '(' + user.user_id + ')';
        }));
    });

    contest_model.contestList.subscribe(function (contests) {
        vm.contest_list(contests);
    });

    //

    contest_model.fetchContestList();

    ko.applyBindings(vm);
});