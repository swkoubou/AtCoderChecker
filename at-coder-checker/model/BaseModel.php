<?php
require_once __DIR__ . "/config.php";
class BaseModel{
    private static $connInfo;
/**
* @var PDO
*/
    static $_db;
    public $db;

    public function __construct() {
        if (!isset(self::$_db)) {
            $this->initDb();
        }
        $this->db = self::$_db;
    }

    public function initDb() {
        self::$_db = new PDO(
            sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8;',
            self::$connInfo['host'],
            self::$connInfo['dbname']
            ),
            self::$connInfo['dbuser'],
            self::$connInfo['password'],
            [
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
            PDO::ATTR_EMULATE_PREPARES => true
            ]
            );
    }

    public static function setConnectionInfo($connInfo) {
        self::$connInfo = $connInfo;
    }

/**
* @param $sql
* @param array $params
* @return PDOStatement
* @example execute('select * from a where b=? and c=?', [[$b, PDO::PARAM_INT], $c]);
*/
    public function execute($sql, array $params = []) {
        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $v) {
            list($value, $type) = (array)$v + array(1 => PDO::PARAM_STR);
            $stmt->bindValue(is_int($key) ? ++$key : $key, $value, is_null($value) ? PDO::PARAM_NULL : $type);
        }
        $stmt->execute();
        return $stmt;
    }

/**
* @param $table
* @param $where
* @return PDOStatement
* @throws Exception
*/
    public function select($table, $where) {
        $sql = "select * from " . $table . " where ";

        $sql = array_reduce(array_keys($where),  function ($sql, $col) {
            return $sql . $col . " = :" . $col . " and ";
        }, $sql);
        $sql = substr_replace($sql, "", -4);

        try {
            $stmt = $this->execute($sql, $where);
        } catch(Exception $e) {
            throw $e;
        }

        return $stmt;
    }

/**
* @param $table
* @return PDOStatement
* @throws Exception
* @example select("table");
*/
    public function selects($table) {
        $sql = "select * from " . $table;
        try {
            $stmt = $this->execute($sql);
        } catch(Exception $e){
            throw $e;
        }
        return $stmt;
    }

/**
* @param $table
* @param array $data
* @throws InvalidArgumentException
* @throws Exception
* @example insert("table", ["id" => "id", "val" => [10, PDO::PARAM_INT]])
*/
    public function insert($table, array $data = []) {
        if ($data == []) {
            throw new InvalidArgumentException("params is empty");
        }

        $data = array_filter($data);

        $sql = "insert into " . $table . " set ";
        $sql = array_reduce(array_keys($data), function (&$res, $key) {
            return $res . $key . " = :" . $key . ",";
        }, $sql);
        $sql = substr_replace($sql, "", -1);

        try {
            $this->execute($sql, $data);
        } catch(Exception $e) {
            throw $e;
        }

        return $this->db->lastInsertId();
    }

/**
* @param $table
* @param array $columns
* @param array $data
* @throws InvalidArgumentException
* @throws Exception
* @example insert("table",
*      ["column_name1", "column_name2"],
*      [["id" => 1, "val" => [10, PDO::PARAM_INT]], ["id" => 2, "val" => [20, PDO::PARAM_INT]]]);
*/
    public function inserts($table ,array $columns = [], array $data = []) {
        if ($data == [] || $data == [[]] || $columns == []) {
            throw new InvalidArgumentException("params is empty");
        }

        $columns = array_filter($columns);
        $data = array_filter($data);

        $sql = "insert into " . $table . " (";
        $sql = array_reduce($columns, function (&$res, $item) {
            return $res . $item . ",";
        }, $sql);
        $sql = substr_replace($sql, ")", -1);
        $sql .= " values ";

        $sql = array_reduce($data, function (&$sql, $row) {
            $sql .= "(" . str_repeat("?,", count($row));
            return substr_replace($sql, "),", -1);
        }, $sql);
        $sql = substr_replace($sql, "", -1);

        $data2 = [];
        for ($di = 0, $dilim = count($data); $di < $dilim; $di++) {
            for ($ci = 0, $cilim = count($columns); $ci < $cilim; $ci++) {
                $col = $columns[$ci];
                if (is_null($data[$di][$col])) {
                    array_push($data2, [$data[$di][$col], PDO::PARAM_NULL]);
                }else if (isset($data[$di][$col])) {
                array_push($data2, $data[$di][$col]);
                }else {
                    throw new InvalidArgumentException("data is don't have " . $col);
                }
            }
        }

        try {
            $this->execute($sql, $data2);
        } catch(Exception $e) {
            throw $e;
        }
    }

/**
* @param $table
* @param $params
* @param $where
* @throws Exception
* @example update("table", ["id" => "A", "val" => "AAA"], ["id" => A"])
*/
    public function update($table, $params, $where) {
        $sql = "update " . $table . " set ";
        $sql = array_reduce(array_keys($params), function (&$sql, $col) {
            return $sql . $col . " = ?,";
        }, $sql);
        $sql = substr_replace($sql, "", -1);

        $sql .= " where ";
        $sql = array_reduce(array_keys($where),  function ($sql, $col) {
            return $sql . $col . " = ? and ";
        }, $sql);
        $sql = substr_replace($sql, "", -4);

        $data = array_merge(array_values($params), array_values($where));

        try {
            $this->execute($sql, $data);
        } catch(Exception $e) {
            throw $e;
        }
    }

/**
* @param $table
* @param $where
* @throws Exception
*/
    public function delete($table, $where) {
        $sql = "delete from " . $table . " where ";

        $sql = array_reduce(array_keys($where),  function ($sql, $col) {
            return $sql . $col . " = :" . $col . " and ";
        }, $sql);
        $sql = substr_replace($sql, "", -4);

        try {
        $this->execute($sql, $where);
        } catch(Exception $e) {
                throw $e;
        }
    }

/**
* @param $table
* @throws Exception
* @example delete("table");
*/
    public function deletes($table) {
        $sql = "delete from " .  $table;

        try {
            $this->execute($sql);
        } catch(Exception $e) {
            throw $e;
        }
    }
}
?>