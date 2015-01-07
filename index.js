var HID = require('node-hid');
var light;
var counter;
var defaultColors = { 
      blue    : '0000ff',
      cyan    : '00ffff',
      green   : '00ff00',
      magenta : 'ff00ff',
      off     : '000000',
      red     : 'ff0000',
      white   : 'ffffff',
      yellow  : 'ffff00',
    };


function hexToRgb(hex) {
    if (hex in defaultColors){ 
      hex = defaultColors[hex];
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16)>>2,
        g: parseInt(result[2], 16)>>2,
        b: parseInt(result[3], 16)>>2
    } : null;
}

HID.devices().forEach( function(device) {
  if ( device.product.match(/Dream Cheeky/) ) {
    light = new HID.HID(device.path);

    var data1 = [ 0, 0x1F, 0x02, 0x00, 0x5F, 0x00, 0x00, 0x1F, 0x03 ];
    light.write(data1);

    var data2 = [ 0, 0x00, 0x02, 0x00, 0x5F, 0x00, 0x00, 0x1F, 0x04 ];
    light.write(data2);

    var data3 = [ 0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1F, 0x05 ];
    light.write(data3);

    var data4 = [ 0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 ];
    light.write(data4);

  }     
});

function sendColor(color) {
  var rgb = hexToRgb(color);
  if (rgb){
    var data = [ 0, rgb.r, rgb.g, rgb.b, 0x00, 0x00, 0x00, 0x25, 0x05 ];
    light.write(data);
  }
}              

function blink(delay, count, c1, c2){
  if(!counter){
    counter = count;
  }
  blinkOn(delay, count, c1, c2);
}

function blinkOn(delay, count, c1, c2){
  if(counter > 0){
    counter--;
  }
  else {
    return;
  }

  sendColor(c1);
  setTimeout(function(){
    blinkOff(delay, count, c1, c2);
  }, delay);
}


function blinkOff(delay, count, c1, c2){
  sendColor(c2);
  setTimeout(function(){
    blinkOn(delay, count, c1, c2);
  }, delay);
}

sendColor(process.argv[2]);
blink(1000, 2, 'red', 'blue');
