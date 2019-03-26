const config = require("../config/game_config.json");
const abi = require("../config/game.json");

const Tx = require('ethereumjs-tx');
const Web3 = require('web3');

//连接节点
var web3 = new Web3(new Web3.providers.HttpProvider(config.server.web3_server));
var Game = web3.eth.contract(abi).at(config.contract.contract_addr);

exports.showGame = function(req, res) {
	var bet_info = getGameInfo();
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

function GetGameInfo(){
	poolFund = web3.fromWei(Game.prizePool.call());
	lottery_num = Game.game_number.call();

	var bet_info = new Array();

	var count = Game.getDiceCount.call(lottery_num.toNumber());
	/*
	for(i=0; i<count; i++){
		diceInfo = Game.diceInfos.call(lottery_num.toNumber(), i);
		console.log(diceInfo);
		bet_info.push(diceInfo);
	}*/

	var game_info = {poolfund:poolFund, id:lottery_num,  bet_count:count/*, bet_info: bet_info.reverse()*/};
	console.log(game_info);
	return game_info;
}

function getGameInfo(){
	poolFund = web3.fromWei(Game.prizePool.call());
	lottery_num = Game.game_number.call();

	var bet_info = new Array();

	var count = Game.getDiceCount.call(lottery_num.toNumber());
	/*
	for(i=0; i<count; i++){
		diceInfo = Game.diceInfos.call(lottery_num.toNumber(), i);
		console.log(diceInfo);
		bet_info.push(diceInfo);
	}*/

	var game_info = {poolfund:poolFund, id:lottery_num,  bet_count:count/*, bet_info: bet_info.reverse()*/};
	console.log(game_info);
	return game_info;
}

exports.doGetHistory = function(req, res){
	var id = Game.game_number.call();
	//res.send(id);
	var result = new Array();

	var count = Game.getDiceCount.call(id.toNumber());
	for(i=0; i<count; i++){
		diceInfo = Game.diceInfos.call(id.toNumber(), i);
		console.log(diceInfo);
		result.push(diceInfo);		
	}
	var game_info = getGameInfo();
	game_info['bet_info'] = result.reverse();

	res.render('game/history', game_info);
}

function extend(target, source) {
       for (var obj in source) {
           target[obj] = source[obj];
       }
       return target;
}

exports.doBetPost = function(req, res){
	var address = req.body.user_address;
	var private = req.body.user_private;
	var privateKey = Buffer.from(private, 'hex');

	var id = Game.game_number.call();
	var callData = Game.dice.getData(id.toNumber());
	var nonce = web3.eth.getTransactionCount(address);

	var rawTx = {to:config.contract.contract_addr, data:callData, value:12000000000000000000, gas:400000, nonce:web3.toHex(nonce)};
	console.log(rawTx);

	console.log("monitor log start...");
	var event = Game.Dice();

	event.watch(function(error, result){
	    if (!error) {
	        var json = JSON.stringify(result);
	        var data = JSON.parse(json);
	        console.log(data);
	        console.log(data.args);
	        var game_info = data.args;
	        game_info['poolfund'] = web3.fromWei(Game.prizePool.call());
	        game_info['bet_count'] = Game.getDiceCount.call(id.toNumber());
	        res.render("game/game", game_info);
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
	    event.stopWatching();
	  	console.log(err);
	  	res.render('game/game', {err:err});
	    event.stopWatching();
	  	//res.send(err);
	  }
	});
}
