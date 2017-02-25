angular.module('krishi_IoT', ['ionic', 'ngCordova', 'krishi_IoT.controllers', 'krishi_IoT.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.status', {
    url: '/status',
    views: {
      'tab-status': {
        templateUrl: 'templates/tab-status.html',
        controller: 'StatusCtrl'
      }
    }
  })

  .state('tab.devices', {
      url: '/devices',
      views: {
        'tab-devices': {
          templateUrl: 'templates/tab-devices.html',
          controller: 'DevicesCtrl'
        }
      }
    })
    .state('tab.device-detail', {
      url: '/devices/:deviceId',
      views: {
        'tab-devices': {
          templateUrl: 'templates/device-detail.html',
          controller: 'DeviceDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  
  .state('tab.regLang', {
    url: '/regLang',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-regLang.html',
        controller: 'regLangCtrl'
      }
    }
  })
  
  .state('tab.about', {
    url: '/about',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-about.html',
        controller: 'AboutCtrl'
      }
    }
  })
;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/status');

});
