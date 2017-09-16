context = {
  "resize": null,
  "rotate": "180",
  "crop": null,
  "blur": "2",
}

var fs = require('fs'),
  request = require('request');
  sharp = require('sharp');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
	var image = sharp('google.png');
  if (context.resize!= null) {
    var resizing = parseInt(context.resize);
    image = image.resize(resizing);
  }
  if (context.rotate != null) {
    var rotation = parseInt(context.rotate);
    image = image.rotate(rotation);
  }
  if (context.crop != null) {
    var cropping = parseInt(context.crop);
    image = image.crop(cropping);
  }
  if (context.blur != null) {
    var blurring = parseFloat(context.blur);
    image = image.blur(blurring);
  }
  
	image.toFile('googleModified.png', (err, info) => {
		console.log(info);
	} );
});