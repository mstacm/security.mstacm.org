<?php

$email = "";
$name = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = test_input($_POST["name"]);
  $email = test_input($_POST["email"]);
}

echo "Please go back and fix these errors.<br /><br />";
 

?>