angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('events', {
    url: '/events',
    views: {
      'side-menu21': {
        templateUrl: 'templates/events.html',
        controller: 'eventsCtrl'
      }
    }
  })

  .state('spaces', {
    url: '/spaces',
    views: {
      'side-menu21': {
        templateUrl: 'templates/spaces.html',
        controller: 'spacesCtrl'
      }
    }
  })

  .state('map', {
    url: '/map',
    views: {
      'side-menu21': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('about', {
    url: '/about',
    views: {
      'side-menu21': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('starred', {
    url: '/starred',
    templateUrl: 'templates/starred.html',
    controller: 'starredCtrl'
  })

  .state('messages', {
    url: '/messages',
    templateUrl: 'templates/messages.html',
    controller: 'messagesCtrl'
  })

$urlRouterProvider.otherwise('/side-menu21/events')



});
