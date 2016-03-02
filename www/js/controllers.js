angular.module('mapasculturais.controllers', [])

    .controller('eventsCtrl', ['$scope', 'mapas.service.event', function ($scope, eventApi) {
            var api = eventApi(window.config.url);
            var _limit = 20;
            var _page = 1;
            var _endData = false;
            var _lastGroup = null;

            $scope.groups = [];

            $scope.filters = {
                from: moment().format('Y-MM-DD'),
                to: moment().add(7, 'days').format('Y-MM-DD')
            };
            
            $scope.$watch('filters', function(){
                $scope.groups = [];
                _page = 1;
                _endData = false;
            });
            
            $scope.moreDataCanBeLoaded = function(){
                return !_endData;
            }

            $scope.loadMore = function () {
                var events = api.find($scope.filters.from, $scope.filters.to, {
                    '@limit': _limit,
                    '@page': _page
                });
                
                _page++;
                
                events.then(function (rs) {
                    if(rs.length < _limit){
                        _endData = true;
                    }
                    
                    var _groups = api.group('YYYY-MM-DD HH:mm', rs);
                    
                    console.log(_groups);
                    _groups.forEach(function (e) {
                        if(_lastGroup && _lastGroup.date.format('YYYY-MM-DD HH:mm') === e.date.format('YYYY-MM-DD HH:mm')){
                            e.events.forEach(function(event){
                                _lastGroup.events.push(event);
                            });
                        }else{
                            $scope.groups.push(e);
                        }
                            
                    });
                    
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });

                $scope.$on('$stateChangeSuccess', function () {
                    $scope.loadMore();
                });
            };

        }])

    .controller('spacesCtrl', function ($scope) {

    })

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
