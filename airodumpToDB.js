// Saves initial CSV logs to MongoDB

/* 
The transfer function transfers the csv to the database,
being triggered every time there's a file rewrite
CB is no longer necessary, so we are assuming no 
parameters and nothing fancy
*/
exports.transfer = function(cb){
	console.log("Initiate CSV to DB");
	const initialUploadToDB = require('child_process').exec;
	initialUploadToDB('java -jar ProcessAirodumpOutput.jar -i dump-01.csv', 
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