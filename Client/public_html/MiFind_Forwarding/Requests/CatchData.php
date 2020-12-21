<?php

    $servername = "dedi74.jnb2.host-h.net";
    $username = "midevice_admin";
    $password = "PpJ7xFbpLro20d05wq2O";
    $dbname = "midevice_proxy";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) 
    {
        die("Connection failed: " . $conn->connect_error);
        exit();
    }

    // Get parameters form POST
    $uniqueId   = ValidateAndGetParam('uniqueId');
    $protocol   = ValidateAndGetParam('protocol');
    $altitude   = ValidateAndGetParam('altitude') * 1;
    $course     = ValidateAndGetParam('course') * 1;
    $latitude   = ValidateAndGetParam('latitude') * 1;
    $longitude  = ValidateAndGetParam('longitude') * 1;
    $speed      = ValidateAndGetParam('speed') * 1;
    $fixTime    = ValidateAndGetParam('fixTime') * 1;
    $attributes = json_decode( ValidateAndGetParam('attributes') , true);

    // Get attributes from JSON object "attributes"
    $internaltamper     = ValidateAndGetAttr($attributes, "internaltamper") * 1;
    $brackettamper      = ValidateAndGetAttr($attributes, "brackettamper") * 1;
    $poletamper         = ValidateAndGetAttr($attributes ,"poletamper") * 1;
    $cputemp            = ValidateAndGetAttr($attributes ,"cputemp") * 1;
    $batteryvoltage     = ValidateAndGetAttr($attributes ,"batteryvoltage") * 1;
    $supplyvoltage      = ValidateAndGetAttr($attributes ,"supplyvoltage") * 1;
    $chargestatus       = ValidateAndGetAttr($attributes ,"chargestatus") * 1;

    // Report back to requester and log data in text file
    ReportBack("-------------------------------------------------------");
    ReportBack("uniqueId: " . $uniqueId);
    ReportBack("protocol: " . $protocol);
    ReportBack("altitude: " . $altitude);
    ReportBack("course: " . $course);
    ReportBack("latitude: " . $latitude);
    ReportBack("longitude: " . $longitude);
    ReportBack("speed: " . $speed);
    ReportBack("fixTime: " . $fixTime);
    ReportBack("internaltamper: " . $internaltamper);
    ReportBack("brackettamper: " . $brackettamper);
    ReportBack("poletamper: " . $poletamper);
    ReportBack("cputemp: " . $cputemp);
    ReportBack("batteryvoltage: " . $batteryvoltage);
    ReportBack("supplyvoltage: " . $supplyvoltage);
    ReportBack("chargestatus: " . $chargestatus);
    ReportBack("");


    $deviceId = 0;

    $sql = "SELECT deviceId FROM Devices WHERE
    uniqueId = " . $uniqueId . ";";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    // output data of each row
        while($row = $result->fetch_assoc()) {
            $deviceId = $row["uniqueId"];
        }
    } 


    $sql = "INSERT INTO Data
        ( 
            deviceId, protocol, altitude, course, latitude, longitude, speed, fixTime, internalTamper, bracketTamper, poleTamper, cpuTemp, batteryVoltage, supplyVoltage, chargeStatus
        )
        VALUES 
        (
            '" . $deviceId . "',
            '" . $protocol . "',
            '" . $altitude . "',
            '" . $course . "',
            '" . $latitude . "',
            '" . $longitude . "',
            '" . $speed . "',
            FROM_UNIXTIME(" . $fixTime . "/1000 ),
            '" . $internaltamper . "',
            '" . $brackettamper . "',
            '" . $poletamper . "',
            '" . $cputemp . "',
            '" . $batteryvoltage . "',
            '" . $supplyvoltage . "',
            '" . $chargestatus . "'
        )";

        if (!($conn->query($sql) === TRUE)) 
        {
            echo "Error in mySQL INSERT Query:\r\n" . $sql . "<br>" . $conn->error;
        }
    
    $conn->close();

  
    //POST to GPS_Wox
    $url = "http://mifind.co.za/insert.php";

    // //Compile JSON string for GPS_Wox
    $WoxStr = 'uniqueId=' . $uniqueId . '&protocol=' . $protocol . '&altitude=' . $altitude . '&course=' . $course .  '&latitude=' . $latitude . '&longitude=' . $longitude . '&speed=' . $speed . '&fixTime=' . $fixTime . '&attributes={"internaltamper":' . MakeBoolStr($internaltamper) . ',"brackettamper":' . MakeBoolStr($brackettamper) . ',"poletamper":' . MakeBoolStr($poletamper) . ',"cputemp":' . $cputemp . ',"batteryvoltage":' . $batteryvoltage . ',"supplyvoltage":' . $supplyvoltage . ',"chargestatus":' . $chargestatus . '}';

    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $WoxStr);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
    $result = curl_exec($ch);

    //Log the response from GPS_Wox to Logs
    $myfile = fopen("Logs/MiFindResponseLog.txt", "a+") or die("Unable to open file!");
    fwrite($myfile, "\n". $result);
    fclose($myfile);
    
    function MakeBoolStr($BoolInt)
        {
            if ($BoolInt == 1)
            {
                return "true";
            }
            else
            {
                return "false";
            }
        }

    function ReportBack($lineText)
        {
            echo ($lineText . "<br>");

            $myfile = fopen("Logs/ReceivedData.txt", "a+") or die("Unable to open file!");
            fwrite($myfile, "\n". $lineText);
            fclose($myfile);
        }

    function ValidateAndGetAttr($obj, $AttrName)
        {
            $tmp = "";
            
            if (array_key_exists( $AttrName , $obj) ) 
            {
                $tmp = $obj[$AttrName];
            }
            else
            {
                $tmp = "N/A";
            }
            return $tmp;
        }

    function ValidateAndGetParam($callname) 
        {
            $tmp = "";

            if (array_key_exists( $callname , $_POST))
            {
                $tmp = $_POST[$callname]; 
            } 
            else
            {
                $tmp = "N/A";
            }

            return $tmp;
        }






?>