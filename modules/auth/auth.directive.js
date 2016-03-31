angular.module('auth.module')
  .directive('googleSignin', ['$window', '$timeout', 'GOOGLE_CLIENT_ID', 'AuthService', function ($window, $timeout, GOOGLE_CLIENT_ID, AuthService) {
    
      return {
          restrict: 'E',
          transclude: true,
          template: '<span></span>',
          replace: true,
          link: function (scope, element, attrs, ctrl, linker) {
            var defaults = {
                onsuccess: AuthService.signIn,
                cookiepolicy: 'single_host_origin',
                onfailure: AuthService.onSignInFailure,
                scope: 'profile email',
                width: '285px',
                longtitle: true,
                theme: 'light'
            };
            gapi.signin2.render(element[0], defaults);
          }
      }
  }]);
