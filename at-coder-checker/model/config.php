<?php
namespace atcoderchecker;
require_once __DIR__ . "/BaseModel.php";

/**
 * Config Defined
 * コンフィグ定義
 */

class Config { }

/**
 * データベースの設定
 */
$config = json_decode(file_get_contents(__DIR__ . '/../../config.json'), true);

\BaseModel::setConnectionInfo($config['mysql']);
