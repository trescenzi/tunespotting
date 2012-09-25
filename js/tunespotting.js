var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;
var Artists = {};
var views = sp.require('sp://import/scripts/api/views');
var ui = sp.require("sp://import/scripts/ui");
exports.init = init;

function init() {
  //localStorage.clear();

  if(!localStorage['sessionKey'] || !localStorage['userName']){
    tabSelection('settings');
  }
  else if(localStorage['recommendedArtists']){
    $("#artists").html(localStorage['recommendedArtists']);
    Artists = urisToArtists(JSON.parse(localStorage['artistURIs']));
  }
  tabs();
  models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
  
}

function displayArtists(){
  getArtists();
  Artists = urisToArtists(JSON.parse(localStorage['artistURIs']));
  buildArtistHTML();
}

function getArtists(){
  var artistURIs = {};
  var recommended = getRecommendedArtists();
  recommended.forEach(function(artist){
      search = new models.Search("artist:"+artist.name);
      search.observe(models.EVENT.CHANGE, function(){
        //get the artist from the search
        artist = search.artists['0'];
        var artist_data = artist['data'];
        //toss in the link to the artist
        uri = artist_data.uri;
        artistURIs[artist_data.name] = uri;
      });
      search.appendNext();
    });
    localStorage['artistURIs'] = JSON.stringify(artistURIs);
}

function buildArtistHTML(){
  $("#column0").html("");
  $("#column1").html("");
  $("#column2").html("");
  var i = 0;
  for(artist in Artists){
    var uri = Artists[artist].data.uri;
    var name = Artists[artist].data.name;
    var sanatizedName = name.replace(/ /g, '');
    var image = imageDrawing(Artists[artist]);
    if(image.style.background != ""){
      console.log(image.style.background-image);
      $("#column" + i%3).append(image);
    }

    //Greg I hope you're happy because I know I'm not
    i += 1;
  }
  localStorage['recommendedArtists'] = $("#artists").html();
}

function urisToArtists(uris){
  var artists = {};
  for(artist in uris){
    var spotArt = Artist.fromURI(uris[artist], function(artist) {
      artists[artist.name] = artist;
    });
  }
  return artists;
}

function imageDrawing(artist){
  var image = new ui.SPImage(artist.data.portrait);
  console.log(image.node.style.background);
  //image.node.style.background = 'no-repeat';
  return image.node;
}

function tabs(){
  var args = models.application.arguments;
  $(".section").hide();
  $("#"+args[0]).show();
}

function tabSelection(tab){
  window.location = "spotify:app:tunespotting:"+tab;
}

function getRequest(url){
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send();
  return request.responseText;
}

function parseGetResponse(response){
  var splitUrl = response.split("?")[1].split("&");
  var variables = {};
  splitUrl.forEach(
    function(variable){
      var broken = variable.split("=");
      var key=broken[0];
      var value = broken[1];
      variables[key] = value;
    });
  return variables;
}
