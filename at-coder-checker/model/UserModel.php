<?php
require_once __DIR__ . "/BaseModel.php";

class UserModel extends BaseModel{
    const TBNAME="user";

    public function userGet(){
        try{
            $Ug=$this->selects(self::TBNAME);
            return $Ug->fetchAll();
            /*while($out=$Ug->fetch(PDO::FETCH_ASSOC)){
                var_dump($out);//Controllに移す
            }*/
        }catch (Exception $e){
            throw new Exception($e);
        }
    }

    public function userPost($id,$name,$enrollment_year){
        try{
//            if(isset($_POST['id']) && isset($_POST['name'])){
//                $id=$_POST['id'];
//                $name=$_POST['name'];
//            }
            if(preg_match("/[\s]/",json_encode($id),json_encode($name),json_encode($enrollment_year))){
                throw new Exception();
            }

            $this->insert(self::TBNAME,['user_id'=>[$id,PDO::PARAM_STR],'name'=>[$name,PDO::PARAM_STR],'enrollment_year'
            =>[$enrollment_year,PDO::PARAM_INT]]);

            //$Up=$this->inserts(self::TBNAME4,);
        }catch (Exception $e){
            throw new Exception($e);
        }
    }
}
?>