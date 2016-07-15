// Saves initial CSV logs to MongoDB

// cb(tempFilename);
exports.transfer = function(cb){
	const initialUploadToDB = require('child_process').exec;
	initialUploadToDB('java -jar ./javaRef/ProcessAirodumpOutput.jar -i dump-01.csv', 
	function (error, stdout, stderr) => {
  	// We are assuming a single signal of 'complete'	
  	if (stdout=="complete"){
  		cb();
  		// Call is complete
  	} else {
  		// Maybe attempt to restart upload process
  		console.log("No proper stdout returned");
  	}
	  console.log(`Airodump stdout: ${stdout}`);
	  console.log(`Airodump stderr: ${stderr}`);
	  if (error) {
	    console.error(`Airodump exec error: ${error}`);
	    return;
	  }
});