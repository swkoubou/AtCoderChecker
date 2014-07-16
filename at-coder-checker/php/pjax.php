<?php

$rheader = getallheaders();
$pjax = (!empty($rheader['X-PJAX']) && ($rheader['X-PJAX'] == "true"));