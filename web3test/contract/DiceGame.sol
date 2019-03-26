pragma solidity ^0.4.23;

import "./Ownable.sol";
import "./Safemath.sol";

contract DiceGame is Ownable{
	using SafeMath for uint;
	uint constant DEPOSIT = 12 * (10 ** 18) ;

	uint public lastWinBlock = 0;

	uint public prizePool;
	uint fee; // reward owner

	event WithDraw(address owner, uint fee);
	event Dice(address player,  uint first, uint second);
	event Prize(address player, uint prize, uint fee);


	constructor () public {}

	function () public payable {}

	function withdraw() public onlyOwner {
		owner.transfer(fee);
		emit WithDraw(msg.sender,  fee);
	}

	function dice() public payable returns (bool){
		// delay 10 block to start next round
		require (block.number > lastWinBlock + 10); 
		require (msg.value == DEPOSIT);

		(uint first, uint second) = randDice(random());
		emit Dice(msg.sender, first, second);

		// winner
		if (first == 1 && second == 1) {
			prizePool = prizePool.add(DEPOSIT);

			
			uint roundFee = prizePool.div(100);
			uint prize    = prizePool.sub(roundFee);

			msg.sender.transfer(prize);
			emit Prize(msg.sender, prize, roundFee);

			prizePool = 0;
			fee = fee.add(roundFee);
			lastWinBlock = block.number;
			return true;
		} else {
			uint value = first.add(second).mul(10 ** 18);
			prizePool = prizePool.add(value);
		}

	
		// make change
		if (value != DEPOSIT) {
			msg.sender.transfer(DEPOSIT.sub(value));
		}

		return false;
	}

	function randDice(uint randNumber) private pure returns (uint first, uint second) {
		uint[6] memory diceNumber = [uint(1), 2, 3, 4, 5, 6];

		first = diceNumber[randNumber % 6];
		randNumber <<= 8 * 2;
		second = diceNumber[randNumber % 6];

		return (first, second);
	}

	 function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.coinbase, now, block.number)));
    }
}
