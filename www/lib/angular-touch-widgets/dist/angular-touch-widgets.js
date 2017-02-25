"use strict";
(function(angular) {
  angular.module('angularTouchWidgets.config', ['ionic']).value('angularTouchWidgets.config', {debug: true});
  angular.module('angularTouchWidgets.directives', []);
  angular.module('angularTouchWidgets', ['angularTouchWidgets.config', 'angularTouchWidgets.directives']);
})(angular);

"use strict";
angular.module('angularTouchWidgets.directives.clockEditor', []).directive('clockEditor', function() {
  return {
    restrict: "E",
    scope: {
      from: '=',
      to: '='
    },
    template: '<div style="margin: auto; height: 250px; width: 350px;" on-drag-start="onTouch($event)" on-drag-end="onRelease()" on-drag="drag($event)">\
                    <svg id="clock-editor" height="250" width="350">\
                        <defs>\
                            <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                            </filter>\
                        </defs>\
                        <g>\
                            <circle cx="175" cy="125" r="100" fill="white"></circle>\
                            <path fill="#eee" d="M 175 25 A 100 100 0 0 1 225 38L 175 125"></path>\
                            <path fill="#eee" d="M 261 75 A 100 100 0 0 1 275 125L 175 125"></path>\
                            <path fill="#eee" d="M 261 175 A 100 100 0 0 1 225 211L 175 125"></path>\
                            <path fill="#eee" d="M 175 225 A 100 100 0 0 1 125 211L 175 125"></path>\
                            <path fill="#eee" d="M 88 175 A 100 100 0 0 1 75 125L 175 125"></path>\
                            <path fill="#eee" d="M 88 74 A 100 100 0 0 1 124 38L 175 125"></path>\
                        </g>\
                        <g>\
                            <circle cx="175" cy="125" r="70" fill="white"></circle>\
                            <path fill="#eee" d="M 210 64 A 70 70 0 0 1 235 90L 175 125"></path>\
                            <path fill="#eee" d="M 245 125 A 70 70 0 0 1 235 160L 175 125"></path>\
                            <path fill="#eee" d="M 210 185 A 70 70 0 0 1 175 195L 175 125"></path>\
                            <path fill="#eee" d="M 140 185 A 70 70 0 0 1 114 160L 175 125"></path>\
                            <path fill="#eee" d="M 105 125 A 70 70 0 0 1 114 90L 175 125"></path>\
                            <path fill="#eee" d="M 139 64 A 70 70 0 0 1 175 55L 175 125"></path>\
                        </g>\
                        <path class="content-selection" ng-attr-d="{{ semiCircle }}" filter="url(#shadow-{{$id}})"></path>\
                        <circle id="test" cx="175" cy="125" r="100" stroke="black" fill="transparent" stroke-width="6" filter="url(#shadow-{{$id}})"></circle>\
                        <g fill="#555">\
                            <text x="167" y="47">\
                                00\
                            </text>\
                            <text x="210" y="57">\
                                13\
                            </text>\
                            <text x="242" y="88">\
                                14\
                            </text>\
                            <text x="252" y="129">\
                                15\
                            </text>\
                            <text x="241" y="171">\
                                16\
                            </text>\
                            <text x="210" y="203">\
                                17\
                            </text>\
                            <text x="168" y="215">\
                                18\
                            </text>\
                            <text x="128" y="203">\
                                19\
                            </text>\
                            <text x="96" y="171">\
                                20\
                            </text>\
                            <text x="85" y="129">\
                                21\
                            </text>\
                            <text x="95" y="88">\
                                22\
                            </text>\
                            <text x="125" y="57">\
                                23\
                            </text>\
                        </g>\
                        <g fill="#555">\
                            <text x="168" y="72">\
                                12\
                            </text>\
                            <text x="199" y="80">\
                                1\
                            </text>\
                            <text x="221" y="100">\
                                2\
                            </text>\
                            <text x="228" y="129">\
                                3\
                            </text>\
                            <text x="221" y="159">\
                                4\
                            </text>\
                            <text x="200" y="181">\
                                5\
                            </text>\
                            <text x="171" y="189">\
                                6\
                            </text>\
                            <text x="142" y="181">\
                                7\
                            </text>\
                            <text x="121" y="158">\
                                8\
                            </text>\
                            <text x="112" y="129">\
                                9\
                            </text>\
                            <text x="119" y="101">\
                                10\
                            </text>\
                            <text x="137" y="81">\
                                11\
                            </text>\
                        </g>\
                        <text ng-attr-x="{{fromPos.x-20}}" ng-attr-y="{{fromPos.y+9}}" font-size="20">\
                            {{ from }}\
                        </text>\
                        <text ng-attr-x="{{toPos.x-20}}" ng-attr-y="{{toPos.y+9}}" font-size="20">\
                            {{ to }}\
                        </text>\
                    </svg>\
                </div>',
    controller: function($scope, $ionicScrollDelegate) {
      var baseTime;
      var centerPos;
      var lastAngle;
      var lastInverted;
      var touching = false;
      var element;
      var drawRange = function() {
        var parsedFrom = parseTime($scope.from);
        var parsedTo = parseTime($scope.to);
        var fromAngle = -90 + (parsedFrom.hours * 30 + parsedFrom.minutes * 0.5);
        var toAngle = -90 + (parsedTo.hours * 30 + parsedTo.minutes * 0.5);
        $scope.semiCircle = regularSemiCircle(175, 125, 100, fromAngle, toAngle, false);
        $scope.fromPos = positionOnCircle(175, 125, 100, fromAngle, 40, 14);
        $scope.toPos = positionOnCircle(175, 125, 100, toAngle, 40, 14);
      };
      var greaterOrEquialTime = function(time1, time2) {
        var parsedTime1 = parseTime(time1);
        var parsedTime2 = parseTime(time2);
        return (parsedTime1.hours > parsedTime2.hours) || ((parsedTime1.hours == parsedTime2.hours) && (parsedTime1.minutes >= parsedTime2.minutes));
      };
      var greaterTime = function(time1, time2) {
        var parsedTime1 = parseTime(time1);
        var parsedTime2 = parseTime(time2);
        return (parsedTime1.hours > parsedTime2.hours) || ((parsedTime1.hours == parsedTime2.hours) && (parsedTime1.minutes > parsedTime2.minutes));
      };
      $scope.onTouch = function(event) {
        touching = true;
        $ionicScrollDelegate.freezeAllScrolls(true);
        var firstTouch = {
          x: event.gesture.touches[0].clientX,
          y: event.gesture.touches[0].clientY
        };
        var offset = event.currentTarget.getBoundingClientRect();
        centerPos = {
          x: offset.left + 175,
          y: offset.top + 125
        };
        baseTime = getModule(centerPos.x, centerPos.y, firstTouch.x, firstTouch.y) < 70 ? 0 : 12;
        lastAngle = getAngle(centerPos.x, centerPos.y, firstTouch.x, firstTouch.y);
        $scope.from = "" + (parseInt(lastAngle / 30) + baseTime) + ':' + ((lastAngle % 30) < 15 ? '00' : '30');
        $scope.to = $scope.from;
        lastInverted = false;
      };
      $scope.onRelease = function() {
        touching = false;
        $ionicScrollDelegate.freezeAllScrolls(false);
      };
      $scope.drag = function(event) {
        if (touching) {
          var lastTouch = {
            x: event.gesture.touches[0].clientX,
            y: event.gesture.touches[0].clientY
          };
          var angle = getAngle(centerPos.x, centerPos.y, lastTouch.x, lastTouch.y);
          if ((lastAngle > 270 && angle < 90) || (angle > 270 && lastAngle < 90)) {
            baseTime = baseTime === 0 ? 12 : 0;
          }
          lastAngle = angle;
          var time = "" + (parseInt(lastAngle / 30) + baseTime) + ':' + ((lastAngle % 30) < 15 ? '00' : '30');
          var inverted;
          if (lastInverted) {
            inverted = !greaterTime(time, $scope.to);
          } else {
            inverted = !greaterOrEquialTime(time, $scope.from);
          }
          if (inverted) {
            $scope.from = time;
          } else {
            $scope.to = time;
          }
          lastInverted = inverted;
        }
      };
      $scope.$watch('from', function() {
        drawRange();
      });
      $scope.$watch('to', function() {
        drawRange();
      });
      drawRange();
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.clockViewer', []).directive('clockViewer', function() {
  return {
    restrict: "E",
    scope: {
      from: '=',
      to: '=',
      onTab: '&'
    },
    replace: true,
    template: '<div>\
                    <svg class="clock-viewer" height="200" width="240" on-tap="onClick()">\
                        <defs>\
                            <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                            </filter>\
                        </defs>\
                        <g filter="url(#shadow-{{$id}})">\
                            <circle id="test" cx="115" cy="100" r="70" fill="white"></circle>\
                            <path class="content-selection" ng-attr-d="{{ semiCircle }}"></path>\
                            <circle id="test" cx="115" cy="100" r="65" stroke="white" fill="transparent" stroke-width="8"></circle>\
                            <circle id="test" cx="115" cy="100" r="70" stroke="black" fill="transparent" stroke-width="6"></circle>\
                        </g>\
                        <text ng-attr-x="{{fromPos.x-20}}" ng-attr-y="{{fromPos.y+7}}" font-size="14">\
                                {{ from }}\
                        </text>\
                        <text ng-attr-x="{{toPos.x-20}}" ng-attr-y="{{toPos.y+7}}" font-size="14">\
                            {{ to }}\
                        </text>\
                    </svg>\
                </div>',
    controller: function($scope) {
      var drawRange = function() {
        var parsedFrom = parseTime($scope.from);
        var parsedTo = parseTime($scope.to);
        var fromAngle = -90 + (parsedFrom.hours * 30 + parsedFrom.minutes * 0.5);
        var toAngle = -90 + (parsedTo.hours * 30 + parsedTo.minutes * 0.5);
        $scope.semiCircle = regularSemiCircle(115, 100, 70, fromAngle, toAngle, false);
        $scope.fromPos = positionOnCircle(115, 100, 70, fromAngle, 24, 14);
        $scope.toPos = positionOnCircle(115, 100, 70, toAngle, 24, 14);
      };
      drawRange();
      $scope.$watch('from', function() {
        drawRange();
      });
      $scope.$watch('to', function() {
        drawRange();
      });
    }
  };
});
function parseTime(time) {
  var r = time.split(":");
  return {
    hours: parseInt(r[0]),
    minutes: parseInt(r[1])
  };
}

"use strict";
angular.module('angularTouchWidgets.directives', ['angularTouchWidgets.directives.modeSelector', 'angularTouchWidgets.directives.lightViewer', 'angularTouchWidgets.directives.lightColorEditor', 'angularTouchWidgets.directives.lightIntensityEditor', 'angularTouchWidgets.directives.clockViewer', 'angularTouchWidgets.directives.timerViewer', 'angularTouchWidgets.directives.clockEditor', 'angularTouchWidgets.directives.timerEditor', 'angularTouchWidgets.directives.thermometerEditor', 'angularTouchWidgets.directives.phViewer', 'angularTouchWidgets.directives.orpViewer', 'angularTouchWidgets.directives.onOffButton']);
function regularArcData(cx, cy, radius, startDegrees, endDegrees, isCounterClockwise) {
  var offsetRadians = 0;
  var sweepFlag = (isCounterClockwise) ? 0 : 1;
  var startRadians = offsetRadians + startDegrees * Math.PI / 180;
  var endRadians = offsetRadians + endDegrees * Math.PI / 180;
  var largeArc = ((endRadians - startRadians) % (2 * Math.PI)) > Math.PI ? 1 : 0;
  var startX = (cx + radius * Math.cos(startRadians));
  var startY = (cy + radius * Math.sin(startRadians));
  var endX = (cx + radius * Math.cos(endRadians));
  var endY = (cy + radius * Math.sin(endRadians));
  var space = " ";
  var arcData = "";
  arcData += "M" + space + startX + space + startY + space;
  arcData += "A" + space + radius + space + radius + space + offsetRadians + space + largeArc + space + sweepFlag + space + endX + space + endY;
  return (arcData);
}
function regularSemiCircle(cx, cy, radius, startDegrees, endDegrees, isCounterClockwise) {
  var space = " ";
  var arcData = regularArcData(cx, cy, radius, startDegrees, endDegrees - 0.0001, isCounterClockwise);
  arcData += "L" + space + cx + space + cy;
  return arcData;
}
function positionOnCircle(cx, cy, radius, degrees, extraX, extraY) {
  var offsetRadians = 0;
  var startRadians = offsetRadians + degrees * Math.PI / 180;
  var x = parseInt(cx + (radius + extraX) * Math.cos(startRadians));
  var y = parseInt(cy + (radius + extraY) * Math.sin(startRadians));
  return {
    x: x,
    y: y
  };
}
function parseTime(time) {
  var r = time.split(":");
  return {
    hours: parseInt(r[0]),
    minutes: parseInt(r[1])
  };
}
function getAngle(y1, x1, y2, x2) {
  var tangent = (x2 - x1) / (y2 - y1);
  var ang = Math.atan(tangent);
  if (y2 - y1 < 0)
    ang += Math.PI;
  return ang * 180 / Math.PI + 90;
}
function getModule(x1, y1, x2, y2) {
  var x = x2 - x1;
  var y = y2 - y1;
  return Math.sqrt(x * x + y * y);
}

"use strict";
angular.module('angularTouchWidgets.directives.lightColorEditor', []).directive('lightColorEditor', function($animate) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      color: '=',
      img: '@'
    },
    template: '<div style="height: 300px; width: 300px; margin: auto; position: relative;">\
                    <canvas var="1" width="300" height="300" on-tap="colorClick($event)"></canvas>\
                    <div ng-style="{\'background-color\': \'rgb(\'+color.r+\',\'+color.g+\',\'+color.b+\')\'}" style="position: absolute; top: 120px; left: 120px; height: 60px; width: 60px; border-radius: 50%; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.46); transition: background 0.1s; -webkit-transition: background 0.1s"></div>\
                </div>',
    link: function(scope, element) {
      var ctx = element.children()[0].getContext('2d');
      var selection = angular.element(element.children()[1]);
      var image = new Image();
      image.onload = function() {
        ctx.drawImage(image, 0, 0, 300, 300);
      };
      image.src = scope.img || 'img/light-color-editor.png';
      var animateClick = function() {
        $animate.addClass(selection, 'pulse animated-quick').then(function() {
          selection.removeClass('pulse animated-quick');
        });
      };
      scope.colorClick = function(event) {
        var touch = {
          x: event.gesture.touches[0].clientX,
          y: event.gesture.touches[0].clientY
        };
        var offset = event.currentTarget.getBoundingClientRect();
        var pixel = ctx.getImageData(touch.x - offset.left, touch.y - offset.top, 1, 1).data;
        if (pixel[3] !== 0) {
          angular.copy({
            r: pixel[0],
            g: pixel[1],
            b: pixel[2]
          }, scope.color);
          animateClick();
        }
      };
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.lightIntensityEditor', []).directive('lightIntensityEditor', function() {
  return {
    restrict: "E",
    replace: true,
    scope: {intensity: '='},
    template: '<div class="range range-positive" style="width: 100%">\
                    <i class="icon ion-ios-sunny-outline"></i>\
                    <input type="range" name="volume" min="0" max="100" ng-model="intensity">\
                    <i class="icon ion-ios-sunny"></i>\
                </div>'
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.lightViewer', []).directive('lightViewer', function() {
  return {
    restrict: "E",
    replace: true,
    scope: {
      on: '=?',
      mode: '=?',
      canTurnOff: '=?',
      isRgb: '=?',
      onTab: '&',
      light: '=?',
      modeStatic: '=?',
      modeAnimated: '=?'
    },
    template: '  <div class="light-viewer" style="position: relative; height: 260px; width: 240px;">\
                            <svg class="fx-zoom-normal" height="260" width="240" style="position: absolute;" ng-show="(on || !canTurnOff)">\
                                <defs>\
                                    <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                        <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                        <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                        <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                                    </filter>\
                                </defs>\
                                <path fill="transparent" stroke-linecap="round" stroke="white" stroke-width="20" d="M 47 195 A 105 105 0 1 1 182 195" filter="url(#shadow-{{$id}})" stroke on-tap="onClick()"></path>\
                                <path fill="transparent" stroke-linecap="round" stroke="#ccc" stroke-width="2" d="M 47 195 A 105 105 0 1 1 182 195" on-tap="onClick()"></path>\
                                <path class="line-selection" fill="transparent" stroke-linecap="round" stroke-width="6" ng-attr-d="{{ arc }}" on-tap="onClick()"></path>\
                            </svg>\
                            <svg class="show-hide-opacity ng-hide" ng-show="canTurnOff" height="260" width="240" style="position: absolute;">\
                                <defs>\
                                    <filter id="button-shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                        <feOffset result="offOut" in="SourceGraphic" dx="1" dy="4"></feOffset>\
                                        <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                        <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                                    </filter>\
                                </defs>\
                                \
                                <g on-tap="toggle()">\
                                    <path class="show-hide-opacity button-on-svg" ng-hide="on" fill="transparent" stroke-width="40" d="M 166 204 A 103 103 0 0 1 63 204" filter="url(#button-shadow-{{$id}})"></path>\
                                    <path class="show-hide-opacity button-off-svg" ng-show="on" fill="transparent" stroke-width="40" d="M 166 204 A 103 103 0 0 1 63 204" filter="url(#button-shadow-{{$id}})"></path>\
                                </g>\
                            </svg>\
                            <div style="height: 0; position: absolute; top: 41px; left: 39px;">\
                                <div class="fx-rotate-clock round-button center override button-shadow ng-hide" ng-show="isRgb && (on || !canTurnOff) && mode===\'static\'" ng-style="{\'background-color\': \'rgb(\'+modeStatic.color.r+\',\'+modeStatic.color.g+\',\'+modeStatic.color.b+\')\'}" on-tap="onClick()">\
                                </div>\
                                <div class="fx-rotate-clock round-button center override button-shadow ng-hide" ng-show="isRgb && (on || !canTurnOff) && mode===\'animation\'" style="overflow: hidden;">\
                                    <div class="animated-color" style="height: 100%; width: 100%;" ng-style="{\'-webkit-animation-duration\': modeAnimated.speed+\'s\', \'animation-duration\': modeAnimated.speed+\'s\', \'-webkit-animation-name\': modeAnimated.animation, \'animation-name\': modeAnimated.animation}" on-tap="onClick()"></div>\
                                </div>\
                                <div class="fx-rotate-clock round-button center override button-on button-shadow ng-hide" ng-show="!isRgb && (on || !canTurnOff)" style="height: 150px; width: 150px;" on-tap="onClick()">\
                                    <span style="font-size: 42px;">{{ modeStatic.intensity }}%</span>\
                                </div>\
                                <div class="fx-rotate-clock round-button center override button-off button-shadow ng-hide" ng-show="!(on || !canTurnOff)" on-tap="toggle()">\
                                    <span style="font-size: 34px; color: white;">Apagado</span>\
                                </div>\
                            </div>\
                            <div class="center show-hide-opacity" ng-show="canTurnOff" style="position: absolute; top: 197px; left: 65px; height: 40px; width: 100px;" on-tap="toggle()">\
                                <i class="icon ion-power" style="color: white; font-size: 26px;"></i>\
                            </div>\
                        </div>',
    controller: function($scope) {
      if ($scope.light) {
        $scope.modeStatic = $scope.light;
      }
      if ($scope.on === undefined) {
        $scope.on = true;
      }
      if ($scope.canTurnOff === undefined) {
        $scope.canTurnOff = true;
      }
      if ($scope.isRgb === undefined) {
        $scope.isRgb = true;
      }
      $scope.mode = $scope.mode || 'static';
      $scope.modeStatic = $scope.modeStatic || {
        color: {
          r: 0,
          g: 0,
          b: 0
        },
        intensity: 0
      };
      $scope.modeAnimated = $scope.modeAnimated || {
        animation: "mode1",
        speed: 1
      };
      var drawRange = function() {
        if (!$scope.isRgb || $scope.mode === 'static') {
          $scope.arc = regularArcData(115, 115, 105, 130, 135 + ($scope.modeStatic.intensity * 2.75), false);
        } else {
          $scope.arc = regularArcData(115, 115, 105, 130, 135 + ($scope.modeAnimated.speed * 27.5), false);
        }
      };
      drawRange();
      $scope.$watch('modeStatic.intensity', function() {
        drawRange();
      });
      $scope.$watch('modeAnimated.speed', function() {
        drawRange();
      });
      $scope.$watch('mode', function() {
        drawRange();
      });
      $scope.toggle = function() {
        $scope.on = !$scope.on;
      };
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.modeSelector', []).directive('modeSelector', function() {
  return {
    restrict: "E",
    scope: {
      modes: '=',
      selectedMode: '='
    },
    template: '<div class="mode-selector" ng-class="selectedMode" style="height: 26px; width: 250px; float: right; margin: 10px 10px 10px 0" on-tap="changeMode()">\
                    <div style="height: 100%; width: 100%; transform: translate(112px); -webkit-transform: translate(112px)">\
                        <div on-tap="changeMode()" class="button-shadow" style="overflow: hidden; position: absolute; width: 40px;height: 40px; border-radius: 20px; transform: translate(125px); -webkit-transform: translate(125px); margin-left: -17px; margin-top: -6px;">\
                            <div class="mode-selector-botton background-animation" style="height: 100%; width: 100%;"></div>\
                        </div>\
                        <div class="transform-animation" style="height: 100%; width: 100%; position: absolute; top: 0; left: 0;" ng-style="{transform: \'rotate(\'+ showMode * (-360 / modes.length)+\'deg)\', \'-webkit-transform\': \'rotate(\'+ showMode * (-360 / modes.length)+\'deg)\'}">\
                            <div ng-repeat="mode in modes" class="show-hide-opacity" ng-style="{transform: \'rotate(\'+ $index * (360 / modes.length) +\'deg) translate(-125px)\', \'-webkit-transform\': \'rotate(\'+ $index * (360 / modes.length) +\'deg) translate(-125px)\'}" style="width: 250px; height: 26px; text-align: end; position: absolute;" ng-show="currentMode==$index">\
                                <span style="margin-right: 20px">\
                                    {{ mode.display }}\
                                </span>\
                                <i class="{{ mode.icon }}" style="margin-right: -15px; font-size: 30px; vertical-align: middle;"></i>\
                            </div>\
                        </div>\
                    </div>\
                </div>',
    controller: function($scope) {
      var getNumberOfMode = function(selectedMode) {
        var modesNames = [];
        angular.forEach($scope.modes, function(mode) {
          modesNames.push(mode.name);
        });
        var index = modesNames.indexOf(selectedMode);
        if (index == -1) {
          index = 0;
        }
        return index;
      };
      $scope.showMode = $scope.currentMode = getNumberOfMode($scope.selectedMode);
      $scope.selectedMode = $scope.modes[$scope.currentMode].name;
      $scope.changeMode = function() {
        $scope.showMode = $scope.showMode + 1;
        $scope.currentMode = $scope.showMode % $scope.modes.length;
        $scope.selectedMode = $scope.modes[$scope.currentMode].name;
      };
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.onOffButton', []).directive('onOffButton', function() {
  return {
    restrict: "E",
    replace: true,
    scope: {on: '='},
    template: '  <div>\
                            <div class="on-off-button" style="position: relative;">\
                                <svg height="260" width="230">\
                                    <defs>\
                                        <filter id="button-shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                            <feOffset result="offOut" in="SourceGraphic" dx="1" dy="4"></feOffset>\
                                            <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                            <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                                        </filter>\
                                    </defs>\
                                    <g on-tap="toggle()">\
                                        <path class="show-hide-opacity button-on-svg" ng-hide="on" fill="transparent" stroke-width="40" d="M 166 204 A 103 103 0 0 1 63 204" filter="url(#button-shadow-{{$id}})"></path>\
                                        <path class="show-hide-opacity button-off-svg" ng-show="on" fill="transparent" stroke-width="40" d="M 166 204 A 103 103 0 0 1 63 204" filter="url(#button-shadow-{{$id}})"></path>\
                                    </g>\
                                </svg>\
                                <div class="center" style="position: absolute; top: 197px; left: 65px; height: 40px; width: 100px;" on-tap="toggle()">\
                                    <i class="icon ion-power" style="color: white; font-size: 26px;"></i>\
                                </div>\
                                <div style="position: absolute; top: 41px; left: 39px;">\
                                    <div class="fx-rotate-clock round-button center override button-off button-shadow" ng-hide="on" on-tap="toggle()">\
                                        <span style="font-size: 34px; color: white;">Apagado</span>\
                                    </div>\
                                    <div class="fx-rotate-clock round-button center override button-on button-shadow" ng-show="on" on-tap="toggle()">\
                                        <span style="font-size: 30px;">Encendido</span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>',
    controller: function($scope) {
      $scope.toggle = function() {
        $scope.on = !$scope.on;
      };
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.orpViewer', []).directive('orpViewer', function() {
  return {
    restrict: "E",
    scope: {orp: '='},
    replace: true,
    template: '<div class="meter">\
                    <svg height="320" width="120" style="margin-left: 20px;">\
                        <defs>\
                            <clipPath id="orpClipPath" clipPathUnits="userSpaceOnUse">\
                                <rect width="32" height="300" ry="16" y="10" x="30" stroke="black" fill="transparent" stroke-width="6"></rect>\
                            </clipPath>\
                            <clipPath id="orpClipPath2" clipPathUnits="userSpaceOnUse">\
                                <rect width="20" height="60" y="130" x="0"></rect>\
                                <rect width="20" height="60" y="130" x="72"></rect>\
                            </clipPath>\
                            <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                            </filter>\
                        </defs>\
                        <g filter="url(#shadow-{{$id}})">\
                            <rect width="82" height="50" y="135" x="5" fill="transparent" stroke="#0F0" stroke-width="4" clip-path="url(#orpClipPath2)"></rect>\
                            <g clip-path="url(#orpClipPath)">\
                                <rect width="32" height="43" y="10" x="30" fill="#FBFA4F"></rect>\
                                <rect width="32" height="43" y="53" x="30" fill="#F9F944"></rect>\
                                <rect width="32" height="43" y="96" x="30" fill="#D9F531"></rect>\
                                <rect width="32" height="43" y="139" x="30" fill="#A5E939"></rect>\
                                <rect width="32" height="43" y="182" x="30" fill="#68D62E"></rect>\
                                <rect width="32" height="43" y="225" x="30" fill="#2CBD34"></rect>\
                                <rect width="32" height="43" y="268" x="30" fill="#297C37"></rect>\
                            </g>\
                            <rect width="32" height="300" ry="16" y="10" x="30" stroke="black" fill="transparent" stroke-width="6"></rect>\
                        </g>\
                        <g ng-attr-transform="translate(28,{{posY}})" filter="url(#shadow-{{$id}})">\
                            <path transform="translate(0,-13)" fill="#f00" stroke="#000" stroke-width="2" d="M84.3022,22.3106 C84.2473,33.4926 75.1392,42.5115 63.9571,42.4565 C59.157,42.4329 54.5029,41.0224 51.298,37.9296 C45.0185,31.87 35.0221,25.6927 8.0808,24.1617 C7.10067,24.106 5.02515,23.916 5.049,22.0121 C5.07283,20.1095 7.13818,19.8874 8.11693,19.8378 C35.0725,18.4714 45.3311,12.386 51.4531,6.36783 C54.6291,3.24565 59.3557,1.94202 64.1562,1.96561 C75.338,2.02058 84.3572,11.1316 84.3022,22.3106 Z"></path>\
                            <text x="45" y="16" font-size="22" fill="white">\
                                {{ orp_text }}\
                            </text>\
                        </g>\
                    </svg>\
                </div>',
    controller: function($scope) {
      $scope.$watch('orp', function() {
        $scope.posY = (Math.log($scope.orp) / Math.LN2 + 3) * (300 / 7) + 21;
        $scope.orp_text = $scope.orp.toFixed(1);
      });
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.phViewer', []).directive('phViewer', function() {
  return {
    restrict: "E",
    scope: {ph: '='},
    replace: true,
    template: '<div class="meter">\
                    <svg height="320" width="120" style="margin-left: 20px;">\
                        <defs>\
                            <clipPath id="phClipPath" clipPathUnits="userSpaceOnUse">\
                                <rect width="32" height="300" ry="16" y="10" x="30" stroke="black" fill="transparent" stroke-width="6"></rect>\
                            </clipPath>\
                            <clipPath id="phClipPath2" clipPathUnits="userSpaceOnUse">\
                                <rect width="20" height="60" y="130" x="0"></rect>\
                                <rect width="20" height="60" y="130" x="72"></rect>\
                            </clipPath>\
                            <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                            </filter>\
                        </defs>\
                        <g filter="url(#shadow-{{$id}})">\
                            <rect width="82" height="50" y="135" x="5" fill="transparent" stroke="#0F0" stroke-width="4" clip-path="url(#phClipPath2)"></rect>\
                            <g clip-path="url(#phClipPath)">\
                                <rect width="32" height="20" y="10" x="30" fill="#CE231C"></rect>\
                                <rect width="32" height="20" y="30" x="30" fill="#E1332C"></rect>\
                                <rect width="32" height="20" y="50" x="30" fill="#EC672E"></rect>\
                                <rect width="32" height="20" y="70" x="30" fill="#F3912C"></rect>\
                                <rect width="32" height="20" y="90" x="30" fill="#F4AE2A"></rect>\
                                <rect width="32" height="20" y="110" x="30" fill="#F1E81F"></rect>\
                                <rect width="32" height="20" y="130" x="30" fill="#D6D52D"></rect>\
                                <rect width="32" height="20" y="150" x="30" fill="#84BB3B"></rect>\
                                <rect width="32" height="20" y="170" x="30" fill="#29A340"></rect>\
                                <rect width="32" height="20" y="190" x="30" fill="#119147"></rect>\
                                <rect width="32" height="20" y="210" x="30" fill="#1E8073"></rect>\
                                <rect width="32" height="20" y="230" x="30" fill="#3B5F9D"></rect>\
                                <rect width="32" height="20" y="250" x="30" fill="#384579"></rect>\
                                <rect width="32" height="20" y="270" x="30" fill="#3F2B6A"></rect>\
                                <rect width="32" height="20" y="290" x="30" fill="#342550"></rect>\
                            </g>\
                            <rect width="32" height="300" ry="16" y="10" x="30" stroke="black" fill="transparent" stroke-width="6"></rect>\
                        </g>\
                        <g ng-attr-transform="translate(28,{{posY}})" filter="url(#shadow-{{$id}})">\
                            <path transform="translate(0,-13)" fill="#f00" stroke="#000" stroke-width="2" d="M84.3022,22.3106 C84.2473,33.4926 75.1392,42.5115 63.9571,42.4565 C59.157,42.4329 54.5029,41.0224 51.298,37.9296 C45.0185,31.87 35.0221,25.6927 8.0808,24.1617 C7.10067,24.106 5.02515,23.916 5.049,22.0121 C5.07283,20.1095 7.13818,19.8874 8.11693,19.8378 C35.0725,18.4714 45.3311,12.386 51.4531,6.36783 C54.6291,3.24565 59.3557,1.94202 64.1562,1.96561 C75.338,2.02058 84.3572,11.1316 84.3022,22.3106 Z"></path>\
                            <text x="45" y="16" font-size="22" fill="white">\
                                {{ ph_text }}\
                            </text>\
                        </g>\
                    </svg>\
                </div>',
    controller: function($scope) {
      $scope.$watch('ph', function() {
        $scope.posY = ($scope.ph) * (300 / 15) + 10;
        $scope.ph_text = $scope.ph.toFixed(1);
      });
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.thermometerEditor', []).directive('thermometerEditor', function() {
  return {
    restrict: "E",
    scope: {
      actualTemp: '=',
      setTemp: '=',
      showActual: '@',
      minTemp: '@',
      maxTemp: '@'
    },
    replace: true,
    template: '  <svg width="170" height="300" on-tap="onTap($event)" on-drag-start="onTouch($event)" on-drag-end="onRelease()" on-drag="drag($event)" style="margin-left: 52px">\
                            <defs>\
                                <clipPath id="thermometerClipPath" clipPathUnits="userSpaceOnUse">\
                                    <path d="M54.933,7.69623 C40.936,7.69623 29.639,19.1202 29.639,33.3322 L29.639,183.306 C29.639,183.352 29.638,183.396 29.639,183.443 C16.057,192.031 7,207.31 7,224.752 C7,251.623 28.466,273.417 54.933,273.417 C81.4,273.417 102.867,251.623 102.867,224.752 C102.867,207.296 93.783,192.028 80.183,183.443 C80.183,183.396 80.183,183.352 80.183,183.306 L80.183,33.3322 C80.183,19.1202 68.931,7.69623 54.933,7.69623 Z"></path>\
                                </clipPath>\
                                <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                    <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                    <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                    <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                                </filter>\
                            </defs>\
                            <g filter="url(#shadow-{{$id}})">\
                                <g clip-path="url(#thermometerClipPath)">\
                                    <rect height="300" width="130" fill="white"></rect>\
                                    <rect class="content-selection" height="300" width="130" ng-attr-y="{{ setTempYPosition }}"></rect>\
                                    <rect class="secondary-content-selection" height="300" width="130" ng-attr-y="{{ actualTempYPosition }}" ng-show="actualTemp"></rect>\
                                    <path fill="none" stroke="white" stroke-width="18" stroke-miterlimit="4" d="M54.933,7.69623 C40.936,7.69623 29.639,19.1202 29.639,33.3322 L29.639,183.306 C29.639,183.352 29.638,183.396 29.639,183.443 C16.057,192.031 7,207.31 7,224.752 C7,251.623 28.466,273.417 54.933,273.417 C81.4,273.417 102.867,251.623 102.867,224.752 C102.867,207.296 93.783,192.028 80.183,183.443 C80.183,183.396 80.183,183.352 80.183,183.306 L80.183,33.3322 C80.183,19.1202 68.931,7.69623 54.933,7.69623 Z"></path>\
                                </g>\
                                <path fill="none" stroke="black" stroke-width="6" stroke-miterlimit="4" d="M54.933,7.69623 C40.936,7.69623 29.639,19.1202 29.639,33.3322 L29.639,183.306 C29.639,183.352 29.638,183.396 29.639,183.443 C16.057,192.031 7,207.31 7,224.752 C7,251.623 28.466,273.417 54.933,273.417 C81.4,273.417 102.867,251.623 102.867,224.752 C102.867,207.296 93.783,192.028 80.183,183.443 C80.183,183.396 80.183,183.352 80.183,183.306 L80.183,33.3322 C80.183,19.1202 68.931,7.69623 54.933,7.69623 Z"></path>\
                            </g>\
                            <text x="110" ng-attr-y="{{ setTempYPosition + 5 }}" font-size="20" ng-hide="showActual && (setTemp < actualTemp)">\
                                {{ setTemp }}°C\
                            </text>\
                            <text x="110" ng-attr-y="{{ actualTempYPosition + 5 }}" font-size="20" ng-show="showActual">\
                                {{ actualTemp }}°C\
                            </text>\
                        </svg>',
    controller: function($scope, $ionicScrollDelegate) {
      $scope.isActualTempShowed = $scope.showActual;
      if ($scope.isActualTempShowed === undefined) {
        $scope.isActualTempShowed = $scope.actualTemp !== undefined;
      }
      var touching = false;
      var minTemp = parseInt($scope.minTemp) || -20;
      var maxTemp = parseInt($scope.maxTemp) || 50;
      var height = 260;
      var offsetY = 10;
      var temperatureToPositionY = function(temperature) {
        var YPos = height * (temperature - minTemp) / (maxTemp - minTemp);
        return height - YPos + offsetY;
      };
      var positionYToTemperature = function(event) {
        var touch = {y: event.gesture.touches[0].clientY};
        var offset = event.currentTarget.getBoundingClientRect();
        var relativeTouch = touch.y - offset.top;
        var temp = Math.round((((height - relativeTouch + offsetY) / height) * (maxTemp - minTemp)) + minTemp);
        if (temp > maxTemp) {
          temp = maxTemp;
        } else if (temp < minTemp) {
          temp = minTemp;
        }
        return temp;
      };
      $scope.onTap = function(event) {
        $scope.onTouch(event);
        $scope.onRelease(event);
      };
      $scope.onTouch = function(event) {
        touching = true;
        $ionicScrollDelegate.freezeAllScrolls(true);
        $scope.setTemp = positionYToTemperature(event);
      };
      $scope.onRelease = function() {
        touching = false;
        $ionicScrollDelegate.freezeAllScrolls(false);
      };
      $scope.drag = function(event) {
        if (touching) {
          $scope.setTemp = positionYToTemperature(event);
        }
      };
      var drawYPosition = function() {
        if ($scope.isActualTempShowed) {
          $scope.actualTempYPosition = temperatureToPositionY($scope.actualTemp);
        }
        $scope.setTempYPosition = temperatureToPositionY($scope.setTemp);
      };
      drawYPosition();
      $scope.$watch('actualTemp', function() {
        drawYPosition();
      });
      $scope.$watch('setTemp', function() {
        drawYPosition();
      });
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.timerEditor', []).directive('timerEditor', function() {
  return {
    restrict: "E",
    scope: {
      time: '=',
      canBeZero: '=?'
    },
    template: '<div style="margin: auto; height: 250px; width: 350px;" on-drag-start="onDrag($event)" on-touch="onTouch($event)" on-drag-end="onRelease()" on-drag="drag($event)">\
                    <svg id="clock-editor" height="250" width="350">\
                        <defs>\
                            <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                            </filter>\
                        </defs>\
                        <g>\
                            <circle cx="175" cy="125" r="100" fill="white"></circle>\
                            <path fill="#eee" d="M 175 25 A 100 100 0 0 1 225 38L 175 125"></path>\
                            <path fill="#eee" d="M 261 75 A 100 100 0 0 1 275 125L 175 125"></path>\
                            <path fill="#eee" d="M 261 175 A 100 100 0 0 1 225 211L 175 125"></path>\
                            <path fill="#eee" d="M 175 225 A 100 100 0 0 1 125 211L 175 125"></path>\
                            <path fill="#eee" d="M 88 175 A 100 100 0 0 1 75 125L 175 125"></path>\
                            <path fill="#eee" d="M 88 74 A 100 100 0 0 1 124 38L 175 125"></path>\
                        </g>\
                        <path class="content-selection" ng-attr-d="{{ semiCircle }}" filter="url(#shadow-{{$id}})"></path>\
                        <circle id="test" cx="175" cy="125" r="100" stroke="black" fill="transparent" stroke-width="6" filter="url(#shadow-{{$id}})"></circle>\
                        <g fill="#555">\
                            <text x="167" y="47">\
                                0\
                            </text>\
                            <text x="210" y="57">\
                                5\
                            </text>\
                            <text x="242" y="88">\
                                10\
                            </text>\
                            <text x="252" y="129">\
                                15\
                            </text>\
                            <text x="241" y="171">\
                                20\
                            </text>\
                            <text x="210" y="203">\
                                25\
                            </text>\
                            <text x="168" y="215">\
                                30\
                            </text>\
                            <text x="128" y="203">\
                                35\
                            </text>\
                            <text x="96" y="171">\
                                40\
                            </text>\
                            <text x="85" y="129">\
                                45\
                            </text>\
                            <text x="95" y="88">\
                                50\
                            </text>\
                            <text x="125" y="57">\
                                55\
                            </text>\
                        </g>\
                    </svg>\
                </div>',
    controller: function($scope, $ionicScrollDelegate) {
      if ($scope.canBeZero === undefined) {
        $scope.canBeZero = true;
      }
      var touching = false;
      var drawRange = function() {
        var angle = -90 + ($scope.time * 6);
        $scope.semiCircle = regularSemiCircle(175, 125, 100, -90, angle, false);
      };
      var calculeTime = function(event) {
        var touch = {
          x: event.gesture.touches[0].clientX,
          y: event.gesture.touches[0].clientY
        };
        var offset = event.currentTarget.getBoundingClientRect();
        var centerPos = {
          x: 175 + offset.left,
          y: 125 + offset.top
        };
        var angle = getAngle(centerPos.x, centerPos.y, touch.x, touch.y);
        $scope.time = parseInt((angle + 20) / 30) * 5;
        if (!$scope.canBeZero && $scope.time == 0) {
          $scope.time = 5;
        }
      };
      $scope.onClick = function(event) {
        calculeTime(event);
      };
      $scope.onDrag = function(event) {
        touching = true;
        $ionicScrollDelegate.freezeAllScrolls(true);
        calculeTime(event);
      };
      $scope.onTouch = function(event) {
        calculeTime(event);
      };
      $scope.onRelease = function() {
        touching = false;
        $ionicScrollDelegate.freezeAllScrolls(false);
      };
      $scope.drag = function(event) {
        if (touching) {
          calculeTime(event);
        }
      };
      $scope.$watch('time', function() {
        drawRange();
      });
      drawRange();
    }
  };
});

"use strict";
angular.module('angularTouchWidgets.directives.timerViewer', []).directive('timerViewer', function() {
  return {
    restrict: "E",
    scope: {
      time: '=',
      onTab: '&'
    },
    replace: true,
    template: '<div>\
                    <svg class="clock-viewer" height="200" width="240" on-tap="onClick()">\
                        <defs>\
                            <filter id="shadow-{{$id}}" x="-200%" y="-200%" width="450%" height="450%">\
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2"></feOffset>\
                                <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0"></feColorMatrix>\
                                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>\
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>\
                            </filter>\
                        </defs>\
                        <g filter="url(#shadow-{{$id}})">\
                            <circle id="test" cx="115" cy="100" r="70" fill="white"></circle>\
                            <path class="content-selection" ng-attr-d="{{ semiCircle }}"></path>\
                            <circle id="test" cx="115" cy="100" r="65" stroke="white" fill="transparent" stroke-width="8"></circle>\
                            <circle id="test" cx="115" cy="100" r="70" stroke="black" fill="transparent" stroke-width="6"></circle>\
                        </g>\
                    </svg>\
                </div>',
    controller: function($scope) {
      var drawRange = function() {
        var angle = -90 + ($scope.time * 6);
        $scope.semiCircle = regularSemiCircle(115, 100, 70, -90, angle, false);
      };
      drawRange();
      $scope.$watch('time', function() {
        drawRange();
      });
    }
  };
});
