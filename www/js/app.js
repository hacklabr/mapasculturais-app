// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mapasculturais', [
    'ionic',
    'mapasculturais.controllers',
    'mapasculturais.routes',
    'mapasculturais.services',
    'mapasculturais.directives',
    'mapas.service',
    'ngStorage',
    'ngCordova',
])

.run(function($ionicPlatform, $ionicPopup, IsFirstRun, $state) {

  $ionicPlatform.ready(function() {

    if(window.FirebasePlugin) {
      window.FirebasePlugin.onNotificationOpen(function(notification) {

            if (notification.event_id) {
              document.location.href = "#/app/event/" + notification.event_id;
            }

      }, function(error) {
            //console.log(error);
      });
    }

    if(IsFirstRun.isFirstRun()) {
      $state.go('menu.linguagens');
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.views.forwardCache(true);
//    $ionicConfigProvider.views.maxCache(0);

});
