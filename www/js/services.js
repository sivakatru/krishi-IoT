angular.module('krishi_IoT.services', [])

.factory('sessionService',['$http',function($http){
return {
   set:function(key,value){
      return localStorage.setItem(key,value);
   },
   get:function(key){
     return JSON.parse(localStorage.getItem(key));
   },
   destroy:function(key){
     return localStorage.removeItem(key);
   },
 };
}])

.factory('Devices', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var devices = [{
    id: 0,
    name: 'Weather',
    description: 'Temperature, Humidity, Rain sensors',
    face: 'img/weather.png'
  }, {
    id: 1,
    name: 'Switch',
    description: 'Relay motor control',
    face: 'img/switch.png'
  }, {
    id: 2,
    name: 'Earth',
    description: 'Moisture level',
    face: 'img/earth.png'
  }, {
    id: 3,
    name: 'Eye',
    description: 'Capture image at your farm',
    face: 'img/eye.png'
  }, {
    id: 4,
    name: 'Bird',
    description: 'Video and control farm',
    face: 'img/bird.png'
  }];


  return {
    all: function() {
      return devices;
    },
    remove: function(device) {
      devices.splice(devices.indexOf(device), 1);
    },
    get: function(deviceId) {
      for (var i = 0; i < devices.length; i++) {
        if (devices[i].id === parseInt(deviceId)) {
          return devices[i];
        }
      }
      return null;
    }
  };
});