// Script for coordinating the event flow for the wifi tracker

var async = require('async');
const airodumpToDB = require('./airodumpToDB');
const networkTracking = require('./networkTracking');
const setupNetwork = require('./setupNetwork');
const processAirodumpDB = require('./processAirodumpDB');
const mongoose = require('mongoose');
var airodumpRecord = require('./airodumpRecord');

/* 
The child logging process is creating coordinator to tie
initiation and termination calls
*/
var childLoggingProcess = require('child_process').spawn;
var networkCounter = null;
var processDBCounter = null;
// Retrieve

// Connect to the db
mongoose.connect("mongodb://104.131.133.17:27017/wifiLogs");
var monConn = mongoose.connection;
monConn.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
console.log("Begin manual record search");

// Prepare for control C (make sure to shut down airodump first)
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  clearInterval(networkCounter);
  clearInterval(processDBCounter);
  setTimeout(function(){
    networkTracking.stop(childLoggingProcess, function(){
//      processAirodumpDB.update(monConn, function(){
        console.log("Finish ending the process");
        process.exit();
//      });
    });
  }, 3000);
});

// Actual primary methods
async.series([
  function(callback) {
  	// Set up the network and airmon interface
  	setupNetwork(function(){
  		callback(null);
  	});
  },
  function(callback) {
  	// Initiate the tracking
		networkTracking.initiate(childLoggingProcess, function(){
			// Follow up with the counter, updating db upload every time
			networkCounter = networkTracking.counter(airodumpToDB.transfer); 
      setTimeout(function(){
          processDBCounter = processAirodumpDB.counter(monConn, processAirodumpDB.update);
      }, 3000);
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
