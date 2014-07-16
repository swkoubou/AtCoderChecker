$(function () {
    'use strict';

    var model_ns = util.namespace('swkoubou.atcoderchecker.model'),
        view_ns = util.namespace('swkoubou.atcoderchecker.view'),
        viewmodel_ns = util.namespace('swkoubou.atcoderchecker.viewmodel'),
        user_model = new model_ns.UserModel(),
        contest_model = new model_ns.ContestModel(),
        vm = _.extend(new viewmodel_ns.HogeViewModel({
            user_model: user_model,
            contest_model: contest_model
        }), {
            view: new view_ns.ContestListView()
        });

    //

    contest_model.fetchContestList();

    ko.applyBindings(vm, document.getElementById('container-contestlist'));
});