<?php
require_once __DIR__ . "/../model/UserModel.php";
require_once __DIR__ . "/../model/config.php";

if($_SERVER['REQUEST_METHOD']==="GET"){
    $OutputUserGet=new UserModel();
    try{
        $OutputData=$OutputUserGet->userGet();
        echo json_encode($OutputData);
    }catch (Exception $e){
        //echo error_log("err");
        echo $e->getMessage();
    }
}
else if($_SERVER['REQUEST_METHOD']==="POST"){
    $InputUserPost=new UserModel();

    try{

        if( isset($_POST['method']) && isset($_POST['user_id']) && isset($_POST['name'])
            && isset($_POST['enrollment_year'])){

            $InputUserPost->userPost($_POST['user_id'],$_POST['name'],$_POST['enrollment_year']);
        }
    }catch (Exception $e){
        echo $e->getMessage();
        exit();
    }

    exit();
}
else{
    error_log("err");
    exit();
}
?>