angular.module('appControllers').controller('FlareCtrl', ['$scope', 'FlareService', 'ConfigService', 'socket',
  '$filter', function($scope, FlareService, ConfigService, socket) {

    $scope.environmentId = "57603ea3e7829cf86f8f0dd5"; // Home
    $scope.deviceId = "576040ace7829cf86f8f0dde"; // Andrew's phone

//    $scope.environments = FlareService.getEnvironments(function(response) {
//      angular.forEach(response, function(user) {
//        // turn the 'value' promise into its value when it's available
//        user.info.then(function(response) {
//          user.info = response[0];
//        });
//      });
//    });

    $scope.getEnvironmentInfo = function() {
      FlareService.getEnvironmentInfo($scope.environmentId).then(function(data) {
        $scope.environment = data;
        var i, zoneId;
        for (i = 0 ; i < $scope.environment.zones.length ; i++) {
          zoneId = $scope.environment.zones[i]._id;
          FlareService.getThingsForZoneInEnvironment(zoneId, $scope.environmentId).then(function(data) {
            if (data !== undefined && data.length > 0) {
              var foundZone = $scope.environment.zones.find(function(z) {
                if (z._id === data[0].zone) {
                  return z;
                }
              });
              if (foundZone !== undefined) {
                foundZone.things = data;
              }
            }
          });
        }
      });
    };

    // define the function getting the list of packages and launch it straight away
    $scope.getDeviceInfo = function() {
      FlareService.getDeviceInfoInEnvironment($scope.deviceId, $scope.environmentId).then(function(data) {
        $scope.device = data;
      });
    };

    $scope.getEnvironmentInfo();
    $scope.getDeviceInfo();

    var subscriptionMsg = {
      environment: $scope.environmentId,
      all: true
    };
    socket.emit('subscribe', subscriptionMsg);

    /* Window events and other custom events that force a redraw */

    $(document).scroll(function() {
      // if anything needs to be done when the users scrolls the page, this is where you would do it
    });

    $(window).resize(function() {
      // if anything needs to be done when the window has been resized, this is where you would do it
    });

    // when the scope of the controller gets destroyed, do some clean up
    $scope.$on('$destroy', function() {
      // If you have set up timeouts or intervals, this is where you would destroy these timers
    });

    // Uncomment and adapt the section below to update the model when updates arrive using the socket.io connection

    // update users when socket.io updates are received.
    var socketupdate = function(obj) {
      console.log("FlareCtrl socket update", obj);
    };
    socket.on('web-app-template-socket-update', socketupdate);
  }]
);