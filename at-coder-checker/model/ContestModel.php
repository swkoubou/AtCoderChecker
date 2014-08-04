<?php
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/CrawlerModel.php";

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
        $crawler_model = new CrawlerModel();

        try {
            $crawler_model->crawl($url);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function getContest($contest_id) {
        try {
            $stmt = $this->select(self::TBNAME, ['contest_id' => $contest_id]);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}