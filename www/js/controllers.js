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
        '$scope', 'mapas.service.event', 'FavoriteEvents', function ($scope, eventApi, FavoriteEvents) {
            var api = eventApi(window.config.url);
            var _limit = 25;
            var _page = 1;
            var _endData = false;
            var _lastGroup = null;
            var _now = moment().format('YMMDDHH') - 2;
            
            $scope.groups = [];
            $scope.notFound = false;

            $scope.filters = {};


            $scope.moreDataCanBeLoaded = function () {
                return !_endData;
            }

            $scope.loadMore = function () {
                var events;
                var params = {
                    '@limit': _limit,
                    '@page': _page
                };

                if($scope.filters.keyword){
                    params['@keyword'] = '%' + $scope.filters.keyword + '%';
                }

                if($scope.filters.linguagem){
                    params['term:linguagem'] = $IN($scope.filters.linguagem);
                }

                if($scope.filters.verified){
                    params['isVerified'] = $EQ('true');
                }

                if ($scope.findFunction) {
                    var entityId = $scope.findEntityId;
                    events = api[$scope.findFunction](entityId, $scope.filters.from, $scope.filters.to, params);
                } else {
                    events = api.find($scope.filters.from, $scope.filters.to, params);
                }

                _page++;

                events.then(function (rs) {
                    if (rs.length < _limit) {
                        _endData = true;
                    }
                    rs.forEach(function(event) {
                        event.favorite = FavoriteEvents.isFavorite(event);
                    })

                    if(_page === 2 && rs.length === 0){
                        $scope.notFound = true;
                    }

                    var _groups = api.group('YYYY-MM-DD HH:mm', rs);

                    _groups.forEach(function (e) {
                        if ($scope.filters.hidePast && e.date.format('YMMDDHH') < _now) {
                            return;
                        }

                        if (_lastGroup && _lastGroup.date.format('YYYY-MM-DD HH:mm') === e.date.format('YYYY-MM-DD HH:mm')) {
                            e.events.forEach(function (event) {
                                _lastGroup.events.push(event);
                            });
                        } else {
                            $scope.groups.push(e);
                        }
                        _lastGroup = e;
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                });
            };

            $scope.applyFilters = function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.groups = [];
                $scope.notFound = false;
                _page = 1;
                _endData = false;
            }

            $scope.showCalendar = function (group) {
                var numDays = 6
                return group.format('X') < moment().add(numDays, 'days').format('X')
            }

            $scope.classificacao = classificacao;

            $scope.favorite = FavoriteEvents.favorite
        }])

    .controller('eventCtrl', [
        '$scope', '$stateParams', 'mapas.service.event', 'FavoriteEvents', function ($scope, $stateParams, eventApi, FavoriteEvents) {
            var api = eventApi(window.config.url);
            api.util.applyMe.apply($scope);
            
            $scope.entity = null;

            api.findOne({id: $EQ($stateParams.entity)}).then(function (entity) {
                $scope.entity = entity;
            });

            $scope.favorite = FavoriteEvents.favorite;

            $scope.classificacao = classificacao;

        }])

    .controller('spacesCtrl', [
        '$scope', 'MenuState', 'mapas.service.space', function ($scope, MenuState, spaceApi) {
            var api = spaceApi(window.config.url);
            var _limit = 50;
            var _page = 1;
            var _endData = false;

            api.util.applyMe.apply($scope);
            
            MenuState.activeMenu('spaces');

            $scope.entities = [];

            $scope.filters = {
                keyword: ''
            };

            $scope.$watch('filters', function () {
                $scope.entities = [];
                _page = 1;
                _endData = false;
            });

            $scope.moreDataCanBeLoaded = function () {
                return !_endData;
            }

            $scope.loadMore = function(){
                var params = {
                    '@limit': _limit,
                    '@page': _page,
                    '@order': 'name ASC',
                    '@select': api._select + ',endereco'
                };

                if($scope.filters.keyword){
                    params['@keyword'] = $scope.filters.keyword;
                }

                _page++;

                api.find(params).then(function(rs){
                    if (rs.length < _limit) {
                        _endData = true;
                    }

                    rs.forEach(function(entity){
                        $scope.entities.push(entity);
                    });

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        }])

    .controller('spaceCtrl', [
        '$scope', '$stateParams', 'mapas.service.space', 'mapas.service.event', function ($scope, $stateParams, spaceApi, eventApi) {
            var api = spaceApi(window.config.url);
            api.util.applyMe.apply($scope);

            $scope.entity = null;

            api.findOne({id: $EQ($stateParams.entity)}).then(function (entity) {
                $scope.entity = entity;
            });
        }])

    .controller('agentCtrl', [
        '$scope', '$stateParams', 'mapas.service.agent', 'mapas.service.event', function ($scope, $stateParams, agentApi, eventApi) {
            var api = agentApi(window.config.url);
            api.util.applyMe.apply($scope);

            $scope.entity = null;

            api.findOne({id: $EQ($stateParams.entity)}).then(function (entity) {
                $scope.entity = entity;
            });
        }])

    .controller('projectCtrl', [
        '$scope', '$stateParams', 'mapas.service.project', 'mapas.service.event', function ($scope, $stateParams, projectApi, eventApi) {
            var api = projectApi(window.config.url);
            api.util.applyMe.apply($scope);

            $scope.entity = null;

            api.findOne({id: $EQ($stateParams.entity)}).then(function (entity) {
                $scope.entity = entity;
            });
        }])


    .controller('mapCtrl', ['$scope', '$ionicPlatform', 'MapState', 'mapas.service.space', function ($scope, $ionicPlatform, MapState, spaceApi) {
        var api = spaceApi(window.config.url);
        api.util.applyMe.apply($scope);
        var map;

        $scope.map_state = MapState;
        
        var _spaces = api.findByEvents({
            '@from': '2016-03-18',
            '@to': '2016-04-18'
        });
        
        $ionicPlatform.ready(function(MapState) {

            var map_wrapper = angular.element(document.querySelector("#map-wrapper"));
            $scope.frameHeight = map_wrapper[0].clientHeight;

            // Getting the map selector in DOM
            var div = document.getElementById("map_canvas");

            // Invoking Map using Google Map SDK v2 by dubcanada
            map = plugin.google.maps.Map.getMap(div, $scope.map_state.options);

            map.setClickable(true);
            // Capturing event when Map load are ready.
            map.addEventListener(plugin.google.maps.event.MAP_READY, function(){
                _spaces.then(function(spaces){
                    spaces.forEach(function(space){
                        var pin = {
                            title: space.name,
    //                        icon: iconName,
                            visible: true,
                            position: new plugin.google.maps.LatLng(
                                space.location.latitude,
                                space.location.longitude),
                        };
                        
                        map.addMarker(pin, function(marker){
                            space.marker = marker;
//                            marker.addEventListener(
//                                plugin.google.maps.event.MARKER_CLICK,
//                                function(){
//                                    marker.hideInfoWindow();
//                                    map.setClickable(false);
//                                    $scope.showConfirm(space);
//                                });
                        });
                    });
                });
                // Defining markers for demo
                // var markers = [{
                //     position: setPosition(-19.9178713, -43.9603117),
                //     title: "Marker 1"
                // }, {
                //     position: setPosition(-19.8363826, -43.9787167),
                //     title: "Marker 2"
                // }];
                //
                // // Bind markers
                // for (var i = 0; i < markers.length; i++) {
                //     map.addMarker({
                //         'marker': markers[i],
                //         'position': markers[i].position
                //     }, function(marker) {
                //
                //         // Defining event for each marker
                //         marker.on("click", function() {
                //             alert(marker.get('marker').title);
                //         });
                //
                //     });
                // }
            });

            // Function that return a LatLng Object to Map
            // function setPosition(lat, lng) {
            //     return new plugin.google.maps.LatLng(lat, lng);
            // }
      });
    }])

    .controller('aboutCtrl', function ($scope) {

    })

    .controller('favoritesCtrl', ['$scope', 'MenuState', 'FavoriteEvents', function ($scope, MenuState, FavoriteEvents) {
        MenuState.activeMenu('map');

        $scope.events = FavoriteEvents.favorites;
        $scope.favorite = FavoriteEvents.favorite;
    }])

    .controller('messagesCtrl', function ($scope) {

    })

    .controller('navCtrl', function ($scope, MenuState, $location, $ionicSideMenuDelegate, $timeout, $ionicLoading) {

        $scope.show_filter_search_menu = true;
        $scope.show_share_buttom = false;
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            // var new_location_path = newVal.split('#')[1];
            // var old_location_path = oldVal.split('#')[1];
            
            switch(toState.name){
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
                    
            }
            
            if (toState.name == 'menu.events') {
                $scope.show_filter_search_menu = true;
            } else {
                $scope.show_filter_search_menu = false;
            }
            $ionicLoading.show();
        });

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $ionicLoading.hide();
        });
    })
