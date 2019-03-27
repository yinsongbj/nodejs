var keythereum = require("keythereum");

var password ="100sandra";
var datadir = "./";
var address = "win.json";

// Synchronous
var keyObject = keythereum.importFromFile(address, datadir);
console.log(keyObject);

try{
	console.log("password:" + password);
	var privateKey = keythereum.recover(password, keyObject);
	console.log(privateKey.toString('hex')); 
	console.log("password:" + password);
}catch(e){
	console.log("bad password.");
	//console.log(e);		
}
