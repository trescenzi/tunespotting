var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;

exports.init = init;

function init() {
  if(!localStorage['sessionKey'] || !localStorage['userName']){
    tabSelection('settings');
  }
  else if(localStorage['recommendedArtists']){
    $("#artists").html(localStorage['recommendedArtists']);
  }
  tabs();
  models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);

  //if the form has been submitted
  if(window.location.href.indexOf('?') != -1)
    generatePlaylist();
  
}

function displayArtists(){
  var recommended = getRecommendedArtists();
  $("#artists").html("");
  recommended.forEach(
    function(artist){
      var row = "<tr>";
      var uri;
      var sanatizedArtist = artist.name.replace(/ /g,"").replace("&","")
      row += '<td><input type="checkbox" style="-webkit-appearance: checkbox !important;" name="'
        +artist.name+'" value="'+artist.name+'" id="'+sanatizedArtist+'"></td>'
      row += "<td>" + artist.name + "</td>";

      search = new models.Search("artist:"+artist.name);
      search.observe(models.EVENT.CHANGE, function(){
        //get the artist from the search
        artist = search.artists['0'];
        artist_data = artist['data'];
        //toss in the link to the artist
        uri = artist_data['uri'];
        row += '<td><a href="' + uri +'">find</a></td>';
        
      });
      search.appendNext();
      $("#artists").append(row);

      $("#"+sanatizedArtist).val(artist_data['uri']);
    });
    localStorage['recommendedArtists'] = $("#artists").html();
    console.log(localStorage['recommendedArtists']);
}

function generatePlaylist(){
  var artists = parseGetResponse(window.location.href);
  fixURIs(artists);
  getArtists(artists);
  console.log(artists);
}

function getArtists(artists){
  for(key in artists){
    if(key != "length")
    Artist.fromURI(artists[key], function(artist){
      var name = artist.name.replace(/ /g,'').toLowerCase();
      artists[name] = artist;
    })
  }
}

function fixURIs(artists){
  for(key in artists){
    if(key != "length"){
      var uri = artists[key];
      uri = uri.replace(/%3/g, "/");
      artists[key] = uri;
    }
  }
}

function tabs(){
  // window.location = "spotify:app:tunespotting";
  var args = models.application.arguments;
  $(".section").hide();
  $("#"+args[0]).show();
  console.log(args);
}

function tabSelection(tab){
    window.location = "spotify:app:tunespotting:"+tab;
}

function getRequest(url){
  var request = new XMLHttpRequest();

  request.open("GET", url, false);
  console.log(url);
  request.send();
  return request.responseText;
}

function parseGetResponse(response){
  var splitUrl = response.split("?")[1].split("&");
  var variables = {length:0};
  for(var i=0; i<splitUrl.length; i += 1){
    var broken = splitUrl[i].split("=");
    var key=broken[0].replace(/\+/g,'').toLowerCase();
    var value = broken[1];
    variables[key] = value;
    variables["length"] += 1;
  }
  return variables;
}
