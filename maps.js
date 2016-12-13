/**
 * Created by sloan on 12/12/2016.
 */
var infowindow;
var map;
var directions;
var marker, i;
var markers = [];
var currentLocationMarker = null;
function makemap() {
for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
        }
    })(marker, i));
}}

function prepare_map(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infowindow = new google.maps.InfoWindow();
    directions = new Directions();
    directions.init(map);
    //makemap();
}

function clearMarkers() {
    for (var i in markers) {
        var marker = markers[i];
        marker.setMap(null);
    }
    markers = [];
    directions.clearTurnByTurn();
    directions.clearDirectionsPoly();
}

function createMarkerInfo(title,details) {
    var infoDiv = $("<div>");

    if (title) {
        var head = $("<h5>",{
            text:title
        });
        infoDiv.append(head);
    }

    if (details) {
        var address = $("<p>",{
            text:details
        });
        infoDiv.append(address);
    }

    return infoDiv;
}

function createMarker(placeResult,origin) {
    console.log(placeResult);
    infowindow.close();

    var this_img;
    for (var loop=0; loop < image_array.length; loop++ ){
         if (placeResult.name === image_array[loop].name) {
             this_img = image_array[loop].image;
             break;
         }
    }

    var marker = new google.maps.Marker({
        map: map,
        icon:{
            url:"images/" + this_img,
            scaledSize : new google.maps.Size(30,30,"px","px")
        },
        place: {
            placeId: placeResult.place_id,
            location: placeResult.geometry.location
        }
    });

    markers.push(marker);

    google.maps.event.addListener(marker,"click", (function (marker,placeResult) {
        return function () {
            var infodiv = createMarkerInfo(placeResult.name,placeResult.vicinity);

                var info = $("<button>",{
                    class:"btn btn-default",
                    type:"button",
                    text:"Directions"
                });

                info.on("click",function () {
                    var destination = placeResult.geometry.location;
                    //var origin = new google.maps.LatLng(33.6361934,-117.7415816);
                    directions.clearDirectionsPoly();
                    directions.showDirection(origin,destination);
                    infowindow.close();
                });

                infodiv.append(info);


            infowindow.setContent(infodiv[0]);
            infowindow.open(map,marker);
        }
    })(marker,placeResult));
}

function setCurrentLocation(location) {
    currentLocationMarker = new google.maps.Marker({
        map: map,
        icon:{
            url:"images/youarehere.png",
            scaledSize : new google.maps.Size(30,30,"px","px")
        },
        position: new google.maps.LatLng(location.lat,location.lng)
    });
}

function showNoPlaces(name) {
    var infodiv = createMarkerInfo("No " + name + " found near you");
    infowindow.setContent(infodiv[0]);
    infowindow.open(map,currentLocationMarker);
}