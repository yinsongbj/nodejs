const config = require("../config/game_config.json");
const abi = require("../config/game.json");

const Tx = require('ethereumjs-tx');
const Web3 = require('web3');

//连接节点
var web3 = new Web3(new Web3.providers.HttpProvider(config.server.web3_server));
var Game = web3.eth.contract(abi.game_abi).at(config.contract.contract_addr);

exports.showGame = function(req, res) {
	poolFund = web3.fromWei(Game.prizePool.call());
	id = Game.id.call();

	var bet_info = {poolfund:poolFund, id:id};
	res.render('game/game', bet_info);
}

exports.doCreateGame = function(req, res){
	var game = Contract.new(
	   {
	     from: root_address,
	     data: abi.powerwin_bincode, 
	     gas: '6000000'
	   }, function (e, contract){
	   		if (e) throw e;    	
			if (typeof contract.address !== 'undefined') {
				console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash + "poolfund:" + poolFund);		
				res.send("Create contract successed, and contract address:" + contract.address);		 
			}else{
				console.log(e);
			}
		}
	)
}

exports.doGetHistory = function(req, res){
	var id = Game.id.call();
	//res.send(id);
	
	Game.getDicer.call(id.toNumber(), function(err,addresses){
		if (err){ 
			throw err
		};
		console.log(addresses);
		res.send(addresses);
	});
}

exports.doBetPost = function(req, res){
	var address = req.body.user_address;
	var private = req.body.user_private;
	var privateKey = Buffer.from(private, 'hex');

	var callData = Game.dice.getData();
	var nonce = web3.eth.getTransactionCount(address);

	var rawTx = {from:address, to:config.contract.contract_addr, data:callData, value:12000000000000000000, gas:400000, nonce:web3.toHex(nonce)};
	console.log(rawTx);

	console.log("monitor log start...");
	var event = Game.Dice();

	event.watch(function(error, result){
	    if (!error) {
	        var json = JSON.stringify(result);
	        var data = JSON.parse(json);
	        console.log(data);
	        console.log(data.args);
	        res.render("game/game", data.args);
	    } else {
	    	res.send(error);
	    }
	    event.stopWatching();
	});

	var tx = new Tx(rawTx);
	tx.sign(privateKey);
	var serializedTx = tx.serialize();
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
	  if (!err){
	  	console.log(hash);
	  	//res.send("tx_hash:" + hash);
	  	//res.render('game/game', {txhash:hash, user_address:address});
	  }else{
	  	console.log(err);
	  	//res.render('game/game', {err:err});
	  	//res.send(err);
	  }
	});
}

exports.doBetGet = function(req, res){
	var address = req.query.user_address;
	var private = req.query.user_private;
	var contract_address = req.query.contract;
	var privateKey = Buffer.from(private, 'hex');

	var callData = Contract.bet.getData();
	var nonce = web3.eth.getTransactionCount(address);

	var rawTx = {from:address, to:contract_address, data:callData, gas:4700000, nonce:web3.toHex(nonce)};

	var tx = new Tx(rawTx);
	tx.sign(privateKey);
	var serializedTx = tx.serialize();
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
	  if (!err){
	  	log(hash);
	  	res.render('game/game', {txhash:hash, user_address:address});
	  }else{
	  	res.render('game/game', {err:err});
	  }
	});
}