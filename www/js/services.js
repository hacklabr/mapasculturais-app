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
  // Change fixedPrefix variable below to disable interface for choosing datasource.
  // Used for mantaining a fork that communicates with only one installation
  this.fixedPrefix = null;

  this.dataSourceConfigurable = this.fixedPrefix == null;

  this.dataSources = {
    /*'spcultura': {
    prefix: 'spcultura',
    name: 'SP Cultura',
    url: 'http://spcultura.prefeitura.sp.gov.br/',
    map: {
    latitude: -23.5408,
    longitude: -46.6400,
    zoom: 11
  }
},*/
estadodacultura: {
  prefix: 'estadodacultura',
  name: 'SP Estado da Cultura',
  url: 'http://estadodacultura.sp.gov.br/',
  map: {
    latitude: -22.61401087437029,
    longitude: -49.2132568359375,
    zoom: 7
  }
},
/*ceara: {
prefix: 'ceara',
name: 'Mapa Cultural do Ceará',
url: 'http://mapa.cultura.ce.gov.br/',
map: {
latitude: -5.063586123720585,
longitude: -39.4134521484375,
zoom: 7
}
},
blumenau: {
prefix: 'blumenau',
name: 'Blumenau Mais Cultura',
url: 'http://blumenaumaiscultura.com.br/',
map: {
latitude: -26.883952223378103,
longitude: -49.08708572387695,
zoom: 12
}
},
bh: {
prefix: 'bh',
name: 'Mapa Cultural BH',
url: 'http://mapaculturalbh.pbh.gov.br/',
map: {
latitude: -19.919614676628896,
longitude: -43.97294998168945,
zoom: 12
}
},
mapasmt: {
prefix: 'mapasmt',
name: 'Mapas MT',
url: 'https://mapas.cultura.mt.gov.br/',
map: {
latitude: -13.549881446917126,
longitude: -56.085205078125,
zoom: 6
}
},
mapasgovbr: {
prefix: 'mapasgovbr',
name: 'Mapa da Cultura',
url: 'http://mapas.cultura.gov.br/',
map: {
latitude: -15.792253570362446,
longitude: -47.900390625,
zoom: 5
}
},
lugaresdacultura: {
prefix: 'lugaresdacultura',
name: 'Lugares da Cultura',
url: 'http://lugaresdacultura.org.br/',
map: {
latitude: -23.105628416305972,
longitude: -45.84800720214843,
zoom: 10
}
},
riograndedosul: {
prefix: 'riograndedosul',
name: 'Cultura RS',
url: 'http://mapa.cultura.rs.gov.br/',
map: {
latitude: -30.012030680358613,
longitude: -53.1463623046875,
zoom: 7
}
},
sobral: {
prefix: 'sobral',
name: 'Sobral Cultura',
url: 'http://cultura.sobral.ce.gov.br/',
map: {
latitude: -3.6916816830416033,
longitude: -40.350680351257324,
zoom: 14
}
},
distritofederal: {
prefix: 'distritofederal',
name: 'Mapa nas Nuvens',
url: 'http://mapa.cultura.df.gov.br/',
map: {
latitude: -15.788619534134423,
longitude: -47.85472869873047,
zoom: 11
}
},
santoandre: {
prefix: 'santoandre',
name: 'CulturAZ',
url: 'http://culturaz.santoandre.sp.gov.br/',
map: {
latitude: -23.666537435313803,
longitude: -46.52907371520996,
zoom: 13
}
},
tocantins: {
prefix: 'tocantins',
name: 'Tocantins',
url: 'http://mapa.cultura.to.gov.br/',
map: {
latitude: -9.318990192397917,
longitude: -48.2244873046875,
zoom: 7
}
},
sniic: {
prefix: 'sniic',
name: 'SNIIC',
url: 'http://mapas.cultura.gov.br/',
map: {
latitude: -15.792253570362446,
longitude: 48.01025390625,
zoom: 5
}
},
culturaviva: {
prefix: 'culturaviva',
name: 'Rede Cultura Viva',
url: 'http://culturaviva.gov.br/',
map: {
latitude: -15.792253570362446,
longitude: 48.01025390625,
zoom: 5
}
},
museus: {
prefix: 'museus',
name: 'Museus',
url: 'http://museus.cultura.gov.br/',
map: {
latitude: -15.792253570362446,
longitude: 48.01025390625,
zoom: 5
}
},
bibliotecas: {
prefix: 'bibliotecas',
name: 'Bibliotecas',
url: 'http://bibliotecas.cultura.gov.br/',
map: {
latitude: -15.792253570362446,
longitude: 48.01025390625,
zoom: 5
}
},
// Pendentes de atualização para o branch v2
joaopessoa: {
prefix: 'joaopessoa',
name: 'JP Cultura',
url: 'http://jpcultura.joaopessoa.pb.gov.br/',
map: {
latitude: -7.1330866953002605,
longitude: -34.85678672790527,
zoom: 13
}
},
londrina: {
prefix: 'londrina',
name: 'Londrina',
url: 'http://londrinacultura.londrina.pr.gov.br',
map: {
latitude: -23.30757674572749,
longitude: -51.16281509399414,
zoom: 12
}
},
parnaiba: {
prefix: 'paranaiba',
name: 'Territori1',
url: 'http://mapa.territori1.org',
map: {
latitude: -2.9054960224414335,
longitude: -41.77328109741211,
zoom: 12
}
},
// Pendentes de atualização para o branch v2
// ubatuba: {
//     prefix: 'ubatuba',
//     name: 'Ubatuba',
//     url: 'http://mapacultural.ubatuba.sp.gov.br',
//     map: {
//         latitude: -23.584126032644107,
//         longitude: -47.823486328125,
//         zoom: 6
//     }
// },*/
};

