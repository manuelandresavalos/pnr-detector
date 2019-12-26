class PNRManager {
	constructor() {
		this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		this.blackListArr = [
			'PUTO',
			'PUTA',
			'CACA',
			'PEDO',
			'PIJA',
			'ANO',
			'PITO',
			'CONCHA',
			'PAPO',
			'COGER',
			'COJER',
			'CAGAR'
		];
		this.letterArr = this.alphabet.split('');
		this.pnrLength = 6;
	}

	randomInt = function(min, max) {
		return min + Math.floor((max - min) * Math.random());
	};

	getPNR = function() {
		let str = '';
		for (let index = 0; index < this.pnrLength; index++) {
			str += this.getRandomLetter();
		}

		return str;
	};

	getSafePNR = function() {
		var pnr = this.getPNR(this.pnrLength);
		var getNewPNR = this.checkBlackList(pnr);

		if (getNewPNR) {
			pnr = this.getSafePNR(this.pnrLength);
		}

		return pnr;
	};

	getPNRFakeOrReal = function() {
		let pnrBase = this.getPNR();
		let result = pnrBase;

		//Random PNR probabilistics
		let randomProbabilistics = this.randomInt(0, 10);
		if (randomProbabilistics >= 6) {
			//FAKE
			result = this.getFakePNR(pnrBase);
		}

		return result;
	};

	getFakePNR = function(pnrBase) {
		// --------
		// RANDOM FAKES
		// --------
		var that = this;
		let options = [
			{
				// Length +1 or +N
				action: function() {
					pnrBase += that.getRandomLetter();
					return pnrBase;
				}
			},
			{
				// Length -1 or -N
				action: function() {
					let min = that.randomInt(0, 2);
					let max = that.randomInt(5, 6);
					pnrBase = pnrBase.substr(min, max);
					return pnrBase;
				}
			},
			{
				// Replace letter for  Number
				action: function() {
					let splitedPnrArr = pnrBase.split('');
					let randomIndex = that.randomInt(0, splitedPnrArr.length - 1);
					let randNumber = that.randomInt(0, 9);
					splitedPnrArr[randomIndex] = randNumber;
					pnrBase = splitedPnrArr.join('');
					return pnrBase;
				}
			},
			{
				// Only Numbers
				action: function() {
					pnrBase = that.randomInt(100000, 999999);
					return pnrBase;
				}
			},
			{
				// Add number and length
				action: function() {
					let splitedPnrArr = pnrBase.split('');
					let randomIndex = that.randomInt(0, splitedPnrArr.length - 1);
					let randNumber = that.randomInt(0, 9);
					splitedPnrArr[randomIndex] = randNumber;
					pnrBase = splitedPnrArr.join('');
					pnrBase += that.getRandomLetter();
					return pnrBase;
				}
			},
			{
				// Add number and less length
				action: function() {
					let splitedPnrArr = pnrBase.split('');
					let randomIndex = that.randomInt(0, splitedPnrArr.length - 1);
					let randNumber = that.randomInt(0, 9);
					splitedPnrArr.pop();
					splitedPnrArr[randomIndex] = randNumber;
					pnrBase = splitedPnrArr.join('');
					return pnrBase;
				}
			},
			{
				// Add emoji
				action: function() {
					let emojiArr = [
						'🎅',
						'😂',
						'🔥',
						'💩',
						'✈️',
						'🍒',
						'🥕',
						'💣',
						'🎁',
						'🔑',
						'🐷',
						'🦇'
					];

					let splitedPnrArr = pnrBase.split('');
					let randomIndex = that.randomInt(0, splitedPnrArr.length);
					let randomEmoji = that.randomInt(0, emojiArr.length);
					splitedPnrArr[randomIndex] = emojiArr[randomEmoji];
					pnrBase = splitedPnrArr.join('');
					return pnrBase;
				}
			}
		];

		let getFakeIndex = this.randomInt(0, 7); // 7 options
		let res = options[getFakeIndex].action();
		return res;
	};

	getRandomLetter = function() {
		var randomIndex = this.randomInt(0, this.letterArr.length);
		var letter = this.letterArr[randomIndex];

		return letter;
	};

	checkBlackList = function(pnr) {
		var newPNR = false;
		this.blackListArr.forEach(function(word) {
			var regex = RegExp('' + word + '');
			var wordFind = regex.test(pnr);
			if (wordFind) {
				newPNR = true;
			}
		});

		return newPNR;
	};

	validate = function(pnr) {
		var isOk = false;
		var regex = RegExp('^[A-Z]{6}$');
		isOk = regex.test(pnr);

		return isOk;
	};
}

// var pnr = new PNRManager();
// var sPNR = pnr.getSafePNR(6);
// console.log('Safe PNR: ' + pnr.validate('APQRST'));

// var rPNRRandom = pnr.getPNRFakeOrReal();
// console.log(rPNRRandom);
