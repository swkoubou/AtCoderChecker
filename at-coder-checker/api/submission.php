<?php
require_once __DIR__ . "/../model/SubmissionModel.php";
require_once __DIR__ . "/../model/ContestModel.php";
require_once __DIR__ . "/../model/config.php";
require_once __DIR__ . "/../php/util.php";
use util\Http;

if ($_SERVER['REQUEST_METHOD'] === "GET"){
    /**
     *
     */

    try {
        Http::setTypeJSON();

        $m_submission = new SubmissionModel();
        $m_contest = new ContestModel();

        // contests_idの絞り込み
        $contest_ids = [];
        if (array_key_exists('contest_id', $_GET)) {
            $contest_ids[] = $_GET["contest_id"];
        } else {
            $contests = $m_contest->contestGet();
            foreach ($contests as $contest) {
                $contest_ids[] = $contest['contest_id'];
            }
        }

        // サブミッションを取得する
        $res = [
            'submissions' => []
        ];
        foreach ($contest_ids as $contest_id) {
//            $m_submission->crawl($contest_id);
            $problems = $m_submission->submissionGet($contest_id);

            $res['submissions'][] = [
                'contest_id' => $contest_id,
                'problems' => $problems
            ];
        }

        http_response_code(200);
        echo json_encode($res, JSON_NUMERIC_CHECK);
        exit;

    } catch (Exception $e) {
        http_response_code(500);
        Http::throwErrorJSON($e->getMessage());
        exit;
    }

} else {
    Http::throwErrorJSON("un supported at method type");
    http_response_code(405);
    exit;
}