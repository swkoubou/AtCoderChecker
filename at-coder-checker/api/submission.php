<?php
require_once __DIR__ . "/../model/SubmissionModel.php";
require_once __DIR__ . "/config.php";
/**
 * Created by PhpStorm.
 * User: 1422085
 * Date: 14/06/29
 * Time: 0:48
 */

if($_SERVER['REQUEST_METHOD']==="GET"){
    $OutputSubGet=new SubmissionModel();
    try{
        $OutputData=$OutputSubGet->submissionGet();
        echo json_encode($OutputData);
        /*if( isset($_POST['method']) && isset($_POST['contest_id']) &&
            isset($_POST['url']) && isset($_POST['updated_at'])){
            $data->contestPost($_POST['contest_id'],$_POST['url'],$_POST['updated_at']);
        }*/
    }catch(Exception $e){
        echo $e->getMessage();
        exit();
    }
}
else{
    error_log("err");
    exit();
}
?>