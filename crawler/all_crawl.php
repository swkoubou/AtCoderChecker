<?php
/**
 * 全てのコンテストをクロールする
 * 各コンテストのクロール間隔に30秒～1分開ける
 */

require_once __DIR__ . "/../at-coder-checker/model/SubmissionModel.php";
require_once __DIR__ . "/../at-coder-checker/model/ContestModel.php";
require_once __DIR__ . "/../at-coder-checker/model/config.php";

$m_submission = new SubmissionModel();
$m_contest = new ContestModel();

try {
    $contest_list = $m_contest->contestGet();

    // 全てのコンテストを順にクロールしていく
    foreach ($contest_list as $contest) {
        $label = $contest['contest_id'].' '.$contest['name'];
        $id = $contest['contest_id'];

        $now = date("Y-m-d H:i:s");
        echo "crawl start $now: $label\n";

        try {
            $is_crawled = $m_submission->crawl($id);

            $now = date("Y-m-d H:i:s");
            if ($is_crawled) {
                // クロール成功時は一定時間待つ
                echo "completed crawled $now: $label\n";
                $sleep_time = rand(5, 10);
                echo "sleep $sleep_time seconds\n";
                sleep($sleep_time);
            } else {
                // 前回クロール時からさほど時間が経っていない場合などでクロール出来ない場合
                echo "doesn't need crawling $now: $label\n";
            }
        } catch (Exception $e) {
            $now = date("Y-m-d H:i:s");
            echo "error ".$e->getMessage()." $now: $label\n";
        }
    }
} catch (Exception $e) {
    echo $e->getMessage();
    exit(1);
}