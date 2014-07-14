<?php
/**
 * Created by PhpStorm.
 * User: 1422085
 * Date: 14/06/25
 * Time: 20:34
 */
require_once __DIR__ . "/BaseModel.php";
class SubmissionModel extends BaseModel{
    const TBNAME="submission";

    public function submissionGet(){
        try{
            //$nowTime=time();
            //if(isset())
            //$this->timeUpdate();
            sleep(1000);
            $SubG=$this->selects(self::TBNAME);
            return $SubG->fetchAll();
            /*while($out=$SubG->fetch(PDO::FETCH_ASSOC)){
                var_dump($out);//Controllに移す
            }*/
        }catch (Exception $e){
            throw new Exception($e);
        }
    }
}
?>