<?php
require_once __DIR__ . "/../model/config.php";
require_once __DIR__ . "/../model/UserModel.php";
require_once __DIR__ . "/../php/util.php";
use util\Http;

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
    $InputUserPost = new UserModel();

    try {

        if (isset($_POST['method']) && isset($_POST['user_id']) && isset($_POST['name'])
            && isset($_POST['enrollment_year'])
        ) {

            $InputUserPost->userPost($_POST['user_id'], $_POST['name'], $_POST['enrollment_year']);
        }
    } catch (Exception $e) {
        echo $e->getMessage();
        exit();
    }

    exit();
    
} else {
    http_response_code(405);
    exit;
}
?>