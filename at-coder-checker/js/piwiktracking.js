(function () {
    'use strict';

    $(function () {
        var buttons = [
            '#open-modal-add-user',
            '#open-modal-add-contest',
            '#open-modal-config'
        ];
        buttons.forEach(function (button) {
            $(button).click(function () {
                _paq.push(['trackEvent', 'Button', button]);
            });
        });
    });
}());