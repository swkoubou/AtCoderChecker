<?php
require_once __DIR__ . "/../model/ContestModel.php";
require_once __DIR__ . "/../model/config.php";
/**
 * Created by PhpStorm.
 * User: 1422085
 * Date: 14/07/14
 * Time: 11:16
 */
if($_SERVER['REQUEST_METHOD']==="GET"){
    $OutputConGet=new ContestModel();

    try{
        $OutputData=$OutputConGet->contestGet();
        echo json_encode($OutputData);
    }catch(Exception $e){
        echo $e->getMessage();
    }
}

else if($_SERVER['REQUEST_METHOD']==="POST"){
    $InputConPost=new ContestModel();

    try{
        if( isset($_POST['method']) && isset($_POST['conid']) && isset($_POST['conurl']) && isset($_POST['conname'])){
            $InputConPost->contestPost($_POST['conid'],$_POST['conurl'],$_POST['conname']);
        }
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