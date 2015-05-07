 /**
 * NudityBlocker v0.0.1
 * Chrome Extension by using Nude.js - Nudity detection with Javascript and HTMLCanvas
 *
 * Author: Trim Kadriu <trim.kadriu@gmail.com>
 * April 2015
 **/
 
$(window).load(function() {
	console.log('NudityBlocker -- Loaded');
	$('img:visible').each(function() {
		var uniqueId = guid();
		var thisImage = $(this);
		thisImage.crossOrigin = "Anonymous";
		thisImage.css('visibility', 'hidden');
		thisImage.attr('crossorigin', 'Anonymous');
		thisImage.attr('data-nudejs-id', uniqueId);
		try { setTimeout(scan(thisImage), 0); }
		catch(e) { console.log(e); }
	});
	console.log('NudityBlocker -- Finished scanning');
});

function scan(image) {
	// Create necessary elements
	var nudeJsId = image.attr('data-nudejs-id');
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	
	// Draw image on canvas
	canvas.width = image[0].width;
	canvas.height = image[0].height;
	ctx.drawImage(image[0], 0, 0);
	
	// Get image date and create scanner worker
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	var myWorker = new Worker(nudeUrl);
	var message = [imageData, canvas.width, canvas.height];
	myWorker.postMessage(message);
	myWorker.onmessage = function(event){
		var imageObj = $('[data-nudejs-id=' + nudeJsId + ']');
		if(event.data){ 
			// It's nude
			var width = imageObj.width();
			var height = imageObj.height();
			imageObj.attr('src', chrome.extension.getURL('assets/images/blocked.png')).width(width).height(height);
		}
		// Display images again either original or with blocked sign
		imageObj.css('visibility', 'visible');
	}
}

// Generate GUID's
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}