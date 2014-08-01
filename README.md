AtCorderChecker
===============

　ソフトウェア工房の競技プログラミングプロジェクトで使用されているWebアプリケーションです。  
　各メンバーのAtCoderコンテストの提出状況を確認できます。  
　情報の収集はクローラーを用いています。

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

### �����ݒ�

1. `develop/database_initialize.sql` ��MySQL�Ŏ��s���A�f�[�^�x�[�X���\�z���܂��B
2. `gem install nokogiri ruby-mysql` �����s���A�K�v�ȃ��C�u�������C���X�g�[�����܂��B
3. `develop/config.json` ���̃v���W�F�N�g�̃��[�g�ɃR�s�[���A�p�X���[�h���A�K�v�ɉ����ĕҏW���܂��B
