<?php
require_once __DIR__ . "/BaseModel.php";

class ContestModel extends BaseModel {
    const TBNAME = "contest";

    public function contestGet() {
        try {
            $stmt = $this->selects(self::TBNAME);
        } catch (Exception $e) {
            throw new Exception($e);
        }

        return $stmt->fetchAll();
    }

    public function contestPost($conid, $conurl, $conname) {
        try {
            if (preg_match("/[\s]/", json_encode($conname))) {
                throw new Exception();
            }
            $connowtime = date("m/j h:i:s");
            $this->insert(self::TBNAME, ['contest_id' => [$conid, PDO::PARAM_STR], 'url' => [$conurl, PDO::PARAM_STR],
                'name' => [$conname, PDO::PARAM_STR], 'updated_at' => [$connowtime, PDO::PARAM_STR]]);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

}

?>