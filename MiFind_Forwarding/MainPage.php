<html>
    <title>
        MiFind Proxy
    </title>
    <head>
        <link rel="icon" href="Images/Minet_Logo_Short_White.PNG">
        <link rel="stylesheet" href="Stylesheets/mainstylesheet.css">

        <script src='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js'></script>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />


    </head>
    <body style="background-color:black; color:white">

        <table style="width:100%; height:25px">
            <tr>
                <td style="width:auto">
                    <center>
                        <img class="image" src="Images/Minet_Logo_White.PNG">
                    </center>
                </td>
            </tr>
        </table>

        
        <div class="grayspace">

            <table style="width:100%; height:100%; table-layout:fixed;">
                <tr>
                    <td  class="groupsPanel">
                        <table class="menuBox">




                        
                            <tr>
                                <td class="deviceGroup">

                                    <table style="width:100%">
                                        <tr>
                                            <td>
                                                Group 1
                                            </td>
                                            <td class="deviceGreenIcon" >

                                                <form class="deviceGroupCounter"><b> 5 </b></form>

                                            </td>
                                            <td class="deviceYellowIcon">
                                                <form class="deviceGroupCounter"><b> 109 </b></form>
                                            </td>
                                            <td class="deviceRedIcon">
                                                <form class="deviceGroupCounter"><b> 0 </b></form>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td class="deviceGroup">
                                    <table style="width:100%">
                                        <tr>
                                            <td>
                                                Group 1
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I1
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I2
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I3
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td class="deviceGroup">
                                    <table style="width:100%">
                                        <tr>
                                            <td>
                                                Group 2
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I1
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I2
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I3
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td class="deviceGroup">
                                    <table style="width:100%">
                                        <tr>
                                            <td>
                                                Group 3
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I1
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I2
                                            </td>
                                            <td class="deviceGroupIcon">
                                                I3
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>


                    </td>
                    <td style="width:auto">
                        <div id='map' style='width: 100%; height: 100%;'></div>
                    </td>
                </tr>
            </table>




            <div id="phpOut">
            </div>

            



        </div>
    </body>

    <script src="Scripts/index.js"></script>

</html>