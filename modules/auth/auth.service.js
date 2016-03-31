angular.module('auth.module')
  .factory('AuthService', [ '$rootScope', '$state','$timeout', '$http', '$window', '$q', "USER_SCOPES", "GOOGLE_CLIENT_ID",AuthService ]);

function AuthService($rootScope, $state, $timeout, $http, $window, $q, USER_SCOPES, GOOGLE_CLIENT_ID){
  var AuthService = {};

  AuthService.signIn = signIn;
  AuthService.signOut = signOut;
  AuthService.init = init;
  AuthService.getGoogleUser = getGoogleUser;
  AuthService.verifyUser = verifyUser;
  AuthService.gapi;


  /*
  * INITIALIZE
  */
  function init(callback){

    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:platform.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);

    po.onload = function () {
        gapi.load('auth2', function () {

          AuthService.gapi = gapi.auth2.init({
              client_id: GOOGLE_CLIENT_ID,
              cookie_policy: 'single_host_origin'
          });

          callback();

        });
    };
  }


  /*
  * SIGN IN
  */
  function signIn(){
    gapi.auth.authorize(
      {
        'client_id': GOOGLE_CLIENT_ID,
        'scope': USER_SCOPES.gmail_read,
        'immediate': false
      }, handleAuthResult);
  }


  /*
  * SIGN OUT
  */
  function signOut() {
    // var auth2 = gapi.auth2.getAuthInstance();
    AuthService.gapi.signOut().then(function () {
      $state.go('login');
    });
  }


  /*
  * SIGN IN FAILURE
  */
  function onSignInFailure(authResult){
    console.log(authResult);
  }


  /*
  * AUTHORIZATION
  */
  function authorize(){
    gapi.auth.authorize(
      {
        'client_id': GOOGLE_CLIENT_ID,
        'scope': USER_SCOPES.gmail_read,
        'immediate': false
      }, handleAuthResult);
  }


  /*
  * HANDLES AUTHENTICATION
  */
  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      $state.go('home');
    } else {
      console.log(authResult);
    }
  }


  function verifyUser(view) {
    var defer = $q.defer();

    $timeout(function() {
      if (!AuthService.gapi) {
        init(verify);
      } else {
        verify();
      }

      function verify() {
        var allow = false;
        switch (view){
          case 'home':
            var fallback = 'login';
            break;
          case 'login':
            var fallback = 'home';
            break;
        }

        if (AuthService.gapi.isSignedIn.get()) {
          if (view != 'login') {
            allow = true;
          }
        } else if (view == 'login'){
          allow = true;
        }

        if (allow) {
          defer.resolve();
        }
        else {
          $state.go(fallback);
        }
      }
    }, 0);

    return defer.promise;
    
  }

  function getGoogleUser(){
    return AuthService.gapi.currentUser.get();
  }

  return AuthService;
}