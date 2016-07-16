// Set up network config and setup

/*
bash commands:
pkill NetworkManager
airmon-ng start wlan0
*/
async = require("async");

/*
Set up network tracking to prepare for logging
CB triggered on setup completion
*/
module.exports = function(cb){
	async.series([
	  function(callback) {
	  	// Kill the network manager earlier
	  	console.log("Kill old child process");
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
	  	console.log("Start airmon wlan0 interface");
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
	// Signal completion
	function(err, results) {
		if (!err){
	   	cb();
		} else {
			console.log(err);
		}
	});
}

