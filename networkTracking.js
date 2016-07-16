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
	childLoggingProcess('airodump-ng -w dump --output-format csv --write-interval 10 wlan0mon', 
		function (error, stdout, stderr) {
	  	// We are assuming no errors
      console.log("child logging complete");
		  /* This hould return the necessary logs:
		 	console.log(`stdout: ${stdout}`); */
		  console.log(`Network tracking stderr: ${stderr}`);
		  if (error) {
		    console.error(`Network tracking exec error: ${error}`);
		    return;
		  } else {
		  	cb(childLoggingProcess);
		  }
		}
  );
  // Initiate callback
  setTimeout(function(){
		cb(childLoggingProcess);
  }, 1000);
}

/*
Launches counter for every 10 seconds, aka when the file completes rewrite
CB: Calls every time the file rewrites
*/
exports.counter = function(cb){
	console.log("Counter initiation");
	// Can change to triggering on file change instead of a set timer
  var timeout = setInterval(
  /* function() {
  	console.log("Counter triggered");
  	cb();
    setTimeout(function(){ 
      console.log("Late counter triggered");
      delayedCB(); 
    }, 2000);
    clearInterval(timeout);
  } */
  cb, 10000);
}

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
	childLoggingProcess.kill("SIGINT");

	// Delete the temporary dump file
	fs.exists('./dump-01.csv', function(exists) {
	  if(exists) {
	    //Show in green
	    console.log(gutil.colors.green('Log exists. Deleting now ...'));
	    fs.unlink('./dump-01.csv');
	  } else {
	    //Show in red
	    console.log(gutil.colors.red('Log not found, so not deleting.'));
	  }
	});

	// Process database info
	processAirodumpDB(function(){
		// Signal shutdown completion
		cb();
	});
}
