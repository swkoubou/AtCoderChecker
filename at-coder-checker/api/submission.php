<?php
require_once __DIR__ . "/../model/SubmissionModel.php";
require_once __DIR__ . "/../model/config.php";

if ($_SERVER['REQUEST_METHOD'] === "GET"){
    header("Content-type: text/json; charset=utf-8");

    // パラメータが間違っていたら throw 400
    if (!array_key_exists('contest_id', $_GET)) {
        http_response_code(400);
        echo json_encode(["message" => "contest_id is required."]);
        exit;
    }

    // クライアントに返す連想配列
    $res = [
        "contest_id" => $_GET["contest_id"],
        "problems" => []
    ];

    $m_submission = new SubmissionModel();

    // 一定時間経っていたら、クローラを回してDBを更新する
    

    // サブミッションを取得する
    try {
        $res["problems"] = $m_submission->submissionGet($_GET["contest_id"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => $e->getMessage()]);
        exit;
    }

    echo json_encode($res, JSON_PRETTY_PRINT);
    http_response_code(200);
} else {
    // GET以外のメソッドの場合は405
    http_response_code(405);
}