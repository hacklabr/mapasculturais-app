angular.module('mapasculturais.directives', ['ionic'])

    .directive('filterEvents', ['mapas.service.api', '$anchorScroll', '$timeout', function (mapasApi, $anchorScroll, $timeout) {
        return {
            restrict: 'E',
            templateUrl: 'templates/filter-events.html',
            scope: {
                filters: '=',
                onApply: '='
            },
            link: function ($scope, el, attrs) {
                var api = mapasApi(window.config.url);
                var original = {
                    keyword: '',
                    showPast: false,
                    from: moment().toDate(),
                    to: moment().add(1, 'months').toDate(),
                    linguagem: null,
                    verified:false
                };

                $scope.filters = angular.extend($scope.filters, original);
                $scope.temp = angular.copy(original);

                function apply(){
                    $scope.onApply();
                    $scope.close();
                }

                $scope.applyFilters = function () {
                    Object.keys($scope.temp).forEach(function (k) {
                        $scope.filters[k] = $scope.temp[k];
                    });

                    apply();
                };

                $scope.cancel = function () {
                    $scope.temp = angular.copy($scope.filters);
                    $scope.close();
                };

                $scope.reset = function () {
                    Object.keys(original).forEach(function (k) {
                        $scope.filters[k] = original[k];
                    });
                    $scope.temp = angular.copy($scope.filters);
                    apply();
                };
                
                $scope.open = function () {
                    $scope.showFilter = true;
                    console.log('heim?');
                    $timeout(function(){
                        $anchorScroll('event-filter');
                    });
                };
                
                $scope.close = function () {
                    $scope.showFilter = false;
                }

                api.taxonomyTerms('linguagem').then(function(terms){
                    $scope.linguagens = terms;
                });
            }
        };
    }]);
