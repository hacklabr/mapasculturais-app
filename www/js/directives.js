angular.module('mapasculturais.directives', ['ionic'])

    .directive('filterEvents', function ($ionicModal) {
        return {
            restrict: 'E',
            templateUrl: '/templates/filter.events.html',
            scope: {
                filters: '=',
                onApply: '='
            },
            link: function ($scope, el, attrs) {
                var original = {
                    keyword: '',
                    hidePast: true,
                    from: moment().toDate(),
                    to: moment().add(1, 'months').toDate()
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
                $scope.closeModal = function () {
                    $scope.modal.hide();
                };
                //Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });
                // Execute action on hide modal
                $scope.$on('modal.hidden', function () {
                    // Execute action
                });
                // Execute action on remove modal
                $scope.$on('modal.removed', function () {
                    // Execute action
                });
            }
        };
    });
