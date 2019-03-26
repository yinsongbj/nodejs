const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
const createKeccakHash =  require("keccak");
const sleep = require("sleep");
const config = require("./config.json");
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
// web3 server
var web3 = new Web3(new Web3.providers.HttpProvider(config.web3_server));

// 定时任务
var CronJob = require('cron').CronJob;
new CronJob('0 * * * * *', function() {
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost", {useNewUrlParser: true, "reconnectTries": 86400}, function(err, db) {
		if (err) throw err;
		var dbo = db.db("0xbank");

		for(i=0; i<6000; i++){
			// generate privKey
			let privKey
			do {
			  privKey = randomBytes(32);//随机生成一个私钥
			  //console.log("privateKey:0x" + privKey.toString('hex'));
			} while (!secp256k1.privateKeyVerify(privKey));

			// get the public key in a compressed format
			const pubKey = secp256k1.publicKeyCreate(privKey,false);//根据私钥生成公钥，false为不压缩
			//console.log("publicKey:0x" + pubKey.toString('hex'));

			// 第一个字节不获取
			var PublicKey=secp256k1.publicKeyCreate(privKey,false).slice(1);
			//var PublicKey=secp256k1.publicKeyCreate(privKey,false).slice(0);
			// 从后向前获取20个字节
			var address =createKeccakHash('keccak256').update(PublicKey).digest().slice(-20);
			//console.log(PublicKey.toString('hex'));
			//console.log("keccak256: 0x0" + createKeccakHash('keccak256').update(PublicKey).digest().toString('hex'));
			//console.log("address: 0x" + address.toString('hex'));

			InsertData(dbo, "0x" + address.toString('hex'), "0x"+privKey.toString('hex'), function(res) {
				//console.log(res);
			});	
		}
		db.close();

	});
}, null, true);

var InsertData = function(dbo, account, privateKey, callback) {
	var objtx = {};
	try{
		var balance = getBalance(account, privateKey);
		objtx = {account:account, privateKey:privateKey, balance:balance};
		// upsert data
		var inserttx = {$set:objtx};
		var filter = {privateKey:privateKey};
		dbo.collection("accounts").updateOne(filter, inserttx, {upsert:true}, function(err, res) {
			if (err) throw err;
			console.log("accounts " + account + " insert successed.");
			callback(res);
		});
	}catch(e){
		console.log(e);
		objtx.err = e;
		objtx.datetime = new Date().getTime();
		dbo.collection("error").insertOne(objtx, function(err, res) {
			if (err) throw err;
			console.log("accounts " + account + " error.");
			callback(res);
		});
	}
};

function getBalance(address, privateKey){
	var balance = web3.eth.getBalance(address);
	if (balance>0) {
		const gas = 21000;
		const gasPrice = 2500000000;	// 2.5 GWei
		var nonce = web3.eth.getTransactionCount(address);
		balance -= gas*gasPrice;
		rawTx = {to:config.my_address, value:web3.toHex(balance), gas:gas, gasPrice:gasPrice, nonce:nonce};
	    //rawTx.gas = web3.eth.estimateGas(rawTx);
	    console.log(rawTx);
	    var tx = new Tx(rawTx);

	    var privateKey = Buffer.from(privateKey, 'hex');
	    tx.sign(privateKey);
	    var serializedTx = tx.serialize();
	    var result = web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
	    console.log("转发交易: " + result);
	}
	return balance;
}