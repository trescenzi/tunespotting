var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;
var lastFMAPIRoot = "http://ws.audioscrobbler.com";
var auth = sp.require('sp://import/scripts/api/auth');

var lastFMKey='ce896902c7da0790956cec280a9c1df4';

exports.init = init;

function init() {
}

function authFM(){
auth.showAuthenticationDialog('http://www.last.fm/api/auth/?api_key=ce896902c7da0790956cec280a9c1df4',
 'http://176.58.109.98', {

    onSuccess : function(response) {
        // Response will be something like 'sp://my_app_name?token=xxxxxxx'
        var responses = parseGetResponse(response);
        localStorage['lastFMToken'] = responses['token'];
    },

    onFailure : function(error) {
        console.log("Authentication failed with error: " + error);
    },

    onComplete : function() { }
});
}

function getLastFMSession(){
  var apiCall = "/2.0/?method=auth.gettoken&";
}

function test(){
  console.log(localStorage['lastFMToken']);
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
  for(var i=0; i<splitUrl.length; i++){
    var broken = splitUrl[i].split("=");
    variables[broken[0]] = broken[1];
  }
  return variables;
}

