const widgets = require("widget");
const tabs = require("tabs");
var self = require("self");
var ss = require("simple-storage");

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
	'delete': self.data.url("icons/cross.png")});

console.log("The add-on is running.");
