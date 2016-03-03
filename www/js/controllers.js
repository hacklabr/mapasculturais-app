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

    .controller('eventsCtrl', ['$scope', 'mapas.service.event', function ($scope, eventApi) {
            console.log('eventCtrl');
            var api = eventApi(window.config.url);
            var _limit = 30;
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
                var params = {
                    '@limit': _limit,
                    '@page': _page
                };
                
                if(!$scope.controllerFilters){
                    $scope.controllerFilters = {};
                }
                
                if($scope.controllerFilters.space){
                    params['space:id'] = $IN($scope.controllerFilters.space);
                }
                
                var events = api.find($scope.filters.from, $scope.filters.to, params);

                _page++;

                events.then(function (rs) {
                    if (rs.length < _limit) {
                        _endData = true;
                    }
                    
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
                    console.log('load more');
                });
            };
            

            $scope.showCalendar = function (group) {
                var numDays = 6
                return group.format('X') < moment().add(numDays, 'days').format('X')
            }

            $scope.classificacao = classificacao;
        }])

    .controller('eventCtrl', ['$scope', '$stateParams', 'mapas.service.event', function ($scope, $stateParams, eventApi) {
            var api = eventApi(window.config.url);
            api.util.applyMe.apply($scope);
            
            $scope.entity = null;

            api.findOne({id: $EQ($stateParams.entity)}).then(function (entity) {
                $scope.entity = entity;
            });

            $scope.classificacao = classificacao;
        }])

    .controller('spacesCtrl', function ($scope) {
        
    })

    .controller('spaceCtrl', ['$scope', '$stateParams', 'mapas.service.space', 'mapas.service.event', function ($scope, $stateParams, spaceApi, eventApi) {
            var api = spaceApi(window.config.url);
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
