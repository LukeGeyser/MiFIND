console.log("v0.003");


// function TestFunction()
// {
//     console.log("Menu Clicked");
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "Catch.php", true);
//     xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     xhttp.send('uniqueId=355465071972349&protocol=&altitude=-5.1&course=0.0&latitude=-34.166853083333336&longitude=24.827688833333333&speed=1.0484378&fixTime=1607497790000&attributes={"internaltamper":true,"brackettamper":false,"poletamper":false,"cputemp":46.698001861572266,"batteryvoltage":8.399999618530273,"supplyvoltage":24.065635681152344,"chargestatus":1}'); 


//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) 
//         {
//             document.getElementById("phpOut").innerHTML = this.responseText;
//         }
//     };
    

// }














mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5rcnVnZWwwMSIsImEiOiJja2l3N3QxZjUwc2llMzBuemQzMTdheHZpIn0.U-B3zHCsJu6Nskh9vFwRdQ';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/johankrugel01/ckiw818ps4jv619pftuyh1ald', // stylesheet location

center: [24.826733043505556,-34.160799390241394], // starting position [lng, lat]
zoom: 15 // starting zoom
});

var geojson = 
{
    type: 'FeatureCollection',
    features: 
    [
    ]
};


map.on( 'dblclick',  function(e) 
    {
        e.preventDefault();
        AddMarker(e.lngLat.lat, e.lngLat.lng);
    }
);


function AddMarker(lat, long)
{
    var newpoint =  
        {
            type: 'Feature',
            geometry: {
            type: 'Point',
            coordinates: [long, lat]
            },
            properties: {
            title: 'Home',
            description: 'The Lofts, Unit 6'
            }
        }

    geojson.features = [].concat(geojson.features, newpoint);

    console.log(geojson.features);

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';
    
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(newpoint.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + newpoint.properties.title + '</h3><p>' + newpoint.properties.description + '</p>'))
    .addTo(map);

}
