'use strict';

var fs = require('fs'),
  request = require('request'),
  sharp = require('sharp');

//var download = function(uri, filename, callback){
//  request.head(uri, function(err, res, body){
//    console.log('content-type:', res.headers['content-type']);
//    console.log('content-length:', res.headers['content-length']);
//    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//  });
//};

//context = {
//  "resize": null,
//  "rotate": "180",
//  "crop": null,
//  "blur": "2",
//    "url" : "https://www.google.com/images/srpr/logo3w.png"
//}


function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

exports.handler = (event, context, callback) => {
  
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  
  var imageStream = request(event.query.url);
  var transformation = sharp();
  if (event.query && event.query.resizeHeight && event.query.resizeWidth != undefined) {
    var resizingHeight = parseInt(event.query.resize);
    var resizingWidth = parseInt(event.query.resize);
    transformation = transformation.resize(resizingWidth, resizingHeight);
  }
  if (event.query && event.query.rotate != undefined) {
    var rotation = parseInt(event.query.rotate);
    transformation = transformation.rotate(rotation);
  }
  if (event.query && event.query.crop != undefined) {
    var cropping = parseInt(event.query.crop);
    transformation = transformation.crop(cropping);
  }
  if (event.query && event.query.blur != undefined) {
    var blurring = parseFloat(event.query.blur);
    transformation = transformation.blur(blurring);
  }
  
  var modifiedImageFile = fs.createWriteStream('/tmp/image.png');
  
  imageStream.pipe(transformation).pipe(modifiedImageFile);
  modifiedImageFile.on('finish', function(){
    fs.readFile('/tmp/image.png', function (err, data) {
      if (err) throw err;
      var base64image = new Buffer(data).toString('base64');
      callback(null, base64image);
    });
  });
};