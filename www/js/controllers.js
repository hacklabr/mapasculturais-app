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
            var _limit = 50;
            var _page = 1;
            var _endData = false;
            var _lastGroup = null;
            var _now = moment().format('YMMDDHH') - 2;
            
            $scope.groups = [];

            $scope.filters = {
                from: moment().format('Y-MM-DD'),
                to: moment().add(31, 'days').format('Y-MM-DD'),
                pastEvents: false
            };

            $scope.$watch('filters', function () {
                $scope.groups = [];
                _page = 1;
                _endData = false;
            });

            $scope.moreDataCanBeLoaded = function () {
                return !_endData;
            }

            $scope.loadMore = function () {
                var events;
                var params = {
                    '@limit': _limit,
                    '@page': _page
                };

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

                    var _groups = api.group('YYYY-MM-DD HH:mm', rs);

                    _groups.forEach(function (e) {
                        if (!$scope.filters.pastEvents && e.date.format('YMMDDHH') < _now) {
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
                entity.favorite = FavoriteEvents.isFavorite(entity);
                $scope.entity = entity;
            });

            $scope.favorite = FavoriteEvents.favorite;

            $scope.classificacao = classificacao;
        }])

    .controller('spacesCtrl', [
        '$scope', 'mapas.service.space', function ($scope, spaceApi) {
            var api = spaceApi(window.config.url);
            var _limit = 50;
            var _page = 1;
            var _endData = false;
            
            api.util.applyMe.apply($scope);
            
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


    .controller('mapCtrl', function ($scope) {

    })

    .controller('aboutCtrl', function ($scope) {

    })

    .controller('starredCtrl', function ($scope) {

    })

    .controller('messagesCtrl', function ($scope) {

    })

    .controller('navbarCtrl', function ($scope, $location) {
        $scope.location = $location.path();

    })

    .controller('filterCtrl', function ($scope) {

    })
