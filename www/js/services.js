angular.module('mapasculturais.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.service('MenuState', ['$rootScope', function($rootScope) {
    $rootScope.activeMenu = 'events';
    this.activeMenu = function(activeMenu){
        $rootScope.activeMenu = activeMenu;
    };
}])

.service('ConfigState', function($localStorage, $location) {
    this.dataSources = {
        'spcultura': {
            prefix: 'spcultura',
            name: 'SpCultura',
            url: 'http://spcultura.prefeitura.sp.gov.br/',
            map: {
                latutude: -23.5408, 
                longitude: -46.6400,
                zoom: 11
            }
        },
        estadodacultura: {
            prefix: 'estadodacultura',
            name: 'SP Estado da Cultura',
            url: 'http://estadodacultura.sp.gov.br/',
            map: {
                latutude: -22.61401087437029, 
                longitude: -49.2132568359375,
                zoom: 7
            }
        },
        ceara: {
            prefix: 'ceara',
            name: 'Mapa Cultural do Ceará',
            url: 'http://mapa.cultura.ce.gov.br/',
            map: {
                latutude: -5.063586123720585, 
                longitude: -39.4134521484375,
                zoom: 7
            }
        },
        blumenau: {
            prefix: 'blumenau',
            name: 'Blumenau Mais Cultura',
            url: 'http://blumenaumaiscultura.com.br/',
            map: {
                latutude: -26.883952223378103, 
                longitude: -49.08708572387695,
                zoom: 12
            }
        },
        bh: {
            prefix: 'bh',
            name: 'Mapeamento Cultural de BH',
            url: 'http://mapeamentoculturalbh.pbh.gov.br/',
            map: {
                latutude: -19.919614676628896, 
                longitude: -43.97294998168945,
                zoom: 12
            }
        },
        mapasmt: {
            prefix: 'mapasmt',
            name: 'Mapas MT',
            url: 'https://mapas.cultura.mt.gov.br/',
            map: {
                latutude: -13.549881446917126, 
                longitude: -56.085205078125,
                zoom: 6
            }
        },
        /* precisa atualizar o mapas para funcionar
        lugaresdacultura: {
            prefix: 'lugaresdacultura',
            name: 'Lugares da Cultura',
            url: 'http://lugaresdacultura.org.br/',
            map: {
                latutude: -23.105628416305972, 
                longitude: -45.84800720214843,
                zoom: 10
            }
        }, */
    };
    
    this.defineDataSource = function(prefix){
        $localStorage.config.dataSource = prefix;
        
        this.dataSource = this.dataSources[prefix];
    }

    if($localStorage.config){
        this.dataSource = this.dataSources[$localStorage.config.dataSource];
    } else {
        $localStorage.config = {};
        
        this.defineDataSource(this.dataSources[Object.keys(this.dataSources)[0]].prefix);
    }
})

.service('FavoriteEvents', ['$localStorage', 'ConfigState', function($localStorage, config) {

    var self = this
    this.favorites = [];

    var sync = function() {
        while (self.favorites.length > 0){
            self.favorites.pop();
        }
        for (var key in $localStorage.favoriteEvents) {
            var event = $localStorage.favoriteEvents[key];
            event.start = moment(event.start);
            event.end = moment(event.end);
            self.favorites.push(event);
        }
    }

    if (!$localStorage.favoriteEvents) {
        $localStorage.favoriteEvents = {}
    } else {
        sync();
    }

    var getKey = function(event) {
        var key = moment(event.start.toString()).format('X') + '|' + event.occurrence_id;
        return config.dataSource.prefix + ':' + key;
        
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
    
    this.clear = function(){
        $localStorage.favoriteEvents = {};
        sync();
    }

}])

.service('MapState', function(ConfigState){
    // return function(mapTypeId, center){
    var center = new plugin.google.maps.LatLng(ConfigState.dataSource.map.latitude, ConfigState.dataSource.map.longitude);
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
            'zoom': ConfigState.dataSource.map.zoom,
        }
    };
    this.markers = [];
        // map options that will be kept in memory ;)
    // }
})