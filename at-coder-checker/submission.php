<?php
require_once __DIR__ . "/php/pjax.php";

if (!$pjax) { ?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AtCoderChecker MoreGraphicsソフトウェア工房</title>

    <link rel="stylesheet" href="plugin/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/common.css">
    <style>
        body {
            background-color: #e74c3c;
        }
    </style>
</head>
<body>

<?php } ?>

<div id="container-submission">

    <p class="current-contest-name" data-bind="text: current_contest() && current_contest().name"></p>

    <div class="container-fluid">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <!-- ko foreach: problems -->
                        <th class="text-center" data-bind="text: displayName"></th>
                        <!-- /ko -->
                    </tr>
                </thead>
                <tbody data-bind="foreach: { data: users, as: 'user' }">
                <tr>
                    <th data-bind="text: user.displayName"></th>
                    <!-- ko foreach: $root.submissions()[user.user_id] -->

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
<script src="js/viewmodel/HogeViewModel.js"></script>
<script src="js/submission.js"></script>

</body>
</html>
<?php } ?>