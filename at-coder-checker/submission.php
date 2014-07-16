<?php
require_once __DIR__ . "/php/pjax.php";

if (!$pjax) { ?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AtCoderChecker MoreGraphicsソフトウェア工房</title>

    <link rel="stylesheet" href="plugin/bootstrap/css/bootstrap.min.css">
    <style>
        * {
            font-family:'Lucida Grande','Hiragino Kaku Gothic ProN',
            Meiryo, sans-serif;
        }

        body {
            background-color: #e74c3c;
        }

        .contest-name {
            position: absolute;
            padding: 0;
            margin: 0;
            top: 4px;
            left: 4px;
            font-size: 24px;
            font-weight: normal;
        }

        .container-fluid {
            margin-top: 40px;
        }

        .table > tbody > tr:nth-child(odd) {
            background-color: #ecf0f1;
        }

        .table > tbody > tr:nth-child(even) {
            background-color: #bdc3c7;
        }

        .table > thead > tr {
            background-color: #bdc3c7;
        }
    </style>
</head>
<body>

<?php } ?>

<p class="contest-name" data-bind="text: current_contest() && current_contest().name"></p>

<div class="container-fluid">
    <div class="table-responsive">
        <table class="table">
            <thead>
            <tr>
                <th>#</th>
                <!-- ko foreach: users -->
                <th class="text-center" data-bind="text: $data"></th>
                <!-- /ko -->
            </tr>
            </thead>
            <tbody data-bind="foreach: problems">
            <tr>
                <th data-bind="text: assignment + ': ' + name"></th>
                <!-- ko foreach: $root.submissions()[problem_id] -->

                <!-- ko if: $data -->
                <td class="text-center" data-bind="text: status"></td>
                <!-- /ko -->
                <!-- ko if: $data === null -->
                <td class="text-center">-</td>
                <!-- /ko -->

                <!-- /ko -->
            </tr>
            </tbody>
        </table>
    </div>
</div>

<?php if (!$pjax) { ?>
<script src="plugin/jquery.min.js"></script>
<script src="plugin/knockout.min.js"></script>
<script src="plugin/underscore.min.js"></script>
<script src="plugin/jquery.easing.1.3.js"></script>
<script src="js/util.js"></script>
<script src="js/model/UserModel.js"></script>
<script src="js/model/ContestModel.js"></script>
<script src="js/view/ContestListView.js"></script>
<script src="js/submission.js"></script>

</body>
</html>
<?php } ?>