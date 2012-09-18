var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;

exports.init = init;

function init() {
  console.log(localStorage['artistURIs']);
  if(!localStorage['sessionKey'] || !localStorage['userName']){
    tabSelection('settings');
  }
  else if(localStorage['recommendedArtists']){
    $("#artists").html(localStorage['recommendedArtists']);
  }
  tabs();
  models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
  
}

function getArtists(){
  var artistURIs = {};
  var recommended = getRecommendedArtists();
  $("#artists").html("");
  recommended.forEach(function(artist){
      var row = "<tr>";
      var uri;
      var name = artist.name.replace(/ /g,"").replace("&","")
      row += '<td><input type="checkbox" style="-webkit-appearance: checkbox !important;" name="'
        +name+'" value="'+artist.name+'" id="'+name+'"></td>'
      row += "<td>" + artist.name + "</td>";

      search = new models.Search("artist:"+artist.name);
      search.observe(models.EVENT.CHANGE, function(){
        //get the artist from the search
        artist = search.artists['0'];
        var artist_data = artist['data'];
        //toss in the link to the artist
        uri = artist_data['uri'];
        row += '<td><a href="' + uri +'">find</a></td>';
        var uris = artistURIs;
        uris[name] = uri;
      });
      search.appendNext();
      $("#artists").append(row);
    });
    localStorage['recommendedArtists'] = $("#artists").html();
    localStorage['artistURIs'] = JSON.stringify(artistURIs);
}

function tabs(){
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
