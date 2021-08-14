import {ConsoleOutputType} from "./App";

export class Mission {
	// グローバルデータ初期値
	initialOneDimensionalArrays: { [key: string]: number[] };
	initialTwoDimensionalArrays: { [key: string]: number[][] };
	// グローバルデータ現在値
	currentOneDimensionalArrays: { [key: string]: number[] } = {};
	currentTwoDimensionalArrays: { [key: string]: number[][] } = {};
	// キャンバス描画関数
	drawVariableView: () => void;
	// コンソール書き込み関数
	writeConsoleView: (output: { text: string, type: ConsoleOutputType }) => void;
	// スレッド追加
	addThreadView: (threadName: string) => void;
	// スレッド削除
	removeThreadView: (threadName: string) => void;

	constructor (initialTwoDimensionalArrays: { [key: string]: number[][] }, initialOneDimensionalArrays: { [key: string]: number[] },
				 drawVariableTable: () => void, writeConsole: (output: { text: string, type: ConsoleOutputType }) => void,
				 addThread: (threadName: string) => void, removeThread: (threadName: string) => void) {
		this.initialOneDimensionalArrays = initialOneDimensionalArrays;
		this.initialTwoDimensionalArrays = initialTwoDimensionalArrays;
		this.resetGlobalArray ();

		this.drawVariableView = drawVariableTable;
		this.writeConsoleView = writeConsole;
		this.addThreadView = addThread;
		this.removeThreadView = removeThread;
	}

	printLog (text: string) {
		this.writeConsoleView ({text: text, type: ConsoleOutputType.Log});
	}

	printError (text: string) {
		this.writeConsoleView ({text: text, type: ConsoleOutputType.Error});
	}

	readOneDimensionalArray (arrayName: string, index: number) {
		const array = this.currentOneDimensionalArrays[arrayName];
		if (array) {
			if (index < array.length) {
				return array[index];
			} else {
				this.printError (`${index} の値が1次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			this.printError (`"${arrayName}" という1次元配列は存在しません！`);
		}
	}

	writeOneDimensionalArray (arrayName: string, index: number, value: number) {
		const array = this.currentOneDimensionalArrays[arrayName];
		if (array) {
			if (index < array.length) {
				array[index] = value;
				this.drawVariableView ();
			} else {
				this.printError (`${index} の値が1次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			this.printError (`"${arrayName}" という1次元配列は存在しません！`);
		}
	}

	readTwoDimensionalArray (arrayName: string, row: number, col: number) {
		const array = this.currentTwoDimensionalArrays[arrayName];
		if (array) {
			if (row < array.length && col < array[0].length) {
				return array[row][col];
			} else {
				this.printError (`行 ${row} の値もしくは列 ${col} の値は2次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			this.printError (`"${arrayName}" という2次元配列は存在しません！`);
		}
	}

	writeTwoDimensionalArray (arrayName: string, row: number, col: number, value: number) {
		const array = this.currentTwoDimensionalArrays[arrayName];
		if (array) {
			if (row < array.length && col < array[0].length) {
				array[row][col] = value;
				this.drawVariableView ();
			} else {
				this.printError (`行 ${row} の値もしくは列 ${col} の値は2次元配列 ${arrayName} の要素数に対して大きすぎます！`);
			}
		} else {
			this.printError (`"${arrayName}" という2次元配列は存在しません！`);
		}
	}

	resetGlobalArray () {
		// 現在値に初期値をコピー
		this.currentOneDimensionalArrays = JSON.parse (JSON.stringify (this.initialOneDimensionalArrays));
		this.currentTwoDimensionalArrays = JSON.parse (JSON.stringify (this.initialTwoDimensionalArrays));
	}

	addThread (threadName: string) {
		this.addThreadView (threadName);
	}

	removeThread (threadName: string) {
		this.removeThreadView (threadName);
	}
}
