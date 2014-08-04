AtCorderChecker
===============

　ソフトウェア工房の競技プログラミングプロジェクトで使用されているWebアプリケーションです。  
　各メンバーのAtCoderコンテストの提出状況を確認できます。  
　情報の収集はクローラーを走らせてHTMLを解析しています。  
　現在システムは `http://202.250.66.29/at-coder-checker/` に置いてあります。

Development
-----------
#### 開発フローについて
　初期段階ではそれぞれ勝手にmaster以外のブランチで作業し、masterにマージしてpushでいいかと思います。  
　安定してきたらgithub-flowに移行します。

#### 各フォルダについて
　ルート直下のそれぞれのフォルダは下記のような役割となっています。  

- `develop`: 開発者用ディレクトリです。初期化用sqlや開発メモ等を格納します。
- `crawler`: クローラプログラム用のディレクトリです。Rubyで開発します。
- `at-corder-checker`: Webで公開するディレクトリです。実サーバではここにシンボリックリンクを張ります。PHP, HTML/CSS, JavaScript で開発します。

#### 初期設定

1. `develop/database_initialize.sql` をMySQLで実行し、データベースを構築します。
2. `gem install nokogiri ruby-mysql` を実行し、必要なライブラリをインストールします。
3. `develop/config.json` をこのプロジェクトのルートにコピーし、パスワード等、必要に応じて編集します。

##### masterにmergeしたら、自動的にデブロイされます。
