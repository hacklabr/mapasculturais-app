angular.module('mapasculturais.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.service('FavoriteEvents', ['$localStorage', function($localStorage) {

    if (!$localStorage.favoriteEvents) {
        console.log($localStorage.favoriteEvents)
        $localStorage.favoriteEvents = {}
    }

    this.favorite = function(event) {
        if (!event.favorite) {
            event.favorite = true;
            $localStorage.favoriteEvents[event.id] = true;
        } else {
            event.favorite = false;
            delete $localStorage.favoriteEvents[event.id]
        }
    }

    this.isFavorite = function(event) {
        return !!$localStorage.favoriteEvents[event.id]
    }

}])
