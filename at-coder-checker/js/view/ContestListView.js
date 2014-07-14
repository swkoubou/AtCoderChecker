(function () {
    'use strict';

    var ns = util.namespace('swkoubou.atcoderchecker.view');

    ns.ContestListView = function ContestListView() {
        var that = this;

        that.width = 1000;
        that.height = 1000;
        that.topMergin = 100;
        that.leftMergin = 100;

        that.r = 100;
        that.mergin = 20;
        that.fontSize = 20;
        that.mouseoverR = 120;

        that.items = [];

        that.addItem = function (e, index, data) {
            if (e.nodeType === 3) {
                return;
            }

            var item = { e: e, index: index, data: data };
            that.items.push(item);

            setTimeout(function () {
                var duration = 500 + Math.random() * 500,
                    x1 = Math.random() * that.width * 1.5,
                    y1 = Math.random() * that.height * 1.5,
                    x2 = index % 10 * that.r + (index % 10 + 1) * that.mergin + that.leftMergin,
                    y2 = Math.floor(index / 10) * that.r + (Math.floor(index / 10) + 1) * that.mergin + that.topMergin;

                $(e)
                    // 円の初期化
                    .css('left', x1)
                    .css('top', y1)
                    .animate({
                        width: that.r,
                        height: that.r,
                        backgroundColor: '#245269',
                        left: x2,
                        top: y2
                    }, duration, 'easeInOutCubic')

                    // 文字列の初期化
                    .children('.contest-name')
                    .css('left', x1)
                    .css('top', y1)
                    .css('paddingTop', that.r / 2)
                    .css('paddingBottom', that.r / 2)
                    .animate({
                        left: x2,
                        top: y2,
                        fontSize: that.fontSize,
                        paddingTop: that.r / 2 - that.fontSize / 2,
                        paddingBottom: that.r / 2 - that.fontSize / 2
                    }, duration, 'easeInOutCubic')
                    .end()

                    // マウスイベント追加
                    .mouseover(function () {
                        $(this)
                            .animate({
                                left: x2 - (that.mouseoverR - that.r) / 2,
                                top: y2 - (that.mouseoverR - that.r) / 2,
                                width: that.mouseoverR,
                                height: that.mouseoverR
                            }, { duration: 500, easing: 'easeOutCubic' })
                            .dequeue()
                            .children('.contest-name')
                            .animate({
                                paddingTop: that.mouseoverR / 2 - that.fontSize / 2,
                                paddingBottom: that.mouseoverR / 2 - that.fontSize / 2
                            }, { duration: 500, easing: 'easeOutCubic' })
                            .dequeue();
                    })
                    .mouseleave(function () {
                        $(this)
                            .animate({
                                left: x2,
                                top: y2,
                                width: that.r,
                                height: that.r
                            }, { duration: 500, easing: 'easeOutCubic' })
                            .dequeue()
                            .children('.contest-name')
                            .animate({
                                paddingTop: that.r / 2 - that.fontSize / 2,
                                paddingBottom: that.r / 2 - that.fontSize / 2
                            }, { duration: 500, easing: 'easeOutCubic' })
                            .dequeue();
                    })
                    .click(function () {
                        that.decide(item);
                    });
            }, Math.random() * 500);
        };

        that.decide = function (decide_item) {
            var r = Math.max(that.width, that.height, 4000),
                color = $(decide_item.e).css('backgroundColor');

            // 誤動作しないように、イベントはすべて無効に
            _.each(that.items, function (item) {
                $(item.e).unbind();
            });

            // 決定されたもの以外は中央に就職して消滅
            _.each(that.items, function (item) {
                if (item !== decide_item) {
                    $(item.e)
                        .animate({
                            left: that.width / 2,
                            top: that.width / 2,
                            width: 0,
                            height: 0
                        }, 800, 'easeInOutCubic')
                        .children('.contest-name')
                        .animate({
                            fontSize: 0
                        }, 500, 'easeInOutCubic');
                }
            });

            // 決定されたものは広がる。
            // 左上に文字列を固定化
            $(decide_item.e)
                .css('backgroundColor', color)
                .css('zIndex', -1)
                .animate({
                    left: that.width / 2 - r / 2,
                    top: that.height / 2 - r / 2,
                    width: r,
                    height: r
                }, 800, 'easeInOutCubic', function () {
                    $('body').css('backgroundColor', color);
                    _.each(that.items, function (item) {
                        $(item.e).remove();
                    });
                    that.items.splice(0, that.items.length);
                })
                .children('.contest-name')
                .css('position', 'fixed')
                .animate({
                    margin: 0,
                    padding: 0,
                    left: 4,
                    top: 4
                }, 800, 'easeInOutCubic', function () {
                    $('<p>' + decide_item.data.name + '</p>')
                        .addClass('contest-title')
                        .css({
                            position: 'fixed',
                            padding: 0,
                            margin: 0,
                            top: 4,
                            left: 4,
                            fontSize: that.fontSize
                        })
                        .appendTo('body');
                });
        };

        return that;
    };

}());