this.defineDataSource = function(prefix){
  $localStorage.config.dataSource = prefix;

  this.dataSource = this.dataSources[prefix];
}

if (!$localStorage.config)
$localStorage.config = {};

if (this.dataSourceConfigurable) {
  if($localStorage.config.dataSource && this.dataSources[$localStorage.config.dataSource]){
    this.dataSource = this.dataSources[$localStorage.config.dataSource];
  } else {
    this.defineDataSource(this.dataSources[Object.keys(this.dataSources)[0]].prefix);
  }
} else {
  this.defineDataSource(this.fixedPrefix);
}
})

.service('FavoriteLinguagens', ['$localStorage', 'ConfigState', function($localStorage, config) {



  var self = this
  this.favorites = [];

  var sync = function() {
    while (self.favorites.length > 0){
      self.favorites.pop();
    }
    for (var key in $localStorage.favoriteLinguagens) {
      var linguagem = $localStorage.favoriteLinguagens[key];
      /*linguagem.start = moment(linguagem.start);
      linguagem.end = moment(linguagem.end);*/
      self.favorites.push(linguagem);
    }
  }

  if (!$localStorage.favoriteLinguagens) {
    $localStorage.favoriteLinguagens = {}
  } else {
    sync();
  }
  var populate = function(){

  }
  var getKey = function(linguagem) {
    var key = moment(linguagem.start.toString()).format('X') + '|' + linguagem.occurrence_id;
    return config.dataSource.prefix + ':' + key;

  }

  this.favorite = function(linguagem) {
    if (!Linguagems.favorite) {
      linguagem.favorite = true;
      $localStorage.favoriteEvents[getKey(linguagem)] = linguagem;
    } else {
      event.favorite = false;
      delete $localStorage.favoriteLinguagens[getKey(linguagem)]
    }
    sync()
  }

  this.isFavorite = function(linguagem) {
    return !!$localStorage.favoriteLinguagens[getKey(linguagem)]
  }

  this.clear = function(){
    $localStorage.favoriteLinguagens = {};
    sync();
  }

}])

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

.service('IsFirstRun', ['$localStorage', 'ConfigState', function($localStorage, config) {
  this.isFirstRun = function(){
    if($localStorage.firstRun === undefined){
      $localStorage.firstRun = false;
      return true;
    }
    return false;
  }

}])

.service('MapState', function(ConfigState){
  var self = this;

  this.getOptions = function() {
    var center = new plugin.google.maps.LatLng(ConfigState.dataSource.map.latitude, ConfigState.dataSource.map.longitude);
    return {
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
  }
  this.initialize = function(div) {
    self.map = plugin.google.maps.Map.getMap(div, self.getOptions());
    self.map.setClickable(true);
  }

  this.setReadyCallback = function(callback) {
    self.map.addEventListener(plugin.google.maps.event.MAP_READY, callback);
  }

  this.markers = [];
  this.addMarker = function(pin, addCallback, clickCallback) {
    self.map.addMarker(pin, function(marker) {
      self.markers.push(marker);
      addCallback(marker);
      marker.addEventListener(plugin.google.maps.event.INFO_CLICK, clickCallback);
    });
  }

  this.reset = function() {
    for (var i=0; i<self.markers.length; i++) {
      self.markers[i].remove();
    }
    self.markers = [];
    self.map.setOptions(self.getOptions());
  }

  // map options that will be kept in memory ;)
  // }
})
