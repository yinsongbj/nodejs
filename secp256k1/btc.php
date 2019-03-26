<?php

$mongo = new MongoClient("mongodb://106.75.27.25:27017");

$btcNum = GetBtcLastNum($mongo);
$btcNum ++;
$url = 'https://btc.com/search?q='.$btcNum;
var_dump($url);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_VERBOSE, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// 下面两行为不验证证书和 HOST，建议在此前判断 URL 是否是 HTTPS
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, true);
// $ret 返回跳转信息
$ret = curl_exec($ch);
// $info 以 array 形式返回跳转信息
//var_dump($ret);
$info = curl_getinfo($ch);
// 跳转后的 URL 信息
$retURL = $info['url'];
var_dump($retURL);
// 记得关闭curl
curl_close($ch);

$btcHash = substr($retURL,strlen("https://btc.com/"));
if(strstr($btcHash, "notfound")){
	echo "No more block:$btcNum" . PHP_EOL;
	exit();
}
var_dump($btcHash);
SetBtcLastNum($mongo, $btcNum, $btcHash);

function GetBtcLastNum($mongo){
	$c = $mongo->selectCollection("BtcinfoDB", "btc_index");
	$QueryInfo = array("Btcinfo"=>"btc_index");
    $result = $c->findOne($QueryInfo);
	if($result){
		var_dump($result['btc_lastblock']);
		return $result['btc_lastblock'];
	}
	return 534988;
}

function SetBtcLastNum($mongo, $blockNum, $blockHash){
	$c = $mongo->selectCollection("BtcinfoDB", "btc_index");
	$QueryInfo = array("Btcinfo"=>"btc_index");
	
	$Set = array("btc_lastblock"=>$blockNum);
	$UpdateInfo = array('$set' => $Set);
    $result = $c->update($QueryInfo, $UpdateInfo, array("upsert" => true));
	
	$cInfo = $mongo->selectCollection("BtcinfoDB", "btc_info");
	$QueryInfo = array('blockNum'=>$blockNum);
	$Info = array('blockNum'=>$blockNum, 'blockHash'=>$blockHash);
	var_dump($Info);
	$result = $cInfo->Update($QueryInfo, $Info, array("upsert" => true));
	return $result;
}