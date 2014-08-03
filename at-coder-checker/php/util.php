<?php
/**
 * my util
 */
namespace util;

class String{
    public static function sliceTorFound($str, $del) {
        $res = substr($str, strrpos($str, $del));
        $res = str_replace($del, "", $res);
        return $res;
    }

    public static function snakeToPascal($str) {
        return implode(array_map(function ($str) { return ucfirst(strtolower($str)); }, explode("_", $str)));
    }

    public static function snakeToCamel($str) {
        return lcfirst(implode(array_map(function ($str) { return ucfirst(strtolower($str)); }, explode("_", $str))));
    }

    public static function toSnake($str) {
        return lcfirst(preg_replace("/([a-z0-9])([A-Z])/", "$1_$2", $str));
    }
}

/**
 * Class Match
 * @package util
 */
class Match {
    public static function email($str) {
        return !!preg_match("|^[0-9a-z_./?-]+@([0-9a-z-]+\.)+[0-9a-z-]+$|", $str);
    }

    public static function japaneseAlphaNum($str, $enable_space = true) {
        \mb_regex_encoding("UTF-8");
        return !!preg_match("/^[ぁ-んァ-ヶーa-zA-Z0-9一-龠０-９ａ-ｚＡ-Ｚ" . ($enable_space ? "\s" : "") . "]+$/u", $str);
    }

    public static function hiragana($str, $enable_space = true) {
        \mb_regex_encoding("UTF-8");
        return !!preg_match("/^[ぁ-んー" . ($enable_space ? "\s" : "") . "]+$/u", $str);
    }

    public static function katakana($str, $enable_space = true) {
        \mb_regex_encoding("UTF-8");
        return !!preg_match("/^[ァ-ヶー" . ($enable_space ? "\s" : "") . "]+$/u", $str);
    }
}

class Util {
    public static function areSet($ary, $keys) {
        for ($i = 0, $lim = count($keys); $i < $lim; $i++) {
            if (!isset($ary[$keys[$i]])) {
                return false;
            }
        }
        return true;
    }

    public static function getAccessURL() {
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
            $protocol = 'https://';
        }else{
            $protocol = 'http://';
        }

        return $protocol . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
    }

    public static function unwrap($x) {
        return isset($x) ? $x : null;
    }

    public static function isLogin() {
        return session_status() === PHP_SESSION_ACTIVE &&
        isset($_SESSION) &&
        isset($_SESSION["account"]) &&
        isset($_SESSION["account"]["user_id"]) &&
        isset($_SESSION["account"]["account_id"]);
    }

    public static function isSignup() {
        return session_status() === PHP_SESSION_ACTIVE &&
        isset($_SESSION) &&
        isset($_SESSION["signup"]) &&
        isset($_SESSION["signup"]["id"]);
    }

    public static function exitSignup() {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['signup'] = [];
        }
    }

    public static function isAdmin() {
        return self::isLogin() &&
        isset($_SESSION['account']['account_level_id']) &&
        $_SESSION['account']['account_level_id'] == 1;
    }
}

class Date {
    public static function toFiscalYear($year, $month) {
        return $year + ($month < 4 ? -1 : 0);
    }

    public static function fromFiscalYear($fiscal_year, $month) {
        return $fiscal_year + ($month < 4 ? 1 : 0);
    }

    public static function getNowFiscalYear() {
        $local_date = getdate();
        return date::toFiscalYear($local_date['year'], $local_date['mon']);
    }
}

class Http {
    public static function throwOK() {
        header("HTTP/1.1 200 OK");
    }
    public static function throwBadRequest() {
        header("HTTP/1.1 400 Bad Request");
    }
    public static function throwNotFound() {
        header("HTTP/1.1 404 Not Found");
    }
    public static function throwInternalServerError() {
        header("HTTP/1.1 500 Internal Server Error");
    }
    public static function setTypeJSON() {
        header("Content-type: text/json; charset=utf-8");
    }
    public static function setFilename($name) {
        header("Content-Disposition: filename=" . $name);
    }
    public static function throwErrorJSON($message) {
        echo json_encode(["message" => $message], JSON_UNESCAPED_UNICODE);
    }
    public static function throwOKJSON() {
        echo json_encode(["message" => "OK"], JSON_UNESCAPED_UNICODE);
    }
}