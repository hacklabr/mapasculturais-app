angular.module('mapasculturais.controllers', [])

    .controller('eventsCtrl', ['$scope', 'mapas.service.event', function ($scope, eventApi) {
            var api = eventApi(window.config.url);

            $scope.entities = [];

            $scope.data = {
                page: 1
            };

            $scope.loadMore = function () {
                console.log({
                    '@limit': 10,
                    '@page': $scope.data.page
                });
                var events = api.find({
                    '@limit': 10,
                    '@page': $scope.data.page
                });
                $scope.data.page++;
                events.then(function (rs) {
                    console.log(rs);
                    rs.forEach(function (e) {
                        $scope.entities.push(e);
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
