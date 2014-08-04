<?php
require_once __DIR__ . "/../model/SubmissionModel.php";
require_once __DIR__ . "/../model/config.php";
require_once __DIR__ . "/../php/util.php";
use util\Http;

if ($_SERVER['REQUEST_METHOD'] === "GET"){
    Http::setTypeJSON();

    // パラメータが間違っていたら throw 400
    if (!array_key_exists('contest_id', $_GET)) {
        http_response_code(400);
        Http::throwErrorJSON('contest_id is required.');
        exit;
    }

    // クライアントに返す連想配列
    $res = [
        "contest_id" => $_GET["contest_id"],
        "problems" => []
    ];

    $m_submission = new SubmissionModel();

    // サブミッションを取得する
    try {
        $m_submission->crawl($_GET['contest_id']);
        $res["problems"] = $m_submission->submissionGet($_GET["contest_id"]);
    } catch (Exception $e) {
        http_response_code(500);
        Http::throwErrorJSON($e->getMessage());
        exit;
    }

    http_response_code(200);
    echo json_encode($res, JSON_PRETTY_PRINT);

} else {
    Http::throwErrorJSON("un supported at method type");
    http_response_code(405);
    exit;
}