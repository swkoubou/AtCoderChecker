<?php
namespace atcoderchecker;
require_once __DIR__ . "/BaseModel.php";

/**
 * Config Defined
 * コンフィグ定義
 */

class Config {
    // クローラの最小待機時間
    const CRAWL_INTERVAL_SECOND = 600;

    public static $crawlerPath;
}

Config::$crawlerPath = __DIR__ . '/../../crawler/scraper.rb';

/**
 * データベースの設定
 */
$config = json_decode(file_get_contents(__DIR__ . '/../../config.json'), true);

\BaseModel::setConnectionInfo($config['mysql']);
