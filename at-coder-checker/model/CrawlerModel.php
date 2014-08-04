<?php
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/config.php";

class CrawlerModel extends BaseModel {
    // クローラの最小待機時間
    const CRAWL_INTERVAL_SECOND = 600;

    public static $crawlerPath;
    public static $crawlerLogPath;
    public static $crawlerErrorLogPath;

    public function __construct() {
        parent::__construct();

        self::$crawlerPath = __DIR__ . '/../../crawler/scraper.rb';
        self::$crawlerLogPath = __DIR__ . '/../../crawler/scrapper_log.txt';
        self::$crawlerErrorLogPath = __DIR__ . '/../../crawler/scrapper_error_log.txt';
    }

    public function crawl($url) {
        $cmd = "ruby " . self::$crawlerPath . " $url 1>" . self::$crawlerLogPath . " 2>" . self::$crawlerErrorLogPath;
        exec($cmd, $out, $res);

        if ($res) {
            $this->db->rollback();
            throw new Exception('ruby script error');
        }
    }

}