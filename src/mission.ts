export class Mission {
	// グローバルデータ初期値
	initialOneDimensionalArrays: { [key: string]: number[] };
	initialTwoDimensionalArrays: { [key: string]: number[][] };
	// グローバルデータ現在値
	currentOneDimensionalArrays: { [key: string]: number[] } = {};
	currentTwoDimensionalArrays: { [key: string]: number[][] } = {};
	// キャンバス描画関数
	drawVariableTable: () => void;

	constructor (initialOneDimensionalArrays: { [key: string]: number[] }, initialTwoDimensionalArrays: { [key: string]: number[][] },
				 drawVariableTable: () => void) {
		this.initialOneDimensionalArrays = initialOneDimensionalArrays;
		this.initialTwoDimensionalArrays = initialTwoDimensionalArrays;
		this.resetGlobalArray ();

		this.drawVariableTable = drawVariableTable;
	}

	readOneDimensionalArray (arrayName: string, index: number) {
		const array = this.currentOneDimensionalArrays[arrayName];
		if (array) {
			if (index < array.length) {
				return array[index];
			} else {
				console.error (`${index} の値が1次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			console.error (`${arrayName} という1次元配列は存在しません！`);
		}
	}

	writeOneDimensionalArray (arrayName: string, index: number, value: number) {
		const array = this.currentOneDimensionalArrays[arrayName];
		if (array) {
			if (index < array.length) {
				array[index] = value;
				this.drawVariableTable ();
			} else {
				console.error (`${index} の値が1次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			console.error (`${arrayName} という1次元配列は存在しません！`);
		}
	}

	readTwoDimensionalArray (arrayName: string, row: number, col: number) {
		const array = this.currentTwoDimensionalArrays[arrayName];
		if (array) {
			if (row < array.length && col < array[0].length) {
				return array[row][col];
			} else {
				console.error (`行 ${row} の値もしくは列 ${col} の値は2次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			console.error (`${arrayName} という2次元配列は存在しません！`);
		}
	}

	writeTwoDimensionalArray (arrayName: string, row: number, col: number, value: number) {
		const array = this.currentTwoDimensionalArrays[arrayName];
		if (array) {
			if (row < array.length && col < array[0].length) {
				array[row][col] = value;
				this.drawVariableTable ();
			} else {
				console.error (`行 ${row} の値もしくは列 ${col} の値は2次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			console.error (`${arrayName} という2次元配列は存在しません！`);
		}
	}

	resetGlobalArray () {
		// 現在値に初期値をコピー
		this.currentOneDimensionalArrays = JSON.parse (JSON.stringify (this.initialOneDimensionalArrays));
		this.currentTwoDimensionalArrays = JSON.parse (JSON.stringify (this.initialTwoDimensionalArrays));
	}
}
