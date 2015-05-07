/**
* NudityBlocker v0.0.1
* Chrome Extension by using Nude.js - Nudity detection with Javascript and HTMLCanvas
*
* Author: Trim Kadriu <trim.kadriu@gmail.com>
* April 2015
**/

function executeScripts(tabId) {
	console.log('NudityBlocker -- ExecuteScripts()');
	chrome.tabs.executeScript(tabId, { file: "assets/js/jquery.min.js" }, function () {
		chrome.tabs.executeScript(tabId, { file: "assets/js/nudejs.min.js" });
		chrome.tabs.executeScript(tabId, { file: "assets/js/script.js" });
	});
}

var onComplete = function (details) {
	executeScripts(details.tabId);
}

var onUpdate = function (tabId) {
	executeScripts(tabId);
}

function updateIcons() {
	console.log('NudityBlocker -- updateIcons()');
	chrome.storage.sync.get(['nudityBlockerStatus'], function (items) {
		status = items.nudityBlockerStatus;
		console.log('NudityBlocker -- updateIcons() - Status: ' + status);
		if (status === 'enabled') {
			chrome.browserAction.setIcon({ path: "assets/icon/icon48a.png" });
		}
		else if (status === 'disabled') {
			chrome.browserAction.setIcon({ path: "assets/icon/icon48d.png" });
		}
	});
}

function updateStatus(status) {
	console.log('NudityBlocker -- UpdateStatus()');
	console.log('NudityBlocker -- UpdateStatus() - Status: ' + status);
	var result;
	if (status === 'enabled') {
		result = "disabled";
		chrome.storage.sync.set({ 'nudityBlockerStatus': result });
		chrome.tabs.onUpdated.removeListener(onUpdate);
		chrome.webNavigation.onCompleted.removeListener(onComplete);
	}
	else if (status === 'disabled') {
		result = "enabled";
		chrome.storage.sync.set({ 'nudityBlockerStatus': result });
		addListeners();
	}
	updateIcons();
	return result;
}

function addListeners() {
	console.log('NudityBlocker -- AddListeners()');
	chrome.tabs.onUpdated.addListener(onUpdate);
	chrome.webNavigation.onCompleted.addListener(onComplete);
}

function initialize() {
	console.log('NudityBlocker -- Initialize()');
	chrome.storage.sync.set({ 'nudityBlockerStatus': 'enabled' });
	console.log('NudityBlocker -- Initialize() - Status: ' + status);
	updateIcons();
	addListeners();
}

// Add event listeners
chrome.webRequest.onHeadersReceived.addListener(function (details) {
	var rule = {
		"name": "Access-Control-Allow-Origin",
		"value": "*"
	};
	var toAddManually = true;
	var myHeaders = details.responseHeaders;
    for (var i = 0; i < myHeaders.length; ++i) {
        if (myHeaders[i].name.toLowerCase() == 'Access-Control-Allow-Origin') {
			console.log('NudityBlocker -- ACAO DEFAULT!');
            myHeaders[i].value = '*';
			toAddManually = false;
			break;
		}
	}
	if(toAddManually) {
		console.log('NudityBlocker -- ACAO ADDDED!');
		myHeaders.push({name: 'Access-Control-Allow-Origin', value: '*'});
		console.log(myHeaders);
	}
	myHeaders.push({name: 'Access-Control-Allow-Methods', value: '*'});
    return { responseHeaders: myHeaders };
}, { urls: ['*//:*/*'] }, ['blocking', 'responseHeaders']);
chrome.runtime.onInstalled.addListener(initialize());