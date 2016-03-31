angular.module('home.module')
.factory('HomeService', [ '$rootScope', '$state','$http', '$q', "USER_SCOPES", "GOOGLE_CLIENT_ID", HomeService ]);

function HomeService($rootScope, $state, $http, $q, USER_SCOPES, GOOGLE_CLIENT_ID){
  var HomeService = {};
  
  HomeService.messageList = [];
  HomeService.loadGmailApi = loadGmailApi;
  HomeService.clear = clear;
  HomeService.nextPageToken = '';

  function clear(){
    HomeService.messageList = [];
  }

  function loadGmailApi(pageToken) {
    gapi.client.load('gmail', 'v1', function () {
      listMessages(pageToken, getMessagesContent);
    });
  }

  function listMessages(pageToken, callback) {
    var load = {
      'userId': 'me',
      'labelIds': [ "INBOX" ],
      'maxResults': 20
    }
    if (pageToken != '') {
      load.pageToken = pageToken;
    }
    var request = gapi.client.gmail.users.messages.list(load);
    callback(request);
  }

  function getMessagesContent(request) {
    request.execute(function(response) {
      HomeService.nextPageToken = response.nextPageToken;
      angular.forEach(response.messages, function(message) {
        var messageRequest = gapi.client.gmail.users.messages.get({
          'userId': 'me',
          'id': message.id
        });
        messageRequest.execute(parseMessage);
      });
    });
  }

  function parseMessage(message){
    var headerFrom = getHeader(message.payload.headers, 'From');
    var headerSubject = getHeader(message.payload.headers, 'Subject');
    var headerDate = getHeader(message.payload.headers, 'Date');
    var body = getBody(message.payload);

    HomeService.messageList.push({
      'id': message.id,
      'from': headerFrom,
      'subject': headerSubject,
      'date': headerDate,
      'body': body
    });
  }

  function getHeader(headers, index) {
    var resultHeader = '';

    angular.forEach(headers, function(header){
      if(header.name === index){
        resultHeader = header.value;
      }
    });
    return resultHeader;
  }

  function getBody(message) {
    var encodedBody = '';
    if(typeof message.parts === 'undefined'){
      encodedBody = message.body.data;
    } else {
      encodedBody = getHTMLPart(message.parts);
    }
    encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    return decodeURIComponent(escape(window.atob(encodedBody)));
  }

  function getHTMLPart(arr) {
    for(var x = 0; x <= arr.length; x++){
      if(typeof arr[x].parts === 'undefined')
      {
        if(arr[x].mimeType === 'text/html'){
          return arr[x].body.data;
        }
      } else {
        return getHTMLPart(arr[x].parts);
      }
    }
    return '';
  }


  return HomeService;
}