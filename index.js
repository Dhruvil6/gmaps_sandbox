// Initialize and add the map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17, // furthest zoom that can see buildings
    center: { lat: 42.37429224178242, lng: -71.11628459241092 }, // arbitrary start location
    mapId: 'b536490391ffa6c2'

  });

  // turn off point-of-interest visibility
  map.setOptions({ styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
  ]});

  map.moveCamera({
    center: new google.maps.LatLng(42.37429224178242, -71.11628459241092),
    zoom: 16,
    heading: 320,
    tilt: 47.5
  });

  const buttons = [
    ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
    ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
    ["Tilt Down", "tilt", 20, google.maps.ControlPosition.BOTTOM_CENTER],
    ["Tilt Up", "tilt", -20, google.maps.ControlPosition.TOP_CENTER],
  ];
  buttons.forEach(([text, mode, amount, position]) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("button");
    if(text == "Rotate Left"){
      controlUI.classList.add("ui-left")
    }
    if(text == "Rotate Right"){
      controlUI.classList.add("ui-right")
    }
    if(text == "Tilt Down"){
      controlUI.classList.add("ui-Down")
    }
    if(text == "Tilt Up"){
      controlUI.classList.add("ui-Up")
    }
  
    controlUI.addEventListener("click", () => {
      adjustMap(mode, amount);
    });
    controlDiv.appendChild(controlUI);
    map.controls[position].push(controlDiv);
  });

  const adjustMap = function (mode, amount) {
    switch (mode) {
      case "tilt":
        map.setTilt(map.getTilt() + amount);
        break;
      case "rotate":
        map.setHeading(map.getHeading() + amount);
        break;
      default:
        break;
    }
  };

  // create one infowindow for all markers
  const makeContent = x => 
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">${x.title}</h1>` +
    "</div>" +
    "<div>" + 
    `<p>${x.description}</p>`+
    "</div>" +
    '<iframe' +
    ' width="600"' +
    ' height="480"' +
    ` src="https://my.matterport.com/show?m=${x.sid}"` +
    ' frameborder="0"' +
    ' allow="fullscreen">' +
    '</iframe>';
  const infoWindow = new google.maps.InfoWindow({
    zIndex: 1,
  });

  // create markers using metadata
  for (let i=0; i < meta.length; i++) {
    const marker = new google.maps.Marker({
      position: meta[i].position,
      map: map,
      icon: 'icon.png',
      collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
    });
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(makeContent(meta[i]));
      infoWindow.open(marker.getMap(), marker);
    });
  };

  var coordinates = buildCoordinatesArrayFromString(kmlData);
  const HarvardPolygon = new google.maps.Polygon({
    paths: coordinates,
    strokeColor: '#FF3158',
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: '#FF3158',
    fillOpacity: 0.3
  });

  HarvardPolygon.setMap(map);

};

// Put all marker metadata here
const meta = [
  {
    position: { lat: 42.376468639837235, lng: -71.11823289325775 },
    title: 'Littauer Center of Public Administration',
    sid: '7NHGxdB7qDi',
    description: 'CAMBRIDGE, Mass., Dec. 2--In a building, the newness of whose white granite facade shines in the wintry sunlight, the Harvard Graduate School of Public Administration goes into its academic year for the first time in the new Littauer Center of Public Administration',
  },
  {
    position: { lat: 42.372262942322884, lng: -71.11987174774083 }, 
    title: 'Weissman Preservation Center',
    sid: '8iApc5dtvmi',
    description: 'The Weissman Preservation Center exists to preserve the collections of books, manuscripts, prints, drawings, maps, photographs, and other holdings of Harvard University',
  },
  {
    position: { lat: 42.37484391141072, lng: -71.11823573681987 }, 
    title: 'Harvard Hall',
    sid: 'DhGGdYSxAXN',
    description: 'The present Harvard Hall replaces an earlier structure of the same name on the same site. The first Harvard Hall was built between 1674 and 1677. It was Harvard College first brick building and replaced a decaying wooden building located a few hundred feet to the\
     southeast. Samuel Andrew, a local Cambridge merchant and shipwright was the master builder'
  },
  {
    position: { lat: 42.37563007285733, lng: -71.11323291791693 }, 
    title: 'Center for Government and International Studies',
    sid: 'FXNqoAZ3SHA',
    description: 'The Center for Government and International Studies unites the Government Department, faculty of the History Department who have international research interests, and many of the international research centers in the Faculty of Arts and Sciences at Harvard. \
    The complex is designed to promote lively, interdisciplinary exchange among faculty, students, and visitors from around the world.'
  },
  {
    position: { lat: 42.37202569383172, lng: -71.11804970916374 }, 
    title: 'Lowell House',
    sid: 'Gb7TzfTuCoV',
    description: 'Lowell House is one of twelve undergraduate residential Houses at Harvard University, located at 10 Holyoke Place facing Mount Auburn Street between Harvard Yard and the Charles River. \
    Lowell House is simultaneously close to the Yard, Harvard Square, and other Harvard "River" houses, and its blue-capped bell tower, visible for many miles, is a local landmark.'
  },
  {
    position: { lat: 42.37471210920963, lng: -71.11494780740425 }, 
    title: 'Robinson Hall',
    sid: 'GycExKiYVFp',
    description: 'Harvard has finished an eight-month renovation of Robinson Hall, the building housing the History Department, according to Associate Dean for Physical Resources and Planning Michael N. Lichten.'
  },
];

function buildCoordinatesArrayFromString(MultiGeometryCoordinates){
  var finalData = [];
  var grouped = MultiGeometryCoordinates.split("\n");

  grouped.forEach(function(item, i){
      let a = item.trim().split(',');

      finalData.push({
          lng: parseFloat(a[0]),
          lat: parseFloat(a[1])
      });
  });

  return finalData;
}

let kmlData = `-71.1220282,42.3764639
-71.1222206, 42.3765968
-71.1235832,42.3762798
-71.1242054,42.3760975
-71.1244951,42.375939
-71.1247955,42.3750909
-71.1234598,42.3747382
-71.1231486,42.3744608
-71.1241572,42.3738069
-71.1229566,42.3733452
-71.1233107,42.3728537
-71.1243997,42.371962
-71.1218033,42.3706463
-71.1224256,42.3698536
-71.1214814,42.3697743
-71.1193357,42.3698377
-71.118134,42.3696951
-71.1172757,42.3692036
-71.1162672,42.3677768
-71.1146901,42.3677451
-71.1146364,42.3693304
-71.1134348,42.3692432
-71.1133168,42.3700121
-71.1161703,42.3709632
-71.1155266,42.3715022
-71.1155695,42.372168
-71.1147112,42.3714705
-71.114282,42.3719778
-71.1134666,42.3718509
-71.1123508,42.3737532
-71.1133808,42.3741337
-71.1126941,42.3752116
-71.1124366,42.3768602
-71.1115354,42.3771138
-71.1123508,42.37965
-71.1113638,42.37965
-71.1111921,42.3807595
-71.1120933,42.3814886
-71.1141318,42.3803474
-71.1144966,42.3807595
-71.1163419,42.3808229
-71.1159986,42.3836125
-71.1194318,42.3838661
-71.1195606,42.3825981
-71.1201185,42.3776686
-71.1191958,42.3751482
-71.1220282,42.3764639`
