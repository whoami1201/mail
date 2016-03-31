angular.module('auth.module').controller('AuthController', ['$scope', '$window', 'AuthService', "GOOGLE_CLIENT_ID",AuthController]);

function AuthController($scope, $window, AuthService, GOOGLE_CLIENT_ID){
  $scope.signIn = signIn;
  $scope.signOut = signOut;


  function signIn(){
    AuthService.signIn();
  }

  function signOut(){
    AuthService.signOut();
  }
};
