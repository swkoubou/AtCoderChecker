<?php
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/config.php";
use atcoderchecker\Config;

class CrawlerModel extends BaseModel {
    // クローラの最小待機時間
    const CRAWL_INTERVAL_SECOND = 600;

    public static $crawlerPath;
    public static $crawlerLogPath;
    public static $crawlerErrorLogPath;

    public function __construct() {
        parent::__construct();

        self::$crawlerPath = __DIR__ . '/../../crawler/scraper.rb';
        self::$crawlerLogPath = __DIR__ . '/../../crawler/scraper_log.txt';
        self::$crawlerErrorLogPath = __DIR__ . '/../../crawler/scraper_error_log.txt';
    }

    public function crawl($url) {
        $now = date("Y-m-d H:i:s");
        exec("echo 'start: $now' 1>>" . self::$crawlerLogPath);
        exec("echo 'start: $now' 2>>" . self::$crawlerLogPath);

        $cmd = Config::$config['proxy'] ? 'export http_proxy=http://' . Config::$config['proxy'] . ';' : '';
        $cmd .= "ruby " . self::$crawlerPath . " $url 1>>" . self::$crawlerLogPath . " 2>>" . self::$crawlerErrorLogPath;
        exec($cmd, $out, $res);

        if ($res) {
            throw new Exception('ruby script error');
        }
    }

}
