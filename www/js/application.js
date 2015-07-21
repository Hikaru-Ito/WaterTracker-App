angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angles']).run(function($ionicPlatform, $rootScope, Datas) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
    $rootScope.datas = [];
    $rootScope.old_parcent = 100;
    $rootScope.baseZeroValue = 40;
    $rootScope.baseFullValue = 200;
    $rootScope.nowSensorValue = 0;
    $rootScope.parcent = 0;
    return $rootScope.reCount = function() {
      var diff, now_parcent, old_parcent, parcent, value;
      parcent = Math.floor($rootScope.nowSensorValue / $rootScope.baseFullValue * 100);
      if ($rootScope.nowSensorValue < 30) {
        $rootScope.parcent = -1;
      } else if (parcent > 100) {
        $rootScope.parcent = 100;
      } else {
        $rootScope.parcent = parcent;
        $rootScope.$apply();
        $('#bottle_view .water_bg').css('height', '#{$rootScope.parcent}%');
      }
      old_parcent = $rootScope.old_parcent;
      now_parcent = $rootScope.parcent;
      diff = old_parcent - now_parcent;
      if (old_parcent < now_parcent) {
        return $rootScope.old_parcent = now_parcent;
      } else {
        if (diff > 10) {
          value = {
            value: now_parcent,
            created: new Date().getTime()
          };
          $rootScope.datas.unshift(value);
          $rootScope.old_parcent = now_parcent;
          return $rootScope.$apply();
        }
      }
    };
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'MainCtrl'
  }).state('tab.bottle', {
    url: '/bottle',
    views: {
      'tab-bottle': {
        templateUrl: 'templates/tab-bottle.html',
        controller: 'BottleCtrl'
      }
    }
  }).state('tab.tracking', {
    url: '/tracking',
    views: {
      'tab-tracking': {
        templateUrl: 'templates/tab-tracking.html',
        controller: 'TrackingCtrl'
      }
    }
  }).state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  }).state('tab.setting', {
    url: '/account/setting',
    views: {
      'tab-account': {
        templateUrl: 'templates/setting.html',
        controller: 'SettingCtrl'
      }
    }
  });
  return $urlRouterProvider.otherwise('/tab/bottle');
});

angular.module('starter.controllers', []).controller('MainCtrl', function($rootScope) {}).controller('SettingCtrl', function($rootScope, $scope, $ionicHistory) {
  $scope.zero_val = $rootScope.baseZeroValue;
  $scope.full_val = $rootScope.baseFullValue;
  $scope.historyBack = function() {
    return $ionicHistory.goBack();
  };
  return $scope.changeVal = function() {
    $rootScope.baseZeroValue = $('#zero_val').val();
    return $rootScope.baseFullValue = $('#full_val').val();
  };
}).controller('BottleCtrl', function($rootScope, $scope, $stateParams, $interval, Datas) {}).controller('TrackingCtrl', function($rootScope, $scope, $stateParams, $interval, Datas) {
  $scope.widthInnnter = window.innerWidth - 16;
  Datas.getDatas().then(function(data) {
    return $rootScope.datas = data;
  });
  $scope.chart = {
    labels: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    datasets: [
      {
        fillColor: "rgba(151,187,205,0.1)",
        strokeColor: "#e67e22",
        pointColor: "rgba(151,187,205,0)",
        pointStrokeColor: "#e67e22",
        data: [4, 3, 5, 4, 6, 3, 10]
      }
    ]
  };
  return $scope.options = {
    scaleLineColor: "rgba(0,0,0,.1)",
    scaleFontSize: 12,
    scaleFontStyle: "normal",
    scaleFontColor: "#aab2bd"
  };
}).controller('AccountCtrl', function($scope, $timeout, $rootScope, $ionicLoading, $location) {
  var onConnect, onDeviceList, onError;
  $scope.isConnected = false;
  $scope.isScanning = false;
  $scope.isBottleScaned = false;
  $scope.devices;
  $scope.goSettingPage = function() {
    return $location.path('/tab/account/setting');
  };
  onDeviceList = function(devices) {
    $scope.devices = devices;
    if (devices.length === 0) {
      alert('ボトルが見つかりません');
    } else {
      $scope.isBottleScaned = true;
    }
    $scope.isScanning = false;
    return $scope.$apply();
  };
  onError = function(error) {
    return alert('エラーが発生しました');
  };
  onConnect = function() {
    $scope.isConnected = true;
    $scope.isBottleScaned = false;
    $ionicLoading.hide();
    return bluetoothSerial.subscribeRawData(function(data) {
      var bytes;
      bytes = new Uint8Array(data);
      $rootScope.nowSensorValue = bytes["0"];
      return $rootScope.reCount();
    }, onError);
  };
  $scope.startScan = function() {
    $scope.isScanning = true;
    return bluetoothSerial.list(onDeviceList, onError);
  };
  return $scope.connectDevice = function(device_id) {
    bluetoothSerial.connect(device_id, onConnect, onError);
    return $ionicLoading.show({
      template: 'Loading...'
    });
  };
});

angular.module('starter.services', []).factory('DB', function($q) {
  db;
  var db, errorCB, initQuery, self, successCB;
  self = this;
  errorCB = function(err) {
    return console.log("SQL 実行中にエラーが発生しました:" + err.code);
  };
  initQuery = function(tx) {
    return tx.executeSql('CREATE TABLE IF NOT EXISTS TestTable ( id integer primary key autoincrement, value text, created datetime default current_timestamp)');
  };
  successCB = function() {};
  db = window.openDatabase("Database", "1.0", "TestDatabase", 200000);
  db.transaction(initQuery, errorCB, successCB);
  self.query = function(query) {
    var deferred;
    deferred = $q.defer();
    db.transaction(function(transaction) {
      return transaction.executeSql(query, [], function(transaction, result) {
        return deferred.resolve(result);
      }, function(transaction, error) {
        return deferred.reject(error);
      });
    });
    return deferred.promise;
  };
  return self;
}).factory('Datas', function($http, DB) {
  var init, values;
  values = [];
  init = function() {
    return DB.query('SELECT * FROM TestTable ORDER BY created DESC').then(function(result) {
      var i, len, value;
      values = [];
      len = result.rows.length;
      i = 0;
      while (i < len) {
        value = {
          id: result.rows.item(i).id,
          value: result.rows.item(i).value,
          created: result.rows.item(i).created
        };
        values.push(value);
        i++;
      }
      return values;
    });
  };
  init();
  return {
    getDatas: function() {
      return DB.query('SELECT * FROM TestTable ORDER BY created DESC LIMIT 30').then(function(result) {
        var i, len, value;
        values = [];
        len = result.rows.length;
        i = 0;
        while (i < len) {
          value = {
            id: result.rows.item(i).id,
            value: result.rows.item(i).value,
            created: result.rows.item(i).created
          };
          values.push(value);
          i++;
        }
        return values;
      });
    },
    addData: function(value) {
      return DB.query('INSERT INTO TestTable (value) VALUES (#{value})').then(function(result) {
        return result;
      });
    }
  };
});
