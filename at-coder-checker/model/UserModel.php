<?php
require_once __DIR__ . "/BaseModel.php";

class UserModel extends BaseModel{
    const TBNAME = "user";
    const USER_PROFILE_URL = 'http://practice.contest.atcoder.jp/users/';

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
        if (!$this->validationUserId($user_id)) {
            throw new InvalidArgumentException('invalid user id.');
        }
        if ($this->existsUserId($user_id)) {
            throw new InvalidArgumentException('exists user id.');
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

    public function validationUserId($user_id) {
        // ユーザ名は英字で始まる半角英数字で3文字以上12文字以下
        if (!preg_match("/^[a-z]\\w{2,12}$/", $user_id)) {
            return false;
        }

        // AtCoderに登録されているユーザ名か
        $content = file_get_contents(self::USER_PROFILE_URL . $user_id);
        if (preg_match("/<h1>404<\\/h1>/", $content)) {
            return false;
        }

        return true;
    }

    /**
     * 指定されたユーザIDがDBに存在するか
     *
     * @param $user_id
     * @return bool
     * @throws Exception
     */
    public function existsUserId($user_id) {
        try {
            $stmt = $this->select(self::TBNAME, ['user_id' => $user_id]);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        return !!$stmt->rowCount();
    }

}