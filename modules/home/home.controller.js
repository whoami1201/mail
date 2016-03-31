angular.module('home.module').controller('HomeController', ['$scope', '$timeout', '$q', '$window', 'HomeService','AuthService', "GOOGLE_CLIENT_ID", HomeController]);

function HomeController($scope, $timeout, $q, $window, HomeService, AuthService, GOOGLE_CLIENT_ID){
  $scope.signOut = signOut;
  $scope.profileSrc = 'img/profile-placeholder.png';
  $scope.loadingStatus = "Loading..."
  $scope.loadMoreStatus = ""
  $scope.loadMore = loadMore;

  var userProfile = {};

  init();

  /*
  * INITIALIZE
  */
  function init() {
    HomeService.clear();
    userProfile = AuthService.getGoogleUser().getBasicProfile(); 
    $scope.firstName = userProfile.getGivenName();
    $scope.email = userProfile.getEmail();
    if (userProfile.getImageUrl()) {
      $scope.profileSrc = userProfile.getImageUrl();
    }
    HomeService.loadGmailApi('');
    addToMessageList();
  }

  /*
  * Populates message list
  */
  function addToMessageList() {
    $timeout(function() {
      $scope.messageList = sortDate(HomeService.messageList);
      $scope.loadingStatus = '';
      $scope.loadMoreStatus = "Load More Messages"
    }, 2000);
  }

  /*
  * Load more function
  */
  function loadMore() {
    $scope.loadMoreStatus = "Loading...";
    HomeService.loadGmailApi(HomeService.nextPageToken);
    addToMessageList();
  }


  /*
  * Date sort helper function
  */
  function sortDate(list) {
    var returnList = 
      list.sort(function(a,b){
        var a = new Date(a.date);
        var b = new Date(b.date);
        if (a<b){
          return 1;
        } else if (a>b) {
          return -1;
        } else {
          return 0;
        }
      })
    return returnList;
  }

  /*
  * SIGN OUT
  */
  function signOut(){
    AuthService.signOut();
  }

};
