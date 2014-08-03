<?php
require_once __DIR__ . "/../model/config.php";
require_once __DIR__ . "/../model/UserModel.php";
require_once __DIR__ . "/../php/util.php";
use util\Http;
use util\Util;

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    Http::setTypeJSON();

    $user_model = new UserModel();

    try {
        $res = $user_model->userGet();
    } catch (Exception $e) {
        http_response_code(500);
        Http::throwErrorJSON($e->getMessage());
        exit;
    }

    http_response_code(200);
    echo json_encode($res);

} else if ($_SERVER['REQUEST_METHOD'] === "POST") {
    Http::setTypeJSON();

    // パラメータチェック
    if (!Util::areSet($_POST, ['user_id', 'name', 'enrollment_year'])) {
        http_response_code(400);
        Http::throwErrorJSON('required params: user_id, name, enrollment_year');
        exit;
    }

    $user_model = new UserModel();

    try  {
        $user_model->userPost($_POST['user_id'], $_POST['name'], $_POST['enrollment_year']);
    } catch (Exception $e) {
        http_response_code(500);
        Http::throwErrorJSON($e->getMessage());
        exit;
    }

    http_response_code(200);
    exit;

} else {
    http_response_code(405);
    exit;
}