<?php

echo json_encode([
    [
        "contest_id" => 1,
        "name" => "abc001",
        "updated_at" => "2014-02-04 00:00:00"
    ],
    [
        "contest_id" => 2,
        "name" => "abc002",
        "updated_at" => "2014-02-05 00:00:50"
    ]
], JSON_NUMERIC_CHECK);