(function () {
    'use strict';

    /**
     * ユーティリティモジュール
     *
     * @type {{namespace: namespace, parseGetQuery: parseGetQuery, initArray: initArray}|*}
     */
    window.util = window.util || {
        /**
         * 名前空間解決関数
         * ドット区切りの名前空間を与えると、その名前空間を生成また取得して返す。
         * @param ns_string
         * @returns {window|*}
         */
        namespace: function (ns_string) {
            var parts = ns_string.split('.'),
                parent = window,
                i;

            for (i = 0; i < parts.length; i++) {
                if (parent[parts[i]] === undefined) {
                    parent[parts[i]] = {};
                }
                parent = parent[parts[i]];
            }

            return parent;
        },

        /**
         * HTTP.GETクエリーのパーサー
         *
         * @param query ?から始まるパースする文字列(e.g. window.location.search)
         * @returns {Object}
         */
        parseGetQuery: function (query) {
            var result = {},
                qry,
                params,
                element,
                i;

            if (1 < query.length) {
                qry = query.substring(1);
                params = qry.split('&');

                for (i = 0; i < params.length; i++) {
                    element = params[i].split('=');
                    result[decodeURIComponent(element[0])] = decodeURIComponent(element[1]);
                }
            }

            return result;
        },

        /**
         * 多次元配列の初期化
         *
         * @param ns
         * @param init
         * @returns {Array}
         */
        initArray: function (ns, init) {
            var x = ns[0],
                xs = _.rest(ns),
                ary = [x],
                i;

            for (i = 0; i < x; i++) {
                ary[i] = xs.length > 0 ? this.initArray(xs, init) : init ? init() : [];
            }

            return ary;
        },

        /**
         * 指定したファイル名またはパスの絶対パスを返す。
         * htmlのscriptタグを読み込んでいるため、指定したファイル名またはパスはscriptタグで
         * 読み込まれていなければならない。
         *
         * @param current ファイル名またはパス
         * @returns {string}
         */
        getDirectPath: function (current) {
            var root,
                scripts = document.getElementsByTagName('script'),
                i = scripts.length,
                match;
            while (i--) {
                match = scripts[i].src.match(new RegExp('(^|.*\\/)' + current + '$'));
                if (match) {
                    root = match[1];
                    break;
                }
            }
            if (!root) {
                throw new ReferenceError('arguments 1 must be current file name or path');
            }
            return root;
        },

        /**
         * 正規表現リスト
         */
        pattern: {
            email: /^[a-z0-9\!#\$\%\&\'\*\+\/=\?\^\_\`{\|}~\.\-]+@[a-z0-9]+(\.[a-z0-9]+)*$/
        }
    };
}());