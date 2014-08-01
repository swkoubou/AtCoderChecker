<?php
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/config.php";

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
        // 時間見る
        return true;
    }

    public function crawl($contest_id) {
        // トランザクション begin

        // 時間を見て

        // クロールする

        // トランザクション commit

        return true;
    }
}