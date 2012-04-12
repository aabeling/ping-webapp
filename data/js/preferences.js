self.port.on("show", function (preferences) {
	console.log("the preferences panel is now shown");
	
	/* set the refresh rate input element */
	if ( !preferences.refreshRate ) {
		preferences.refreshRate = 60;
	}

	console.log("refreshRate = " + preferences.refreshRate);
	$('#refresh-rate-select').val(preferences.refreshRate);
	
	/* set the elements for the webapps data */
	if ( !preferences.webapps ) {
		preferences.webapps = [];
	}
	console.log("webapps.count: " + preferences.webapps.length);
	self.updateWebappsTable(preferences.webapps);
	
	if ( !self.initialized ) {
		
		$("#add-button").click(function () {
//			var newPrefix = document.getElementById('new-prefix').value;
			var newPrefix = "";
			var newUrl = document.getElementById('new-url').value;
			
			/* create an event for the addon */
			console.log("transferring new webapp data: " + newPrefix + " : " + newUrl);
			self.port.emit("new-webapp", { active: false, prefix: newPrefix, url: newUrl });
		});
		
		$('#refresh-rate-select').change( function() {
			var value = $(this).val();
			console.log("transferring new refresh rate: " + value);
			self.port.emit("refresh-rate-changed", value);
		});
		
		self.initialized = true;
		
	}
	
});

self.port.on("webapps-updated", function(webappsData) {
	self.updateWebappsTable(webappsData);
});

/**
 * Receives urls of icons.
 */
self.port.on("icons-sent", function(icons) {
	self.icons = icons;
	console.log("icons received: " + icons);
});

self.updateWebappsTable = function(webappsData) 
{
	var table = document.getElementById("webapps-data");
	$(".webapps-row").remove();
	for (var i in webappsData) {
		if ( webappsData[i].active ) {
			switchIcon = "active";
		} else {
			switchIcon = "inactive";
		}
		var row = "<tr class='webapps-row'>"
			+ "<td><img id='active" + i + "' src='" + self.icons[switchIcon] + "'/></td>"
//			+ "<td>" + webappsData[i].prefix + "</td>"
			+ "<td>" + webappsData[i].url + "</td>"
			+ "<td><img id='delete" + i + "' src='" + self.icons['delete'] + "' /></td>"
			+ "</tr>"
		$("#webapps-data").append(row);
		id = "#active" + i;
		$(id).click( function() {
			var index = this.id.substr(6);
			console.log("checkbox clicked: " + index);
			self.port.emit("activity-changed", index);
		});
		deleteId = "#delete" + i;
		$(deleteId).click( function() {
			var index = this.id.substr(6);
			console.log("delete clicked: " + index);
			self.port.emit("deleted", index);
		});
	}
};

