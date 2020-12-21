<html>
    <title>
        LOGIN
    </title>
    <head>
        <link rel="icon" href="Images/Minet_Logo_Short_White.PNG">
        <link rel="stylesheet" href="Stylesheets/mainstylesheet.css">

        <style>
            .center 
                {
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                -ms-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                }
        </style>
    </head>
    <body style="background-color:black; color:white;">

        <table style="width:100%; height:25px;  border-style: none none solid none; border-color:rgba(255, 255, 255, 0.2)">
            <tr>
                <td style="width:auto">
                    <center>
                        <img class="image" src="Images/Minet_Logo_White.PNG">
                    </center>
                </td>
            </tr>
        </table>


        <div class="grayspace" >

            <div id="phpOut">
            </div>


                <form style="width:300px; height:100px;  " class="center">
                    <center>
                        PLEASE LOG IN HERE
                    <br>
                        <b id="LoginMessage" style="color:red"></b>
                    </center>

                    <table style="width:100%; height:100%; border-style: solid none none none; border-color:rgba(255, 255, 255, 0.2)">
                        <tr>
                            <td style="width:25%; height:33%">
                                Username

                            </td>
                            <td >
                                <input id="Uname" style="width:100%">

                            </td>
                        </tr>
                        <tr>
                            <td >
                                Password

                            </td>
                            <td >
                                <input id="Pass" type="password" style="width:100%">

                            </td>
                        </tr>
                        <tr>
                            <td >

                            </td>
                            <td id="LoginButton" style="color:white; border-style:solid; border-color:rgba(255, 255, 255, 0.2); border-width:2px; cursor:pointer; text-align:center">
                                Login
                            </td>
                        </tr>
                    </table>

                </form>


            
        </div>

    </body>



    <script type="application/javascript">
    var UserPublicIP;
        function getIP(json) {
            UserPublicIP = json.ip;
        }

    </script>
    <script type="application/javascript" src="https://api.ipify.org?format=jsonp&callback=getIP"></script>
    <script>

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;

    console.log(nVer + "\r\n" + nAgt + "\r\n" + browserName + "\r\n" + UserPublicIP)

    document.getElementById("LoginButton").addEventListener("click", LoginAttempt);
    function LoginAttempt()
    {
        var Uname = document.getElementById("Uname").value;
        var Pass = document.getElementById("Pass").value;
        console.log("Login Clicked");

        document.getElementById("LoginMessage").style.color = "white";
        document.getElementById("LoginMessage").innerText = "Authenticating...";



        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "Requests/Request_Authentication.php", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send('Uname='+ Uname + '&Pass=' + Pass);

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) 
            {
                var resp = JSON.parse(this.responseText);
                if (resp.success == true)
                {
                    document.getElementById("LoginMessage").innerText = "";

                    var payload = resp;
                    var form = document.createElement('form');
                    form.style.visibility = 'hidden'; // no user interaction is necessary
                    form.method = 'POST'; // forms by default use GET query strings
                    form.action = 'MainPage.php';
                        for (key in Object.keys(payload)) {
                            var input = document.createElement('input');
                            input.name = key;
                            input.value = payload[key];
                            form.appendChild(input); // add key/value pair to form
                        }
                    document.body.appendChild(form); // forms cannot be submitted outside of body
                    form.submit(); // send the payload and navigate

                }
                else
                {
                    document.getElementById("LoginMessage").innerText = "Authentication Failed";
                    document.getElementById("LoginMessage").style.color = "red";
                }
            }
        };
    }

    document.getElementById("Uname").addEventListener("keyup", function(event) 
    {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("Pass").focus();
        }
    });

    document.getElementById("Pass").addEventListener("keyup", function(event) 
    {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("LoginButton").click();
        }
    });


    

    function NavigateWithPost(payload)
    {
        
    }




    </script>

</html>