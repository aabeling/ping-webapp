const widgets = require("widget");
const tabs = require("tabs");
var self = require("self");
var ss = require("simple-storage");
var timers = require("timers");

var preferencesPanel = require("panel").Panel({
	  width:500,
	  height:300,
	  contentURL: self.data.url("content/preferences.html"),
	  contentScriptFile: [ 
	                      self.data.url("js/preferences.js"),
	                      self.data.url("js/jquery-1.7.2.min.js") ]
	});

/**
 * Send the preferences panel the preferences when it is shown
 */
preferencesPanel.on("show", function() {
	console.log("show preferences panel");
	preferencesPanel.port.emit("show", ss.storage);
});

/**
 * Receiver for new-webapp event from the content script
 */
preferencesPanel.port.on("new-webapp", function(webappData) {
	console.log("new webapp data received: " + webappData);
	if ( !ss.storage.webapps ) {
		ss.storage.webapps = [];
	}
	ss.storage.webapps.push(webappData);
	preferencesPanel.port.emit("webapps-updated", ss.storage.webapps);
});

preferencesPanel.port.on("activity-changed", function(index) {
	ss.storage.webapps[index].active = !ss.storage.webapps[index].active;
	preferencesPanel.port.emit("webapps-updated", ss.storage.webapps);	
});

preferencesPanel.port.on("deleted", function(index) {
	ss.storage.webapps.splice(index, 1);
	console.log("url deleted: " + index);
	preferencesPanel.port.emit("webapps-updated", ss.storage.webapps);
});

var widget = widgets.Widget({
  id: "ping-webapp-widget",
  label: "open the ping-webapp preferences",
  contentURL: self.data.url("icons/bell_go.png"),
  panel: preferencesPanel//,
  /*
  onClick: function() {
    this.panel.show();
  }
  */
});

/* send urls of icons to content script */
preferencesPanel.port.emit("icons-sent", { 
	'delete': self.data.url("icons/cross.png"),
	'active': self.data.url("icons/tick.png"),
	'inactive': self.data.url("icons/delete.png")});

pingUrls = function() {
	console.log("ping");
	for (var i in ss.storage.webapps) {
		if ( ss.storage.webapps[i].active ) {
			pingWebapp(ss.storage.webapps[i]);
		}
	}
};

pingWebapp = function(webapp) {
	url = webapp.url;
	console.log("ping webapp url: " + url);
	var Request = require("request").Request;
	Request({
		  url: url,
		  onComplete: function (response) {
		    console.log("response received");
		  }
		}).get();
	
};

/* start the timer for the pings */
var timerId = timers.setInterval(pingUrls, 10000);

console.log("The add-on is running.");
