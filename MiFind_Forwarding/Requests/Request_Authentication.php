<?php

    $servername = "dedi74.jnb2.host-h.net";
    $username = "midevice_admin";
    $password = "PpJ7xFbpLro20d05wq2O";
    $dbname = "midevice_proxy";
    $uname = $_POST["Uname"];
    $pass = $_POST["Pass"];
    $userId = 0;

    $response->success = false;



    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) 
    {
        die("Connection failed: " . $conn->connect_error);
        exit();
    }
    
    $sql = "SELECT UserId FROM Authentication WHERE
    UserName='" . $uname . "' 
    AND Password = '" . $pass . "';";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    // output data of each row
        while($row = $result->fetch_assoc()) {
            $userId = $row["UserId"];
        }
    } 

    $conn->close();

    if ($userId != 0)
    {
        $response->success = true;
        $response->token = "JOhan Krugel";
        $response->validuntil = "2020-12-21 00:00:00";

    }

        $myJSON = json_encode($response);
        echo $myJSON;

?>