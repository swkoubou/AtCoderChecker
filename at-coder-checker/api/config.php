<?php
require_once __DIR__ . "/../Model/BaseModel.php";
/**
 * Config Defined
 * コンフィグ定義
 */
//namespace rms;
//require_once __DIR__ . "/model/BaseModel.php";

/**
 * Class Config
 * @package mcr
 */

/**
 * データベースの設定
 */
$connInfo = [
    "host" => "localhost",
    "dbname" => "atcoder_checker_db",
    "dbuser" => "root",
    "password" => "sakuratree"
];
\BaseModel::setConnectionInfo($connInfo);
