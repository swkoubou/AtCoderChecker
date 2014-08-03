<?php
require_once __DIR__ . "/BaseModel.php";

class UserModel extends BaseModel{
    const TBNAME="user";

    public function userGet(){
        try{
            $stmt = $this->selects(self::TBNAME);
        }catch (Exception $e){
            throw new Exception($e);
        }

        return $stmt->fetchAll();
    }

    public function userPost($user_id, $name, $enrollment_year) {
        // パラメータチェック
        if (!$this->validationEnrollmentYear($enrollment_year)) {
            throw new InvalidArgumentException('invalid enrollment year.');
        }

        try {
            $this->insert(self::TBNAME,[
                'user_id' => [$user_id, PDO::PARAM_STR],
                'name' => [$name, PDO::PARAM_STR],
                'enrollment_year' => [$enrollment_year, PDO::PARAM_INT]
            ]);
        }catch (Exception $e){
            throw new Exception($e);
        }
    }

    public function validationEnrollmentYear($enrollment_year) {
        return preg_match("/^20\\d\\d$/", $enrollment_year);
    }
}
?>