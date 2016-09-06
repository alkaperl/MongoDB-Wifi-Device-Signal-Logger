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

// Counter objects are defined in larger scope 
// to allow for outside termination on graceful shutdown
var networkCounter = null;
var processDBCounter = null;

// Connect to the db
console.log("Connecting to MongoDB");
mongoose.connect("mongodb://104.131.133.17:27017/wifiLogs");
var monConn = mongoose.connection;
monConn.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// Prepare for control C (make sure to shut down airodump first)
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  console.log("Shut down the counters");
  clearInterval(networkCounter);
  clearInterval(processDBCounter);
  setTimeout(function(){
    console.log("Shut down the network tracking");
    networkTracking.stop(childLoggingProcess, monConn, function(){
      console.log("Finish ending node");
      process.exit();
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
      // Initiate network counter for airodumpToDB process
			networkCounter = networkTracking.counter(airodumpToDB.transfer); 
      setTimeout(function(){
        // Initiate process db counter for data processing
        processDBCounter = processAirodumpDB.counter(monConn, processAirodumpDB.update);
      }, 3000);
		});
  }
]);
