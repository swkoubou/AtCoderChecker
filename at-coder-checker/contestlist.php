<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AtCoderChecker MoreGraphicsソフトウェア工房</title>

    <link rel="stylesheet" href="plugin/bootstrap/css/bootstrap.min.css">
    <style>
        body {
            background-color: #3498db
        }
    </style>

    <link rel="stylesheet" href="css/common.css">
</head>
<body>

<div class="container-fluid" id="container-contestlist">
    <div class="contest-list-wrap" data-bind="foreach: {
        data: contest_list,
        afterAdd: view.addCircle }">

        <div class="contest" data-bind="event: { mouseover: $root.view.scaleUp, mouseout: $root.view.scaleDown }">
            <p class="contest-name" data-bind="text: name, click: $root.decideItem"></p>
        </div>

    </div>
</div>

<script src="plugin/jquery.min.js"></script>
<script src="plugin/knockout.min.js"></script>
<script src="plugin/underscore.min.js"></script>
<script src="plugin/jquery.easing.1.3.js"></script>
<script src="plugin/jquery.pjax.js"></script>
<script src="js/util.js"></script>
<script src="js/model/UserModel.js"></script>
<script src="js/model/ContestModel.js"></script>
<script src="js/view/ContestListView.js"></script>
<script src="js/contestlist.js"></script>

</body>
</html>