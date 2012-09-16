var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;

exports.init = init;

function init() {
  tabs();
  if(!localStorage['sessionKey'] || !localStorage['userName'])
    tabSelection('settings');
}

models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);

function displayArtists(){
  var recommended = getRecommendedArtists();
  
}

function tabs() {
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
  var variables = new Array();
  for(var i=0; i<splitUrl.length; i += 1){
    var broken = splitUrl[i].split("=");
    variables[broken[0]] = broken[1];
  }
  return variables;
}

