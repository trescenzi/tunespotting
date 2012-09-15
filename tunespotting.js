var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;
var Artist = models.Artist;
var lastFMAPIRoot = "http://ws.audioscrobbler.com";
var auth = sp.require('sp://import/scripts/api/auth');

var lastFMKey='ce896902c7da0790956cec280a9c1df4';
var lastFMSecret = 'f3038a88a51bfc660a7a527f055472c0';
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

    onComplete : function() { 
      getLastFMSession(); 
    }
});
}

function getLastFMSession(){
  var apiCall = buildLastFMAPICall("auth.getSession", true);
  var response = JSON.parse(getRequest(apiCall));
  console.log(response);
  localStorage['sessionKey'] = response['session']['key'];
  console.log(localStorage['sessionKey']);

}

function buildLastFMAPICall(method, auth, more){
  var apiCall = lastFMAPIRoot + "/2.0/?method=" + method + "&";
      apiCall += "api_key=" + lastFMKey +"&";
      
      if(more)
      for(var i = 0; i<more.length; i += 1){
        apiCall += more[i] + "&";
      }

      if(auth){
        apiCall +=  "token=" + localStorage['lastFMToken'] + "&";
        apiCall += "api_sig=" + lastFMSig(apiCall) +"&";
      }
      //format is not part of the sig
      apiCall += "format=json&"; 
  return apiCall;
}

function lastFMSig(url){
  //order the paramaters being sent
  var params = url.split("?")[1].split("&").sort();
  
  var sig = "";

  //remove the '=' and smash the whole thing together
  for(var i = 0; i<params.length; i += 1){
    sig += params[i].replace("=" , "");
  }

  sig += lastFMSecret;

  return $.md5(sig);
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

