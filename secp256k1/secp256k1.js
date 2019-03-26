// test account sign
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
const createKeccakHash =  require("keccak")
// or require('secp256k1/elliptic')
//   if you want to use pure js implementation in node

// generate message to sign
const msg = randomBytes(32);//随机生成一个数据
console.log("Message:");
console.log(msg);

// generate privKey
let privKey
do {
  privKey = randomBytes(32);//随机生成一个私钥
  console.log("privateKey:0x" + privKey.toString('hex'));
} while (!secp256k1.privateKeyVerify(privKey));

// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(privKey,false);//根据私钥生成公钥，false为不压缩
console.log("publicKey:0x" + pubKey.toString('hex'));

// 第一个字节不获取，是什么意思？导致前面少了一个字节
var PublicKey=secp256k1.publicKeyCreate(privKey,false).slice(1);
//var PublicKey=secp256k1.publicKeyCreate(privKey,false).slice(0);
// 从后向前获取20个字节
var address =createKeccakHash('keccak256').update(PublicKey).digest().slice(-20);
console.log(PublicKey.toString('hex'));
console.log("keccak256: 0x0" + createKeccakHash('keccak256').update(PublicKey).digest().toString('hex'));
console.log("address: 0x" + address.toString('hex'));

// sign the message
const sigObj = secp256k1.sign(msg, privKey);//然后进行签名
console.log("singObj:");
console.log(sigObj);

// verify the signature
console.log("verify:");
console.log(secp256k1.verify(msg, sigObj.signature, pubKey));//核查签名是否正确
// => true

// test
const Public = secp256k1.recover(msg, sigObj.signature, sigObj.recovery);
console.log("Public:0x" + Public.toString('hex'));


// verify the signature
console.log("verify:");
console.log(secp256k1.verify(msg, sigObj.signature, Public));//核查签名是否正确
// => true
