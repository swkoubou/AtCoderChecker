(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.viewmodel');

    /**
     * 設定ViewModel
     */
    ns.ConfigViewModel = function ConfigViewModel() {
        var that = this;

        // 提出セルに表示する情報
        that.visibleSubmissionCell = {
            status: {
                label: 'ステータス',
                value: ko.observable(true)
            },
            score: {
                label: 'スコア',
                value: ko.observable(true)
            },
            language: {
                label: '言語',
                value: ko.observable(true)
            },
            languageVersion: {
                label: '言語のバージョン',
                value: ko.observable(false)
            }
        };

        // localStorageが使える場合は、オプションを格納する
        if (localStorage) {
            _.chain(that.visibleSubmissionCell).keys().each(function (column) {
                var key = 'config.visibleSubmissionCell.' + column,
                    target = that.visibleSubmissionCell[column].value;

                target(localStorage.getItem(key) !== 'false');

                // 監視
                target.subscribe(function (value) {
                    localStorage.setItem(key, !!value);
                });
            });
        }

        window.hoge = that;

        return that;
    };

}());