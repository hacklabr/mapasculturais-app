angular.module('mapasculturais.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
    
    window.$stateProvider = $stateProvider;

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('menu', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.events', {
    url: '/events',
    views: {
      'app': {
        templateUrl: 'templates/events.html',
        controller: 'eventsCtrl'
      }
    }
  })
  
  .state('menu.event', {
    url: '/event/:entity',
    views: {
      'app': {
        templateUrl: 'templates/event.html',
        controller: 'eventCtrl'
      }
    }
  })

  .state('menu.spaces', {
    url: '/spaces',
    views: {
      'app': {
        templateUrl: 'templates/spaces.html',
        controller: 'spacesCtrl'
      }
    }
  })
  
  .state('menu.space', {
    url: '/space/:entity',
    views: {
      'app': {
        templateUrl: 'templates/space.html',
        controller: 'spaceCtrl'
      }
    }
  })
  
  .state('menu.agent', {
    url: '/agent/:entity',
    views: {
      'app': {
        templateUrl: 'templates/agent.html',
        controller: 'agentCtrl'
      }
    }
  })
  
  .state('menu.project', {
    url: '/project/:entity',
    views: {
      'app': {
        templateUrl: 'templates/project.html',
        controller: 'projectCtrl'
      }
    }
  })

  .state('menu.map', {
    url: '/map',
    views: {
      'app': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('menu.about', {
    url: '/about',
    views: {
      'app': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })
  
  .state('menu.config', {
    url: '/config',
    views: {
      'app': {
        templateUrl: 'templates/config.html',
        controller: 'configCtrl'
      }
    }
  })

  .state('menu.favorites', {
    url: '/favorites',
    views: {
      'app': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }
    }
  })

  .state('menu.messages', {
    url: '/messages',
    views: {
      'app': {
        templateUrl: 'templates/messages.html',
        controller: 'messagesCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/app/events')



});
