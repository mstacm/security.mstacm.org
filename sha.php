<?php
if (isset($_GET['name']) and isset($_GET['password'])) {
    $name = (string)$_GET['name'];
    $password = (string)$_GET['password'];

    if ($name == $password) {
        print 'Your password can not be your name.';
    } else if (sha1($name) === sha1($password)) {
        print 'flag'
    } else {
        print '<p class="alert">Invalid password.</p>';
    }
}
?>
