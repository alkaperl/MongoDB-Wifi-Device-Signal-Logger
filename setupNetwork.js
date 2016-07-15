// Set up network config and setup

/*
bash:
pkill NetworkManager
airmon-ng start wlan0
*/
async = require("async");

module.exports = function(cb){
	async.series([
	  function(callback) {
	  	// Kill the earlier network manager
			const setupChildOne = require('child_process').exec;
			setupChildOne('pkill NetworkManager', 
				function (error, stdout, stderr) => {
			  	// We are assuming no error message
				  console.log(`Network manager kill stdout: ${stdout}`);
				  console.log(`Network manager kill stderr: ${stderr}`);
				  if (error) {
				    console.error(`Network manager exec error: ${error}`);
				    return;
				  } else {
				  	callback(null);
				  }
			});
	  },
	  function(callback) {
	  	// Start airmon with wlan0 interface
			const setupChildTwo = require('child_process').exec;
			setupChildTwo('airmon-ng start wlan0', 
				function (error, stdout, stderr) => {
			  	// We are assuming no error message
				  console.log(`Airmon start stdout: ${stdout}`);
				  console.log(`Airmon start stderr: ${stderr}`);
				  if (error) {
				    console.error(`Airmon start error: ${error}`);
				    return;
				  } else {
				  	callback(null);
				  }
			});
	  }
	],
	// optional callback
	function(err, results) {
		if (!err){
	   	cb();
		}
	});
}

