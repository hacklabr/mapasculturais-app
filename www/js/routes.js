angular.module('mapasculturais.routes', [])

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

  .state('menu.events', {
    url: '/events',
    views: {
      'side-menu21': {
        templateUrl: 'templates/events.html',
        controller: 'eventsCtrl'
      }
    }
  })

  .state('menu.spaces', {
    url: '/spaces',
    views: {
      'side-menu21': {
        templateUrl: 'templates/spaces.html',
        controller: 'spacesCtrl'
      }
    }
  })

  .state('menu.map', {
    url: '/map',
    views: {
      'side-menu21': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('menu.about', {
    url: '/about',
    views: {
      'side-menu21': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('menu.starred', {
    url: '/starred',
    views: {
      'side-menu21': {
        templateUrl: 'templates/starred.html',
        controller: 'starredCtrl'
      }
    }
  })

  .state('menu.messages', {
    url: '/messages',
    views: {
      'side-menu21': {
        templateUrl: 'templates/messages.html',
        controller: 'messagesCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/events')



});
