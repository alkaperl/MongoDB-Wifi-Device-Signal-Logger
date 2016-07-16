// Script for coordinating the event flow for the wifi tracker

async = require('async');
const airodumpToDB = require('./airodumpToDB');
const networkTracking = require('./networkTracking');
const setupNetwork = require('./setupNetwork');

/* 
The child logging process is creating coordinator to tie
initiation and termination calls
*/
var childLoggingProcess = require('child_process').spawn;

// Prepare for control C (make sure to shut down airodump first)
process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  networkTracking.stop(childLoggingProcess, function(){
    console.log("Finish ending the process");
  	process.exit();
  });
})

// Actual primary methods
async.series([
  function(callback) {
  	// Set up the network and airmon interface
  	setupNetwork(function(){
  		callback(null)
  	});
  },
  function(callback) {
  	// Initiate the tracking
		networkTracking.initiate(childLoggingProcess, function(){
			// Follow up with the counter, updating db upload every time
			networkTracking.counter(airodumpToDB.transfer);
		});
  }
],
// End of script (should never happen)
function(err, results) {
	// console.log("Bye");
  // networkTracking.stop(childLoggingProcess, function(){
    // process.exit();
  // });
});
