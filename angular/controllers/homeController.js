'use strict';

app.controller('homeController',
 ['$scope','$q','NgMap',
 function ($scope, $q,NgMap) { 

 	var isTileMap=false;
	//Map
    NgMap.getMap().then(function(map) {
	    $scope.map = map;
	});

	$scope.mapOptions={
        zoom:2,
        center:[40,30]
	}; 

	$scope.init=function(){

  	};


	$scope.toggleBrasilTile=function(){ 
		if(!isTileMap){
			$scope.map.overlayMapTypes.push(BrasilSLPLayer());
			isTileMap=true;	
		}else{
			$scope.map.overlayMapTypes.setAt( 0, null);
        	$scope.map.overlayMapTypes.pop();
            isTileMap=false; 
		}				
	}; 


	//Define custom WMS tiled layer
    function BrasilSLPLayer(){
        return new google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
                var proj = $scope.map.getProjection();
                var zfactor = Math.pow(2, zoom);
                // get Long Lat coordinates
                var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
                var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

                //corrections for the slight shift of the SLP (mapserver)
                var deltaX = 0.0013;
                var deltaY = 0.00058;

                //create the Bounding box string
                var bbox =     (top.lng() + deltaX) + "," +
                               (bot.lat() + deltaY) + "," +
                               (bot.lng() + deltaX) + "," +
                               (top.lat() + deltaY);
                               
                //base WMS URL      
                var url = "http://www.geoportal.com.br/GeoportalWMS_DG/TileServer.aspx?";                
                url += "&Ticket=01C78661-75E6-450E-9B4E-A1FFBCBFF310";
                url += "&REQUEST=GetMap"; //WMS operation
                url += "&SERVICE=WMS";    //WMS service
                url += "&VERSION=1.1.1";  //WMS version  
                url += "&LAYERS=" + "Mapa"; //WMS layers
                url += "&FORMAT=image/gif" ; //WMS format              
                url += "&TRANSPARENT=false";
                url += "&SRS=EPSG%3A29178";     //set WGS84 
                url += "&STYLES=";   
                url += "&BBOX="+bbox;      // set bounding box
                url += "&WIDTH=256";     //tile size in google
                url += "&HEIGHT=256";
                return encodeURI(url);     // return URL for the tile

            },
            tileSize: new google.maps.Size(256, 256),
            isPng: false
        });
    }


    /***************Open street map code********************/
    var isOpenStreetTileMap=false;
    $scope.toggleOpenStreetMap=function(){
        if(!isOpenStreetTileMap){
            $scope.map.overlayMapTypes.push(openStreetSLPLayer());
            isOpenStreetTileMap=true; 
        }else{
            $scope.map.overlayMapTypes.setAt( 0, null);
            $scope.map.overlayMapTypes.pop();
            isOpenStreetTileMap=false; 
        }
    };

    function openStreetSLPLayer(){
        return new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                // "Wrap" x (logitude) at 180th meridian properly
                // NB: Don't touch coord.x because coord param is by reference, and changing its x property breakes something in Google's lib 
                var tilesPerGlobe = 1 << zoom;
                var x = coord.x % tilesPerGlobe;
                if (x < 0) {
                    x = tilesPerGlobe+x;
                }
                // Wrap y (latitude) in a like manner if you want to enable vertical infinite scroll

                return "http://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
            },
            tileSize: new google.maps.Size(256, 256),
            name: "OpenStreetMap",
            maxZoom: 18
        });
    }

}]);

