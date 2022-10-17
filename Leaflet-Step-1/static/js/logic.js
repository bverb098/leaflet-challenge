var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 4
});


L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap)

const colors = [
    "rgb(1, 243, 12)",
    "rgb(150, 213, 0)",
    "rgb(203, 179, 0)",
    "rgb(236, 139, 0)",
    "rgb(253, 96, 0)",
    "rgb(253, 45, 59)"
];

function getRadius(magnitude) {
    var radius = magnitude * 10000
    return radius
}

function getColor(magnitude) {
    var color
    switch(true) {
        case (magnitude <= 1):
            color = colors[0];
            break;
        case (magnitude <= 2):
            color = colors[1];
            break;
        case (magnitude <= 3):
            color = colors[2];
            break;
        case (magnitude <= 4):
            color = colors[3];
            break;
        case (magnitude <= 5):
            color = colors[4];
            break;
        case (magnitude > 5):
            color = colors[5];
            break;
        default:
            color = "blue"
    };
    return color
};

const geoUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(geoUrl).then(geoData => {
    console.log("geoData: ", geoData)
    console.log("lat/lon test: ", geoData.features[0].geometry.coordinates.slice(0,2))
    console.log("mag: ", geoData.features[0].properties.mag)

    geoData.features.forEach(quake => {
        var lon = quake.geometry.coordinates[0]
        var lat = quake.geometry.coordinates[1]
        var depth = quake.geometry.coordinates[2]
        var magnitude = quake.properties.mag
        var date = new Date(quake.properties.time)
        date = date.toUTCString()
        var place = quake.properties.place
        L.circle([lat,lon],{
                stroke: false,
                fillOpacity: 0.75,
                color: getColor(magnitude),
                fillColor: getColor(magnitude),
                radius: getRadius(magnitude)
            }).bindPopup("<h2>" + place + "</h2><p>" + date + "</p><hr><p>Lat, Long: " + lat + ", " + lon + "<br/>Depth: " + depth + "km<br/> Maginitude: " + magnitude + "</p>").addTo(myMap);
      
    })

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var categories = ["0-1","1-2","2-3", "3-4", "4-5", "5+"];
        var labels = []


        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
            labels.push(
                "<svg width ='20px' height='20px'><circle cx='10' cy='10' r='10' fill= '" + colors[i] + "' /></circle></svg>" +"  " + categories[i]
            )
        }
            div.innerHTML = labels.join('<br><br>');
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
});


