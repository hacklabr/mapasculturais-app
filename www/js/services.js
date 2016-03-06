angular.module('mapasculturais.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.service('FavoriteEvents', ['$localStorage', function($localStorage) {

    var self = this
    this.favorites = [];

    var sync = function() {
        while (self.favorites.length > 0)
            self.favorites.pop()
        for (var key in $localStorage.favoriteEvents) {
            self.favorites.push($localStorage.favoriteEvents[key]);
        }
    }

    if (!$localStorage.favoriteEvents) {
        $localStorage.favoriteEvents = {}
    } else {
        sync();
    }

    var getKey = function(event) {
        console.log(event.start.toString())
        return event.start.toString() + '|' + event.occurrence_id
    }

    this.favorite = function(event) {
        if (!event.favorite) {
            event.favorite = true;
            $localStorage.favoriteEvents[getKey(event)] = event;
        } else {
            event.favorite = false;
            delete $localStorage.favoriteEvents[getKey(event)]
        }
        sync()
    }

    this.isFavorite = function(event) {
        return !!$localStorage.favoriteEvents[getKey(event)]
    }

}])
