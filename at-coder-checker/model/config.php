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
}

/**
 * データベースの設定
 */
$connInfo = [
    "host" => "localhost",
    "dbname" => "atcoder_checker_db",
    "dbuser" => "root",
    "password" => "giqrc34n"
];
\BaseModel::setConnectionInfo($connInfo);
