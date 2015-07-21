# WaterTracker BLE Central iOS/Android App
![LOGO](https://gyazo.com/f852e2c1d612c8d6c5ff6322ca5da376.png)

WaterTracker is a BLE peripheral device and BLE central iOS/Android app to track the remaining amount of PET bottles.

### Peripheral Device
[https://github.com/Hikaru-Ito/WaterTracker-BlendMicro](https://github.com/Hikaru-Ito/WaterTracker-BlendMicro)

### Screens
![Screen](https://gyazo.com/8e12901c993f4d42b13938151a2f13fa.ong)

### Tech

* AngularJS
* Cordova
* ionic
* Gulp
* jQuery
* Sass
* CoffeeScript

### Installation
**Prepare**
```sh
$ npm install -g ionic cordova
$ ionic state restore
```

**Build App**
```sh
$ ionic build ios android
```

**Run**
```sh
$ ionic run android
```
```sh
$ ionic emulate android
```
```sh
$ ionic run ios
```

### Development

**Install Dependencies**
```sh
$ npm i
$ gulp
```

**Development in the browser (It is, of course, Bluetooth does not work)**
```sh
$ ionic serve --lab
```

**Development your iOS Device**
```sh
$ open platforms/ios/WaterTracker.xcodeproj
```
**Development your AndroidDevice or GenyMotion**
```sh
$ ionic run android
```

### Todo's

No plans to anymore nothing

