<?php

echo json_encode([
    "contest_id" => 1,
    "problems" => [
        [
            "problem_id" => "A",
            "assignment" => "A",
            "screen_name" => "A",
            "name" => "HogeHoge",
            "submissions" => [
                [
                    "submission_id" => 1,
                    "user_id" => "torus711",
                    "score" => 100,
                    "status" => "AC",
                    "language" => "Haskell"
                ],
                [
                    "submission_id" => 2,
                    "user_id" => "s1221149",
                    "score" => 100,
                    "status" => "AC",
                    "language" => "JavaScript"
                ]
            ]
        ],
        [
            "problem_id" => "B",
            "assignment" => "B",
            "screen_name" => "B",
            "name" => "PiyoPiyo",
            "submissions" => [
                [
                    "submission_id" => 3,
                    "user_id" => "torus711",
                    "score" => 100,
                    "status" => "AC",
                    "language" => "Haskell"
                ],
                [
                    "submission_id" => 5,
                    "user_id" => "s1221149",
                    "score" => 80,
                    "status" => "WA",
                    "language" => "c++"
                ]
            ]
        ],
        [
            "problem_id" => "C",
            "assignment" => "C",
            "screen_name" => "C",
            "name" => "FizzBazz",
            "submissions" => [
                [
                    "submission_id" => 6,
                    "user_id" => "torus711",
                    "score" => 100,
                    "status" => "AC",
                    "language" => "c++"
                ],
                [
                    "submission_id" => 9,
                    "user_id" => "nanashi",
                    "score" => 99,
                    "status" => "WA",
                    "language" => "Python"
                ]
            ]
        ]
    ]
], JSON_NUMERIC_CHECK);