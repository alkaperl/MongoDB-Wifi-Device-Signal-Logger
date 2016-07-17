// Script for coordinating the event flow for the wifi tracker

async = require('async');
const airodumpToDB = require('./airodumpToDB');
const networkTracking = require('./networkTracking');
const setupNetwork = require('./setupNetwork');
const processAirodumpDB = require('./processAirodumpDB');
var MongoClient = require('mongodb').MongoClient;

/* 
The child logging process is creating coordinator to tie
initiation and termination calls
*/
var childLoggingProcess = require('child_process').spawn;
var networkCounter = null;
var processDBCounter = null;
var db;
// Retrieve

// Connect to the db
MongoClient.connect("mongodb://whimmly.com:27017/wifiLogs", function(err, connectedDB) {
  if(err) { 
    console.log(err);
  }
  db = connectedDB;
});


// Prepare for control C (make sure to shut down airodump first)
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  clearInterval(networkCounter);
  clearInterval(processDBCounter);
  setTimeout(function(){
    networkTracking.stop(childLoggingProcess, db, function(){

      console.log("Finish ending the process");
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
			// Follow up with the counter, updating db upload every time
			networkCounter = networkTracking.counter(airodumpToDB.transfer); 
      setTimeout(function(){
          processDBCounter = processAirodumpDB.counter(db, processAirodumpDB.update);
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
