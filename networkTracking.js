var fs = require('fs');
var gutil = require('gulp-util');
var processAirodumpDB = require('processAirodumpDB');

// Captures network traffic and logs to dynamically selected CSV

/*
Creates basic network log inside
dump-01.csv in parent directory, 
updating every 10 seconds
Bash:
airodump-ng -w dump --output-format csv --write-interval 10 wlan0mon 
CB: returns the childLoggingProcess for termination in case of control C
*/
exports.initiate = function(childLoggingProcess, cb){
	
	childLoggingProcess('airodump-ng -w dump --output-format csv --write-interval 10 wlan0mon', 
		function (error, stdout, stderr) => {
	  	// We are assuming no errors
		  /* Should return the necessary logs
		 	console.log(`stdout: ${stdout}`); */
		  console.log(`stderr: ${stderr}`);
		  if (error) {
		  	// Reduce
		    console.error(`exec error: ${error}`);
		    return;
		  } else {
		  	cb(childLoggingProcess);
		  }
		}
	);
}

// Launches counter for every 10 seconds, aka when the file completes rewrite
exports.counter = function(cb){
  var timeout = setInterval(function() {
  	cb();
    clearInterval(timeout);
  }, 10000);
}

exports.stop = function(childLoggingProcess, cb){
	// Kill logging
	childLoggingProcess.kill();

	// Delete file
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

	processAirodumpDB();
	// Finish shutdown
	cb();
}