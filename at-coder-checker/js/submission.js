$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        view_ns = util.namespace('swkoubou.atcoderchecker.view'),
        viewmodel_ns = util.namespace('swkoubou.atcoderchecker.viewmodel'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        qry = util.parseGetQuery(window.location.search),
        contest_id = Number(qry.contest_id),
        vm = _.extend(new viewmodel_ns.HogeViewModel({
            user_model: user_model,
            contest_model: contest_model
        }), {
            view: new view_ns.ContestListView()
        });

    contest_model.contestList.subscribe(function (contests) {
        vm.current_contest(_.where(contests, { contest_id: contest_id })[0]);
    });

    //

    contest_model.fetchContestList()
        .done(vm.update_current_contest);

    ko.applyBindings(vm, document.getElementById('container-submission'));
});