angular.module('starter.controllers', [])

.controller('MainCtrl', ($rootScope) ->
)

.controller 'SettingCtrl', ($rootScope, $scope, $ionicHistory) ->
  $scope.zero_val = $rootScope.baseZeroValue
  $scope.full_val = $rootScope.baseFullValue
  $scope.historyBack = ->
    $ionicHistory.goBack()

  $scope.changeVal = ->
    $rootScope.baseZeroValue = $('#zero_val').val()
    $rootScope.baseFullValue = $('#full_val').val()

.controller('BottleCtrl',
($rootScope, $scope, $stateParams, $interval, Datas) ->
)

.controller 'TrackingCtrl',
($rootScope, $scope, $stateParams, $interval, Datas) ->
  $scope.widthInnnter = window.innerWidth - 16

  Datas.getDatas()
    .then (data) ->
      $rootScope.datas = data

  $scope.chart =
      labels : [
        "12:00"
        "13:00"
        "14:00"
        "15:00"
        "16:00"
        "17:00"
        "18:00"
      ],
      datasets : [
        fillColor : "rgba(151,187,205,0.1)"
        strokeColor : "#e67e22"
        pointColor : "rgba(151,187,205,0)"
        pointStrokeColor : "#e67e22"
        data : [4, 3, 5, 4, 6, 3, 10]
      ]
  $scope.options =
    scaleLineColor: "rgba(0,0,0,.1)"
    scaleFontSize: 12
    scaleFontStyle: "normal"
    scaleFontColor: "#aab2bd"


.controller 'AccountCtrl',
($scope, $timeout, $rootScope,$ionicLoading, $location) ->
  $scope.isConnected = false
  $scope.isScanning = false
  $scope.isBottleScaned = false
  $scope.devices
  $scope.goSettingPage = ->
    $location.path '/tab/account/setting'

  onDeviceList = (devices) ->
    $scope.devices = devices
    if devices.length is 0
      alert 'ボトルが見つかりません'
    else
      $scope.isBottleScaned = true

    $scope.isScanning = false
    $scope.$apply()

  onError = (error) ->
    alert 'エラーが発生しました'

  onConnect = ->
    $scope.isConnected = true
    $scope.isBottleScaned = false
    $ionicLoading.hide()
    bluetoothSerial.subscribeRawData (data) ->
      bytes = new Uint8Array data
      $rootScope.nowSensorValue = bytes["0"]
      $rootScope.reCount()
    , onError

  $scope.startScan = ->
    $scope.isScanning = true
    bluetoothSerial.list onDeviceList, onError

  $scope.connectDevice = (device_id) ->
    bluetoothSerial.connect device_id, onConnect, onError
    $ionicLoading.show
      template: 'Loading...'
