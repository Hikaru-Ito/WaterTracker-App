angular.module 'starter', [
  'ionic'
  'starter.controllers'
  'starter.services'
  'angles'
]

.run ($ionicPlatform, $rootScope, Datas) ->
  $ionicPlatform.ready ->

    if window.cordova and
    window.cordova.plugins and
    window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true

    if window.StatusBar
      StatusBar.styleLightContent()

    $rootScope.datas = []
    $rootScope.old_parcent = 100
    $rootScope.baseZeroValue = 40 # ボトルが空のときのanalogReadの値
    $rootScope.baseFullValue = 200 # ボトルがいっぱいのときのanalogReadの値
    $rootScope.nowSensorValue = 0 # 現在のanalogReadの値
    $rootScope.parcent = 0 # ボトルの残量パーセント
    $rootScope.reCount = -> # 値が変わったときの計算

      parcent = Math.floor(
        $rootScope.nowSensorValue / $rootScope.baseFullValue * 100)

      # Bottle
      if $rootScope.nowSensorValue < 30
        $rootScope.parcent = -1

      else if parcent > 100
        $rootScope.parcent = 100

      else
        $rootScope.parcent = parcent
        $rootScope.$apply()
        $('#bottle_view .water_bg').css('height', '#{$rootScope.parcent}%')

      # Tracking
      old_parcent = $rootScope.old_parcent
      now_parcent = $rootScope.parcent
      diff = old_parcent - now_parcent

      # 増えた場合は、今回は無視する
      if old_parcent < now_parcent
        $rootScope.old_parcent = now_parcent
      else
        if diff > 10  # 10%以上変化した場合は、記録する
          value =
            value : now_parcent
            created : new Date().getTime()

          $rootScope.datas.unshift(value)
          # Datas.addData $rootScope.parcent
          # .then (data) ->
          #    console.log data
          $rootScope.old_parcent = now_parcent
          $rootScope.$apply()

.config ($stateProvider, $urlRouterProvider) ->

  $stateProvider
    .state('tab',
      url: '/tab'
      abstract: true
      templateUrl: 'templates/tabs.html'
      controller: 'MainCtrl'
    )

  .state('tab.bottle',
    url: '/bottle',
    views:
      'tab-bottle':
        templateUrl: 'templates/tab-bottle.html'
        controller: 'BottleCtrl'
  )

  .state('tab.tracking',
    url: '/tracking',
    views:
      'tab-tracking':
        templateUrl: 'templates/tab-tracking.html'
        controller: 'TrackingCtrl'
  )

  .state('tab.account',
    url: '/account',
    views:
      'tab-account':
        templateUrl: 'templates/tab-account.html'
        controller: 'AccountCtrl'
  )
    .state('tab.setting',
      url: '/account/setting',
      views:
        'tab-account':
          templateUrl: 'templates/setting.html'
          controller: 'SettingCtrl'
    )

  $urlRouterProvider.otherwise '/tab/bottle'
