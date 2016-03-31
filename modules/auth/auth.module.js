angular.module('auth.module', [])
  .constant('USER_SCOPES', {
    gmail_read: 'https://www.googleapis.com/auth/gmail.readonly',
    gmail_labels: 'https://www.googleapis.com/auth/gmail.labels'
  });