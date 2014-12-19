<?php
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/ContestModel.php";
require_once __DIR__ . "/CrawlerModel.php";

class SubmissionModel extends BaseModel{
    public function submissionGet($contest_id){
        // problemを全て取得する
        try {
            $stmt = $this->select("problem", ["contest_id" => $contest_id]);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        $problems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 各problemに対して、該当するsubmissionを取得して格納する
        foreach ($problems as &$problem) {
            try {
                $stmt = $this->select("submission", ["problem_id" => $problem["problem_id"]]);
            } catch (Exception $e) {
                throw new Exception($e);
            }

            $problem["submissions"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return $problems;
    }

    public function needCrawl($contest_id) {
        $contest_model = new ContestModel();

        try {
            $contest = $contest_model->getContest($contest_id);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        $date = date("Y-m-d H:i:s", strtotime("- " . CrawlerModel::CRAWL_INTERVAL_SECOND . "seconds"));

        return $contest['updated_at'] < $date;
    }

    public function crawl($contest_id) {
        $contest_model = new ContestModel();

        try {
            $contest = $contest_model->getContest($contest_id);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        // トランザクション
        $this->db->beginTransaction();

        try {
            // クロールする
            $crawler_model = new CrawlerModel();

            // 更新の必要がなかったら終了
            if (!$this->needCrawl($contest_id)) {
                $this->db->rollback();
                return false;
            };

            $crawler_model->crawl($contest['url']);

            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception($e);
        }
        // /トランザクション

        return true;
    }
}