<?php
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/config.php";
use atcoderchecker\Config;

class ContestModel extends BaseModel {
    const TBNAME = "contest";

    public function contestGet() {
        try {
            $stmt = $this->selects(self::TBNAME);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        return $stmt->fetchAll();
    }

    public function contestPost($url) {
        exec("ruby " . Config::$crawlerPath . " $url", $out, $res);

        if ($res) {
            throw new Exception('ruby script error');
        }
    }

}