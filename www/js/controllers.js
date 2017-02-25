angular.module('krishi_IoT.controllers', [])

.controller('StatusCtrl', function($scope) {})

.controller('DevicesCtrl', function($scope, $rootScope,Devices) {
  $scope.devices = Devices.all();
  $scope.remove = function(device) {
    Devices.remove(device);
  };
  $scope.$on('msg', function(response) {
      // incoming data from subscribe2Topic
	  console.log("in DevicesCtrl: "+$rootScope.data.payloadString);
  });
})

.controller('DeviceDetailCtrl', function($scope, $stateParams, $rootScope, $ionicLoading, Devices, sessionService) {
	$scope.device = Devices.get($stateParams.deviceId);
	
	$scope.motorImageStatus = "img/motor.jpg";
	$scope.outlet_status = {};
	//outletControl
	$scope.outletControl = function() {
		$ionicLoading.show();
		if ($scope.outlet_status.value === "ON") {
			console.log('Turning ON motor:' + $scope.outlet_status.value);
			//CONNECTED - SEND CTRL PACKET
			var ctrlMsg = '{"outlet_status":"ON"}';
			var message = new Paho.MQTT.Message(ctrlMsg);
			message.destinationName = "krishiIoT/krishi_IoT/control/"+sessionService.get("packet").deviceId;
			$rootScope.client.send(message); 
			$ionicLoading.hide();
			console.log("Published to topic: "+message.destinationName+" message:"+ctrlMsg);
			$scope.motorImageStatus = "img/motor.jpg";
			$scope.outlet_status.value = 'ON';			
		} else {
			//CONNECTED - SEND CTRL PACKET
			var ctrlMsg = '{"outlet_status":"OFF"}';
			var message = new Paho.MQTT.Message(ctrlMsg);
			message.destinationName = "krishiIoT/krishi_IoT/control/"+sessionService.get("packet").deviceId;
			$rootScope.client.send(message); 
			$ionicLoading.hide();
			console.log("Published to topic: "+message.destinationName+" message:"+ctrlMsg);
			$scope.outlet_status.value = 'OFF';	
			console.log('Turning OFF motor:' + $scope.outlet_status.value);
			$scope.motorImageStatus = "img/motorOff.jpg";
			$scope.outlet_status.value = 'OFF';			
		}
	}	
	$scope.getImage = function() {
		console.log('Getting the image:');
		var getimg = '{"ctrlCommand":"getImage"}';
		var message = new Paho.MQTT.Message(getimg);
		message.destinationName = "krishiIoT/krishi_IoT/control/"+sessionService.get("packet").deviceId;
		$rootScope.client.send(message); 
		$ionicLoading.hide();
	}
	
	$scope.weatherWidget = false;
	$scope.switchWidget = false;
	$scope.earthWidget = false;
	$scope.eyeWidget = false;
	$scope.birdWidget = false;
	
	// incoming data from subscribe2Topic
	console.log("in DeviceDetailCtrl:sessionService:: "+sessionService.get("packet") +" name:: "+$scope.device.name);
	if($scope.device.name === "Weather" && sessionService.get("packet") != null) {
			$scope.weatherWidget = true;
			$scope.temp = sessionService.get("packet").sensor.temp;
			$scope.humidity = sessionService.get("packet").sensor.humidity;
	} else if($scope.device.name === "Switch" && sessionService.get("packet") != null) {
			$scope.switchWidget = true;
			$scope.outlet_status.value = sessionService.get("packet").sensor.outlet_status;
	} else if($scope.device.name === "Earth" && sessionService.get("packet") != null) {
			$scope.earthWidget = true;
			$scope.moisture = sessionService.get("packet").sensor.moisture;
			$scope.moistureText = sessionService.get("packet").sensor.moistureText;
	} else if($scope.device.name === "Eye" && sessionService.get("packet") != null) {
			$scope.eyeWidget = true;
			$scope.farmImage = sessionService.get("packet").sensor.imgURL;
			$scope.farmImageText = sessionService.get("packet").sensor.imgText;
	} else if($scope.device.name === "Bird" && sessionService.get("packet") != null) {
			$scope.birdWidget = true;
			$scope.farmVideo = sessionService.get("packet").sensor.videoURI;
			//$scope.farmVideo = 'https://www.youtube.com/embed/v3YcZtlVrls';
	}
	
	$scope.$on('msg', function(response) {
		var received = JSON.parse($rootScope.data.payloadString);

		$scope.$apply(function() {			
			if (received.deviceType ==="Weather") {
				console.log("Weather device message received: "+received.deviceType+" temp: "+received.sensor.temp+" hum: "+received.sensor.humidity);
				//alert("You are in weather device");
				//Now create widgets here.
				$scope.temp = received.sensor.temp;
				$scope.humidity = received.sensor.humidity;
				$scope.rain = received.sensor.rain;				
			} else if(received.deviceType ==="Switch") {
				console.log("Switch device message received: "+received.deviceType+"outlet_status: "+received.sensor.outlet_status);
				//alert("You are in switch device");
				//Now create widgets here.
				if (received.sensor.outlet_status ==="ON") {
					$scope.outlet_status = received.sensor.outlet_status;
					$scope.outlet_status = { value: 'ON' };				
				} else if (received.sensor.outlet_status ==="OFF"){
					$scope.outlet_status = received.sensor.outlet_status;
					$scope.outlet_status = { value: 'OFF' };
				}
			} else if(received.deviceType ==="Earth") {
				console.log("Earth device message received: "+received.deviceType+" Soil moisture:"+received.sensor.moisture);$scope.moisture = received.sensor.moisture;
				$scope.moistureText = $scope.moistureText;
			} else if(received.deviceType ==="Eye") {
				console.log("Eye device message received: "+received.deviceType+" Image location:"+received.sensor.imgURL);
				$scope.farmImage = received.sensor.imgURL;
				$scope.farmImageText = received.sensor.imgText;
			} else if(received.deviceType ==="Bird") {
				console.log("Bird device message received: "+received.deviceType+" Bird video:"+received.sensor.videoURI);
				$scope.farmVideo = received.sensor.videoURI;
			} 
		});
	});
})

