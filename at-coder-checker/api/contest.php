<?php
require_once __DIR__ . "/../model/ContestModel.php";
require_once __DIR__ . "/../model/config.php";
require_once __DIR__ . "/../php/util.php";
use util\Http;

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    Http::setTypeJSON();

    $contest_model = new ContestModel();

    try {
        $res = $contest_model->contestGet();
    } catch (Exception $e) {
        http_response_code(500);
        Http::throwErrorJSON($e->getMessage());
        exit;
    }

    http_response_code(200);
    echo json_encode($res);

} else if ($_SERVER['REQUEST_METHOD'] === "POST") {
    Http::setTypeJSON();

    $contest_model = new ContestModel();

    // パラメータチェック
    if (!isset($_POST['url'])) {
        http_response_code(400);
        Http::throwErrorJSON('required params: url');
        exit;
    }

    try {
        $contest_model->contestPost($_POST['url']);
    } catch (Exception $e) {
        http_response_code(500);
        Http::throwErrorJSON($e->getMessage());
        exit;
    }

    http_response_code(200);
    Http::throwOKJSON();

} else {
    http_response_code(405);
    Http::throwErrorJSON("un supported at method type");
    exit;
}