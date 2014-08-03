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

    try {
        if (isset($_POST['method']) && isset($_POST['conid']) && isset($_POST['conurl']) && isset($_POST['conname'])) {
            $contest_model->contestPost($_POST['conid'], $_POST['conurl'], $_POST['conname']);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
        exit();
    }

} else {
    http_response_code(405);
    exit;
}
?>