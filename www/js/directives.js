angular.module('mapasculturais.directives', ['ionic'])

    .directive('filterEvents', ['$ionicModal', 'mapas.service.api', function ($ionicModal, mapasApi) {
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
                    hidePast: true,
                    from: moment().toDate(),
                    to: moment().add(1, 'months').toDate(),
                    linguagem: null,
                    verified:false
                };

                $scope.filters = angular.extend($scope.filters, original);
                $scope.temp = angular.copy(original);

                function apply(){
                    $scope.onApply();
                    $scope.modal.hide();
                }

                $scope.applyFilters = function () {
                    Object.keys($scope.temp).forEach(function (k) {
                        $scope.filters[k] = $scope.temp[k];
                    });

                    apply();
                };

                $scope.cancel = function () {
                    $scope.temp = angular.copy($scope.filters);
                    $scope.modal.hide();
                };

                $scope.reset = function () {
                    Object.keys(original).forEach(function (k) {
                        $scope.filters[k] = original[k];
                    });
                    $scope.temp = angular.copy($scope.filters);
                    apply();
                };

                // modal ==========================
                $ionicModal.fromTemplateUrl('my-modal.html', {
                    scope: $scope,
                    animation: 'fade-in-scale',
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                });
                $scope.openModal = function () {
                    $scope.modal.show();
                };

                api.taxonomyTerms('linguagem').then(function(terms){
                    $scope.linguagens = terms;
                });
            }
        };
    }]);
