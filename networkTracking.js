// Handles network tracking
var fs = require('fs');
var gutil = require('gulp-util');
var processAirodumpDB = require('./processAirodumpDB');

/*
Creates basic network log inside dump-01.csv in parent directory, 
updating the file every 10 seconds
Bash Command:
airodump-ng -w dump --output-format csv --write-interval 10 wlan0mon 
Child logging process:
Child process is passed from the coordinator to allow for smooth termination
CB: 
returns the childLoggingProcess for termination in case of control C
*/
exports.initiate = function(childLoggingProcess, cb){
	console.log("Initiate network tracking");
	childLoggingProcess('airodump-ng', ['-w', 'dump', '--output-format', 'csv', '--write-interval', '10', 'wlan0mon']);
  // Initiate callback
  setTimeout(function(){
		cb(childLoggingProcess);
  }, 1000);
};

/*
Launches counter for every 10 seconds, aka when the file completes rewrite
counter call: Calls every time the file rewrites
Return timeout object
*/
exports.counter = function(counterCall){
	console.log("Network counter initiation");
	// Can change to triggering on file change instead of a set timer
  var timeout = setInterval(
  counterCall, 10000);
  return timeout;
};

/*
Gracefully terminate the network tracking, killing the bash process, 
deletes the dump file, and signals for database processing
Child logging process:
Terminate the child process
CB:
Signal the completed shutdown
*/
exports.stop = function(childLoggingProcess, cb){
	console.log("Terminate network tracking");

	// Kill logging child process
//	childLoggingProcess.kill("SIGINT");

	// Delete the temporary dump file
	fs.exists('./dump-01.csv', function(exists) {
	  if(exists) {
	    //Show in green
	    console.log(gutil.colors.green('Log exists. Deleting now ...'));
	    fs.unlink('./dump-01.csv');
      // Final database process 
      processAirodumpDB.update(function(){
        // Signal shutdown completion
        cb();
      });
	  } else {
	    //Show in red
	    console.log(gutil.colors.red('Log not found, so not deleting.'));
	  }
	});
};
