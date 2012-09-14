var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;
var lastFMAPIRoot = "http://ws.audioscrobbler.com";

var lastFMKey='ce896902c7da0790956cec280a9c1df4';

exports.init = init;


function init() {
}


function getLastFMAuthToken(){
  var apiCall = "/2.0/?method=auth.gettoken&api_key="+lastFMKey+"&format=json";
  var url = lastFMAPIRoot+apiCall;
  return getRequest(url);
}

function lastFMAuth(){
  var token = JSON.parse(getLastFMAuthToken());
  console.log(token);
  if(localStorage['userPermission?'] != true)
    getLastFMUserPermission(token);
}

function getLastFMUserPermission(token){
  //url should look like:
  //http://www.last.fm/api/auth/?api_key=xxxxxxxxxxx&token=xxxxxxxx
  var url = "http://www.last.fm/api/auth/?api_key="+lastFMKey+"&token="+token['token'];
  getRequest(url);
}

function getLastFMUserName(){
  return localStorage['lastFMUserName'];
}

function setLastFMUserName(){
  localStorage['lastFMUser'] = $('[name=username]').val();
}


function getRequest(url){
  var request = new XMLHttpRequest();

  request.open("GET", url, false);
  console.log(url);
  request.send();
  return request.responseText;
}
