angular.module('mapasculturais.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){
q
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
        // console.log(event.start.toString())
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

.service('MapState', function(){
    // return function(mapTypeId, center){
    var center = new plugin.google.maps.LatLng(-23.5408, -46.6400);
    this.options = {
        'backgroundColor': 'transparent',
        'mapType': plugin.google.maps.MapTypeId.ROADMAP,
        'controls': {
            'myLocationButton': true,
            'indoorPicker': true,
            'zoom': true
        },
        'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': false,
            'zoom': true
        },
        'camera': {
            'latLng': center,
            'zoom': 14,
        }
    };
    this.markers = [];
        // map options that will be kept in memory ;)
    // }
})