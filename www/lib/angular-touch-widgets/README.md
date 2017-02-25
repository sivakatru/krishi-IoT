# angular-touch-widgets

A collection of simple and beautiful widgets developed for ionic framework

Demo
----

You can test the widget on the [demo page](http://spike886.github.io/angular-touch-widgets/demo)

Installation
------------

To install execute

    bower install angular-touch-widgets
    
Add the project files on your html

    <script src="bower/angular-touch-widgets/dist/angular-touch-widgets.js"></script>
    <link rel="stylesheet" href="bower/angular-touch-widgets/dist/angular-touch-widgets.css">
    
And inject angular-touch-widgets into your app

    var app = angular.module('YOUR_APP_NAME', ['ionic', 'angular-touch-widgets']);

Usage
-----

## Clock directives

### clock-editor

This widget let the user select time interval

**from**: Variable to store start time
**to**: Variable to store end time

```javascrip
var from = '01:00';
var to = '03:30';
```
```html
<clock-editor from="from" to="to"></clock-editor>
```

### clock-viewer

This widget let the user view time interval selected (usually used opening a modal with a editor on tab)

**from**: Variable storing start time
**to**: Variable storing end time
**on-tab**: Code to be executed on tab

```javascrip
var from = '01:00';
var to = '03:30';
var alert = function(){alert('click');};
```
```html
<clock-viewer from="from" to="to" on-tab="alert()"></clock-viewer>
```


## Time directives

### timer-editor

This widget let the user select the amount of minutes

**time**: Variable to store the amount of minutes
**can-be-zero**: Boolean value indicating if the user could select zero (default: true)

```javascrip
var time = '30';
```
```html
<timer-editor time="time" can-be-zero="false"></timer-editor>
```

### timer-viewer

This widget let the user view the selected amount of minutes (usually used opening a modal with a editor on tab)

**time**: Variable storing the amount of minutes
**on-tab**: Code to be executed on tab

```javascrip
var time = '30';
var alert = function(){alert('click');};
```
```html
<timer-viewer time="time" on-tab="alert()"></timer-viewer>
```


## Thermometer directives

### thermometer-editor

This widget let the user select temperature

**set-temp**: Variable to store the set temperature
**actual-temp**: Variable storing the actual temperature
**min-temp**: Integer used as minimum temperature (default: -20)
**max-temp**: Integer used as maximum temperature (default: 50)
**show-actual**: Boolean value that indicates if it should show temperature number of the actual-temp (default: false)

```javascrip
var actualTemp= 10;
var setTemp= 25;
```
```html
<thermometer-editor set-temp="setTemp" actual-temp="actualTemp" min-temp="0" max-temp="30"></thermometer-editor>
```


## ORP and PH directives

### orp-viewer

This widget let the user view the level of ORP on the water

**orp**: Variable storing the orp value

```javascrip
var orp= 1;
```
```html
<orp-viewer orp="orp"></orp-viewer>
```

### ph-viewer

This widget let the user view the level of PH on the water

**ph**: Variable storing the ph value

```javascrip
var ph=7;
```
```html
<ph-viewer ph="ph"></ph-viewer>
```


## Light directives

### light-intensity-editor

This widget let the user select the intensity of a light (this widget is usually used with light-color-editor to edit color and intensity)

**intensity**: Variable to store the intensity of the light

```javascrip
var light= {color: {r: 100, g: 0, b: 255}, intensity: 100};
```
```html
<light-intensity-editor intensity="light.intensity"></light-intensity-editor>
```

### light-color-editor

This widget let the user select the color of a light (this widget is usually used with light-intensity-editor to edit color and intensity)

**color**: Variable to store the color of the light
**img**: url used as color selector (default: img/light-color-editor.png)

You should include `light-color-editor.png` on you project to use this widget

```javascrip
var light= {color: {r: 100, g: 0, b: 255}, intensity: 100};
```
```html
<light-color-editor color="light.color" img="img/light-color-editor.png"></light-color-editor>
```

### light-viewer

This widget let the user view the selected color and intensity and also allow the user to switch off and on the light (usually used opening a modal with a color and intensity editor on tab)

**light**: Variable storing light object to be shown
**on**: Variable to store the on value of the light
**can-turn-off**: boolean value setting if it should allow to switch on and off the light (default: true)
**is-rgb**: boolean value setting if it should color value of the light (default: true)
**on-tab**: Code to be executed on tab over the widget (not the on/off button)

```javascrip
var light= {color: {r: 100, g: 0, b: 255}, intensity: 100};
var alert = function(){alert('click');};
```
```html
<light-viewer on="on" light="light" can-turn-off="false" is-rgb="true" on-tab="alert()"></light-viewer>
```


## On/off directives

### on-off-button

This widget let the user set on/off state of objects

**on**: Variable to store ON value

```javascrip
var onOff= false
```
```html
<on-off-button on="onOff"></on-off-button>
```


## Mode selector directives

### mode-selector

This widget let the user change between active modes

**on**: Variable to store ON value

```javascrip
var modes= [
            {
                display: 'Pinterest',
                name: 'pinterest',
                icon: 'fa fa-pinterest-p' //added fontawesome for this example
            },
            {
                display: 'Facebook',
                name: 'facebook',
                icon: 'fa fa-facebook' //added fontawesome for this example
            },
            {
                display: 'Twitter', 
                name: 'twitter', 
                icon: 'fa fa-twitter' //added fontawesome for this example
            }
        ];
var selectedMode= 'pinterest';
```
```css
.mode-selector.pinterest .mode-selector-botton{
    background-color: #BD081C;
}
.mode-selector.facebook .mode-selector-botton{
    background-color: #3B5998;
}
.mode-selector.twitter .mode-selector-botton{
    background-color: #1DA0F2;
}
.mode-selector i{
    color: white;
}
```
```html
<mode-selector modes="modes" selected-mode="selectedMode"></mode-selector>
```




