 /**
 * NudityBlocker v0.0.1
 * Chrome Extension by using Nude.js - Nudity detection with Javascript and HTMLCanvas
 *
 * Author: Trim Kadriu <trim.kadriu@gmail.com>
 * April 2015
 **/
 
$(document).ready(function() {
	chrome.storage.sync.get(['nudityBlockerStatus'], function(items) {
		status = items.nudityBlockerStatus;
		console.log('NudityBlocker -- ButtonClicked()');
		console.log('NudityBlocker -- Status: ' + status);
		var newStatus = chrome.extension.getBackgroundPage().updateStatus(status);
		$('#nudity-blocker-status').text(newStatus);
	});
});