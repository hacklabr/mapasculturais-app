function classificacao(event) {
  if (!event) {
    return false;
  }
  switch (event.classificacaoEtaria) {
    case 'Livre':
      return 'clivre';

    case '18 anos':
      return 'c18';

    case '16 anos':
      return 'c16';

    case '14 anos':
      return 'c14';

    case '12 anos':
      return 'c12';

    case '10 anos':
      return 'c10';
  }
}
angular.module('mapasculturais.controllers', [])

  .controller('eventsCtrl', [
    '$scope', 'mapas.service.event', 'FavoriteEvents', 'ConfigState',
    function($scope, eventApi, FavoriteEvents, config) {
      var api = eventApi(config.dataSource.url);
      var _limit = 25;
      var _page = 1;
      var _endData = false;
      var _lastGroup = null;
      var _now = moment().format('X');

      $scope.groups = [];
      $scope.notFound = false;

      $scope.filters = {};


      $scope.moreDataCanBeLoaded = function() {
        return !_endData;
      }

      $scope.loadMore = function() {
        var events, from;
        var params = {
          '@limit': _limit,
          '@page': _page
        };

        if ($scope.filters.showPast || ($scope.filters.from && moment($scope.filters.from).toDate() > moment().toDate())) {
          from = $scope.filters.from;
        } else {
          from = moment().toDate();
        }

        if ($scope.filters.keyword) {
          params['@keyword'] = '%' + $scope.filters.keyword + '%';
        }

        if ($scope.filters.linguagem) {
          params['term:linguagem'] = $IN($scope.filters.linguagem);
        }

        if ($scope.filters.verified) {
          params['isVerified'] = $EQ('true');
        }

        if ($scope.findFunction) {
          var entityId = $scope.findEntityId;
          events = api[$scope.findFunction](entityId, from, $scope.filters.to, params);
        } else {
          events = api.find(from, $scope.filters.to, params);
        }

        _page++;

        events.then(function(rs) {
          var happening = [];

          if (rs.length < _limit) {
            _endData = true;
          }

          if (_page === 2 && rs.length === 0) {
            $scope.notFound = true;
            return;
          }

          rs.forEach(function(event) {
            event.favorite = FavoriteEvents.isFavorite(event);
          });

          // remove os eventos antigos
          if (!$scope.filters.showPast) {
            happening = rs.filter(function(r) {
              var end = r.end.format('X');
              var start = r.start.format('X');

              if (start < _now && end > _now) {
                return r;
              }
            });

            rs = rs.filter(function(r) {
              var start = r.start.format('X');

              if (start > _now) {
                return r;
              }
            });
          }

          var _groups = api.group('YYYY-MM-DD HH:mm', rs);

          if (happening.length > 0) {
            _groups.unshift({
              happening: true,
              events: happening
            });
          }
          _groups.forEach(function(grp) {
            if (_lastGroup && (_lastGroup.happening && grp.happening || _lastGroup.date && grp.date && _lastGroup.date.format('YYYY-MM-DD HH:mm') === grp.date.format('YYYY-MM-DD HH:mm'))) {
              grp.events.forEach(function(event) {
                _lastGroup.events.push(event);
              });
            } else {
              $scope.groups.push(grp);
            }
            _lastGroup = grp;
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');

        });
      };

      $scope.applyFilters = function($event) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.groups = [];
        $scope.notFound = false;
        _page = 1;
        _endData = false;

        document.activeElement.blur();
      }

      $scope.dividerText = function(group) {
        var numDays = 6;
        if (group.happening) {
          return "Acontecendo agora";
        } else if (group.date.format('X') < moment().add(numDays, 'days').format('X')) {
          return group.date.calendar();
        } else {
          return group.date.format('LLL');
        }
      }

      $scope.classificacao = classificacao;

      $scope.favorite = FavoriteEvents.favorite
    }
  ])

  .controller('LinguagensCtrl', function($window, $state, $localStorage, $scope) {
    console.log("Got into ctrl Linguagens");
    $scope.linguagens = $localStorage.linguagens;

    $scope.salvarPreferencias = function() {
      $localStorage.linguagens = [];
      var elements = document.getElementsByClassName("tags");
      angular.forEach(elements, function(element, index) {
        $localStorage.linguagens.push({
          "term": element.value,
          "checked": element.checked
        });

        if (element.checked === true) {
          window.FirebasePlugin.subscribe(element.value);
        } else {
          window.FirebasePlugin.unsubscribe(element.value);
        }
      });

      $window.history.back();
    }
  })

  .controller('eventCtrl', [
    '$scope', '$stateParams', 'mapas.service.event', 'FavoriteEvents', 'ConfigState',
    function($scope, $stateParams, eventApi, FavoriteEvents, config) {
      var api = eventApi(config.dataSource.url);
      api.util.applyMe.apply($scope);

      $scope.entity = null;

      $scope.shareButton = false;

      api.findOne({
        id: $EQ($stateParams.entity)
      }).then(function(entity) {
        $scope.entity = entity;

        if (window.plugins) {
          var eventMessage, eventTitle, eventId;
          eventTitle = $scope.entity.name;
          eventMessage = $scope.entity.shortDescription;
          eventId = $scope.entity.id;

          if (eventMessage.length > 50)
            eventMessage = eventMessage.substring(0, 50) + '...';

          $scope.shareButton = true;

          $scope.shareActionButton = function() {
            var options = {
              message: eventMessage, // not supported on some apps (Facebook, Instagram)
              subject: '', // fi. for email
              files: ['', ''], // an array of filenames either locally or remotely
              url: 'http://estadodacultura.sp.gov.br/evento/' + eventId,
              chooserTitle: eventTitle // Android only, you can override the default share sheet title
            }

            var onSuccess = function(result) {
              console.log("Share completed? " + result.completed);
              console.log("Shared to app: " + result.app);
            }

            var onError = function(msg) {
              console.log("Sharing failed with message: " + msg);
            }

            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
          };
        }

      });

      $scope.favorite = FavoriteEvents.favorite;

      $scope.classificacao = classificacao;

    }
  ])

  .controller('spacesCtrl', [
    '$scope', 'MenuState', 'mapas.service.space', 'ConfigState',
    function($scope, MenuState, spaceApi, config) {
      var api = spaceApi(config.dataSource.url);
      var _limit = 25;
      var _page = 1;
      var _endData = false;

      api.util.applyMe.apply($scope);

      MenuState.activeMenu('spaces');

      $scope.entities = [];

      $scope.filters = {};

      $scope.$watch('filters', function() {
        $scope.entities = [];
        _page = 1;
        _endData = false;
      });

      $scope.moreDataCanBeLoaded = function() {
        return !_endData;
      }

      $scope.loadMore = function() {
        var params = {
          '@limit': _limit,
          '@page': _page,
          '@order': 'name ASC',
          '@select': api._select + ',endereco'
        };

        if ($scope.filters.keyword) {
          params['@keyword'] = '%' + $scope.filters.keyword + '%';
        }

        if ($scope.filters.area) {
          params['term:area'] = $IN($scope.filters.area);
        }

        if ($scope.filters.type) {
          params['type'] = $IN($scope.filters.type);
        }

        _page++;

        api.find(params).then(function(rs) {
          if (rs.length < _limit) {
            _endData = true;
          }

          if (_page === 2 && rs.length === 0) {
            $scope.notFound = true;
            return;
          }

          rs.forEach(function(entity) {
            $scope.entities.push(entity);
          });

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      $scope.applyFilters = function($event) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.entities = [];
        $scope.notFound = false;
        _page = 1;
        _endData = false;

        document.activeElement.blur();
      }
    }
  ])

  .controller('spaceCtrl', [
    '$scope', '$stateParams', 'mapas.service.space', 'mapas.service.event', 'ConfigState',
    function($scope, $stateParams, spaceApi, eventApi, config) {
      var api = spaceApi(config.dataSource.url);
      api.util.applyMe.apply($scope);

      $scope.entity = null;

      api.findOne({
        id: $EQ($stateParams.entity)
      }).then(function(entity) {
        $scope.entity = entity;
      });
    }
  ])

  .controller('agentCtrl', [
    '$scope', '$stateParams', 'mapas.service.agent', 'mapas.service.event', 'ConfigState',
    function($scope, $stateParams, agentApi, eventApi, config) {
      var api = agentApi(config.dataSource.url);
      api.util.applyMe.apply($scope);

      $scope.entity = null;

      api.findOne({
        id: $EQ($stateParams.entity)
      }).then(function(entity) {
        $scope.entity = entity;
      });
    }
  ])

  .controller('projectCtrl', [
    '$scope', '$stateParams', 'mapas.service.project', 'mapas.service.event', 'ConfigState',
    function($scope, $stateParams, projectApi, eventApi, config) {
      var api = projectApi(config.dataSource.url);
      api.util.applyMe.apply($scope);

      $scope.entity = null;

      api.findOne({
        id: $EQ($stateParams.entity)
      }).then(function(entity) {
        $scope.entity = entity;
      });
    }
  ])


  .controller('mapCtrl', ['$scope', '$ionicPlatform', 'MapState', 'mapas.service.space', 'ConfigState', function($scope, $ionicPlatform, MapState, spaceApi, config) {
    var api = spaceApi(config.dataSource.url);
    var map;
    var from = moment().toDate()
    var to = moment().add(1, 'months').toDate();

    api.util.applyMe.apply($scope);

    var _spaces = api.findByEvents(from, to, {
      '@select': 'id,name,location,endereco,type,terms'
    });

    $ionicPlatform.ready(function() {

      var map_wrapper = angular.element(document.querySelector("#map-wrapper"));
      $scope.frameHeight = map_wrapper[0].clientHeight;

      // Getting the map selector in DOM
      var div = document.getElementById("map_canvas");

      // Invoking Map using Google Map SDK v2 by dubcanada
      MapState.initialize(div)


      // Capturing event when Map load are ready.
      MapState.setReadyCallback(function() {
        _spaces.then(function(spaces) {
          spaces.forEach(function(space) {
            var pin = {
              title: space.name,
              snippet: "endereço: " + space.endereco + "\n" +
                "tipo: " + space.type.name + "\n" +
                "área de atuação: " + space.terms.area.join(', '),
              visible: true,
              position: new plugin.google.maps.LatLng(
                space.location.latitude,
                space.location.longitude),

              styles: {
                maxWidth: "90%"
              }
            };
            MapState.addMarker(pin, function(marker) {
              space.marker = marker;
            }, function() {
              document.location.hash = '/app/space/' + space.id;
            });
          });
        });
      });

      // Function that return a LatLng Object to Map
      // function setPosition(lat, lng) {
      //     return new plugin.google.maps.LatLng(lat, lng);
      // }
    });
  }])

  .controller('aboutCtrl', function($scope) {
    try {
      cordova.getAppVersion(function(version) {
        $scope.version = version;
      })
    } catch (e) {
      console.log(e);
    }
  })

  .controller('configCtrl', function($state, $scope, FavoriteEvents, ConfigState, MapState, $window) {
    $scope.dataSourceConfigurable = ConfigState.dataSourceConfigurable;
    $scope.dataSources = ConfigState.dataSources;
    $scope.config = {
      prefix: ConfigState.dataSource.prefix
    };

    $scope.apply = function() {
      ConfigState.defineDataSource($scope.config.prefix);
      $scope.url = ConfigState.dataSource.url;
      MapState.reset();
      $window.location.reload(true)
    };
    $scope.url = ConfigState.dataSource.url;

    $scope.clearFavorites = function() {
      if (confirm('Você está certo de que deseja apagar todos os seus eventos favoritados?'))
        FavoriteEvents.clear();
    };

    $scope.goToLinguagens = function() {
      $state.go('menu.linguagens');
    };
  })

  .controller('favoritesCtrl', ['$scope', 'MenuState', 'FavoriteEvents', function($scope, MenuState, FavoriteEvents) {
    $scope.events = FavoriteEvents.favorites;
    $scope.favorite = FavoriteEvents.favorite;
  }])

  .controller('messagesCtrl', function($scope) {

  })

  .controller('navCtrl', function($scope, ConfigState, MenuState, $location, $timeout, $ionicLoading, $window) {

    $scope.show_filter_search_menu = true;
    $scope.show_share_buttom = false;

    $scope.openMenuMore = function() {
      $scope.showMenuMore = true;
    };

    $scope.closeMenuMore = function() {
      $scope.showMenuMore = false;
    };

    $scope.toggleMenuMore = function($event) {
      $scope.showMenuMore = $scope.showMenuMore ? false : true;
      $event.stopPropagation();
    };

    angular.element($window).on('click', function(e) {
      $scope.closeMenuMore();
      $scope.$apply();
    });

    function activeMenu(toState) {
      switch (toState.name) {
        case 'menu.spaces':
          MenuState.activeMenu('spaces');
          break;
        case 'menu.space':
          MenuState.activeMenu('spaces');
          break;

        case 'menu.agents':
          MenuState.activeMenu('agents');
          break;
        case 'menu.agent':
          MenuState.activeMenu('agents');
          break;

        case 'menu.projects':
          MenuState.activeMenu('projects');
          break;
        case 'menu.project':
          MenuState.activeMenu('projects');
          break;

        case 'menu.events':
          MenuState.activeMenu('events');
          break;
        case 'menu.event':
          MenuState.activeMenu('events');
          break;

        case 'menu.map':
          MenuState.activeMenu('map');
          break;

        case 'menu.favorites':
          MenuState.activeMenu('favorites');
          break;

        case 'menu.about':
          MenuState.activeMenu('about');
          break;

        case 'menu.config':
          MenuState.activeMenu('about');
          break;

      }
    }

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      // var new_location_path = newVal.split('#')[1];
      // var old_location_path = oldVal.split('#')[1];

      activeMenu(toState);

      if (toState.name == 'menu.events') {
        $scope.show_filter_search_menu = true;
      } else {
        $scope.show_filter_search_menu = false;
      }
      $ionicLoading.show();
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      activeMenu(toState);
      $ionicLoading.hide();
    });
  })
