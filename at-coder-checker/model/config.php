<?php
namespace atcoderchecker;
require_once __DIR__ . "/BaseModel.php";

/**
 * Config Defined
 * コンフィグ定義
 */
class Config {
    public static $configFile;
    public static $config;
    public static $proxyContent;
};

Config::$configFile = __DIR__ . '/../../config.json';
Config::$config  = json_decode(file_get_contents(Config::$configFile), true);
Config::$proxyContent = isset(Config::$config['proxy']) ? stream_context_create([
    'http' => [
        'proxy' => Config::$config['proxy'],
        'request_fulluri' => true,
    ]
]) : null;

/**
 * データベースの設定
 */
$config = json_decode(file_get_contents(__DIR__ . '/../../config.json'), true);

\BaseModel::setConnectionInfo($config['mysql']);