.controller('SettingsCtrl', function($scope, $rootScope, $ionicLoading,$cordovaToast, sessionService) {	
	var regMsg;
	var subscribe2Topic = "krishiIoT/krishi_IoT/telemetry/#";
	var publish2Topic = "krishiIoT/krishi_IoT/register";
	
	
	//$scope.myForm.$invalid = false;
	$scope.settings = {};
	$scope.settings.broker = "169.46.147.14";
	$scope.settings.port = "9001";
	$scope.settings.clientID = "krishi_IoT_app"+Math.floor( Math.random() * 1000 );
	
	$scope.onConnect = function onConnect() {
		$ionicLoading.hide();
		// Once a connection has been made, make a subscription and send a message.		
		//$cordovaToast.showLongBottom("Connected!");
		//$scope.myForm.invalid = true;
		console.log("onConnect:: SUCCESS");
		//automatically subscribe to incoming messages targeted to itself.
		$rootScope.client.subscribe(subscribe2Topic);
		console.log("Subscribed to topic: "+subscribe2Topic);
		
		//ONCE CONNECTED - SEND ONE REG PACKET
		regMsg = '{"appID":"'+$scope.settings.clientID+'"}';
		var message = new Paho.MQTT.Message(regMsg);
		message.destinationName = publish2Topic;
		$rootScope.client.send(message); 
		console.log("Published to topic: "+publish2Topic+" message:"+regMsg);
	}
	
	$scope.onFail = function onFail(message) {
		//$scope.myForm.invalid = false;
		$ionicLoading.hide()
		alert("Connection failed: " + message.errorMessage + "\nRetry!");
	}
	
	$scope.connect2Broker = function() {
		$ionicLoading.show();
		console.log("broker: "+JSON.stringify($scope.settings));
		
		// Create a client instance
		$rootScope.client = new Paho.MQTT.Client($scope.settings.broker, Number($scope.settings.port), $scope.settings.clientID);
		
		// called when a message arrives
		$rootScope.client.onMessageArrived = function(message) {
			$rootScope.data = message;
			$rootScope.$broadcast( 'msg', $rootScope.data.payloadString);
			sessionService.set("packet", $rootScope.data.payloadString);
		}
		$rootScope.client.onConnectionLost = function(responseObject){
			if (responseObject.errorCode !== 0) {
				alert("Connection is lost!"+responseObject.errorMessage);
			}
		}
		
		var willMsg = new Paho.MQTT.Message("{'die':'No power'}");
		willMsg.destinationName = publish2Topic;
		// connect the client
		if((typeof($scope.settings.username) === null) | (typeof($scope.settings.username)=== "undefined")) {
			$rootScope.client.connect({
				timeout: 10,
				useSSL: false,
				//cleanSession: false,
				//userName: $scope.settings.username,
				//password: $scope.settings.pwd,
				willMessage: willMsg,
				onSuccess: $scope.onConnect,						
				onFailure: $scope.onFail
			});
		} else { //userName & PWD provided
			$rootScope.client.connect({
				timeout: 10,
				useSSL: false,
				//cleanSession: false,
				userName: $scope.settings.username,
				password: $scope.settings.pwd,
				willMessage: willMsg,
				onSuccess: $scope.onConnect,						
				onFailure: $scope.onFail
			});
		}

	}
})

.controller('AboutCtrl', function($scope) {
})

.controller('regLangCtrl', function($scope) {
	$scope.names = ["English", "Hindi", "Tamil", "Telugu"];
	$scope.updateLanguage = function(selectedItem) {
		alert("selected: "+selectedItem);
		$scope.googleTranslateElementInit();
	}
	$scope.googleTranslateElementInit = function() {
		new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
	}
		
})

.controller('PopupCtrl', function($scope, $ionicPopup) {
	// Triggered on a button click, or some other target
	 $scope.login = function() {
	   $scope.data = {}

	   // An elaborate, custom popup
	   var myPopup = $ionicPopup.show({
		 template: '<label class="item item-input"><input type="text" ng-model="ph_no" placeholder="Phone number"></label><br>\
					<label class="item item-input"><input type="password" ng-model="ph_password" placeholder="Password"></label>',
		 title: 'Login here',
		 subTitle: 'Enter valid mobile number',
		 scope: $scope,
		 buttons: [{ text: 'Cancel' },{
			 text: '<b>Login</b>',
			 type: 'button-balanced',
			 onTap: function(e) {
			   if (!$scope.ph_no) {
				 //don't allow to close unless entered ph_no
				 e.preventDefault();
			   } else {
				 return $scope.ph_no;
			   }
			 }
		   },]
	   });
	  };
});

