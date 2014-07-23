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
            //sleep(1000);
            //if($_SERVER['REQUESTMETHOD'==="GET"])
            /*if($_SERVER['REQUESTMETHOD'==="GET"])
                if(isset($_GET['method']) && (isset($_GET['submission_id']) || isset($_GET['problem_id'])
                    || isset($_GET['user_id']) || isset($_GET['score']) || isset($_GET['status'])
                        || isset($_GET['language']) ) ){
                    $value=
            $this->update(self::TBNAME,[$method=> $_GET[],[]]);*/
//            $SubG=$this->selects(self::TBNAME);
//            return $SubG->fetchAll();
            /*while($out=$SubG->fetch(PDO::FETCH_ASSOC)){
                var_dump($out);//Controllに移す
            }*/

            /*$problems = 配列;
問題文だけ回す
  $problems[i]['submissions'] = fetchAll(sql(その問題の提出結果を取得));
*/
            $subpro=array();
            foreach($subpro as $key=>$val){
                //$i=0;
                //print_r($subpro);
                $subpro[$key][$val]=$this->selects(self::TBNAME)->fetchAll();

            }
            //$datea=$this->selects(self::TBNAME)->fetchAll();
            //return print_r($datea);
//            foreach($subpro as $a){
//                return $subpro->fetchAll();
//            }

        }catch (Exception $e){
            throw new Exception($e);
        }
    }
}
?>