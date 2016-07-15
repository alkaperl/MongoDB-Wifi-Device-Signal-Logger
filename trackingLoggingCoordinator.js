const airodumpToDB = require('./airodumpToDB');
const networkTracking = require('./networkTracking');
const setupNetwork = require('./setupNetwork');
async = require('async');

const childLoggingProcess = require('child_process').exec;

// Prepare for control C (make sure to shut down airodump first)
process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  networkTracking.stop(childLoggingProcess, function(){
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
			// Follow up with the counter, updating it every time
			networkTracking.counter(airodumpToDB.transfer(function(){}));
		});
  }
],
// End of script (should never happen)
function(err, results) {
	console.log("Bye");
  networkTracking.stop(childLoggingProcess, function(){
    process.exit();
  });
});