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
	console.log(privateKey.toString('hex')); // 0xeea2aff795119bf20cc4c63e12b8b5a6d366526c10971e2511392af90251d83f
	console.log("password:" + password);
}catch(e){
	console.log("bad password.");
	//console.log(e);		
}