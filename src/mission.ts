import {ConsoleOutputType} from "./playground";
import Blockly from "blockly";

// ミッション内容
export interface MissionContent {
	missionTitle: string, // ミッション名
	missionExplanation: string, // ミッションの説明
	missionID: string, // ミッションID
	goal: string, // クリア条件
	twoDimensionalArrays: TwoDimensionalArrays; // グローバル2次元配列
	oneDimensionalArrays: OneDimensionalArrays; // グローバル1次元配列の初期値
	judge: (consoleOutputs: string[],
			initialTwoDimensionalArrays: { [key: string]: number[][] },
			initialOneDimensionalArrays: { [key: string]: number[] },
			twoDimensionalArraysResult: { [key: string]: number[][] },
			oneDimensionalArraysResult: { [key: string]: number[] },
	) => boolean; // ミッション達成判断関数(プログラム終了時に呼び出される)
}


// 配列が定数かランダムかを表すenum
export enum GlobalArrayType { constant, random}

// ランダム配列の範囲
export interface ArrayRandomRange {
	min: number,
	max: number
}

// 2次元配列クラス
export class TwoDimensionalArrays {
	arrays: { [key: string]: number[][] } = {};
	arrayTypes: { [key: string]: GlobalArrayType } = {};
	randomRanges: { [key: string]: ArrayRandomRange } = {};

	// すべてのランダム配列の値をシャッフル
	randomizeAll () {
		for (const key in this.arrays) {
			if (this.arrayTypes[key] === GlobalArrayType.random) {
				// 長さ取得
				const rowLength = this.arrays[key].length;
				const colLength = this.arrays[key][0].length;

				this.arrays[key] = this.getRandomArray (rowLength, colLength, this.randomRanges[key].min, this.randomRanges[key].max);
			}
		}
	}

	// ランダムな配列を作成
	getRandomArray (rowLength: number, colLength: number, randomMin: number, randomMax: number) {
		// 配列初期化
		const array = new Array (rowLength);
		for (let row = 0; row < rowLength; row++) {
			array[row] = new Array (colLength);
		}

		// ランダムな値を生成
		for (let row = 0; row < rowLength; row++) {
			for (let col = 0; col < colLength; col++) {
				array[row][col] = Math.floor (Math.random () * (randomMax - randomMin) + randomMin);
			}
		}

		return array;
	}

	// 定数の2次元配列を追加
	addConstArray (key: string, array: number[][]) {
		this.arrays[key] = array;
		this.arrayTypes[key] = GlobalArrayType.constant;
		this.randomRanges[key] = {min: -1, max: -1};
	}

	// ランダムの2次元配列を追加
	addRandomArray (key: string, rowLength: number, colLength: number, randomMin: number, randomMax: number) {
		this.arrays[key] = this.getRandomArray (rowLength, colLength, randomMin, randomMax);
		this.arrayTypes[key] = GlobalArrayType.random;
		this.randomRanges[key] = {min: randomMin, max: randomMax};
	}
}

export class OneDimensionalArrays {
	arrays: { [key: string]: number[] } = {};
	arrayTypes: { [key: string]: GlobalArrayType } = {};
	randomRanges: { [key: string]: ArrayRandomRange } = {};

	// すべてのランダム配列の値をシャッフル
	randomizeAll () {
		for (const key in this.arrays) {
			if (this.arrayTypes[key] === GlobalArrayType.random) {
				// 長さ取得
				const length = this.arrays[key].length;

				this.arrays[key] = this.getRandomArray (length, this.randomRanges[key].min, this.randomRanges[key].max);
			}
		}
	}

	// ランダムな配列を作成
	getRandomArray (length: number, randomMin: number, randomMax: number) {
		// 配列初期化
		const array = new Array (length);

		// ランダムな値を生成
		for (let i = 0; i < length; i++) {
			array[i] = Math.floor (Math.random () * (randomMax - randomMin) + randomMin);
		}

		return array;
	}

	// 定数の2次元配列を追加
	addConstArray (key: string, array: number[]) {
		this.arrays[key] = array;
		this.arrayTypes[key] = GlobalArrayType.constant;
		this.randomRanges[key] = {min: -1, max: -1};
	}

	// ランダムの2次元配列を追加
	addRandomArray (key: string, length: number, randomMin: number, randomMax: number) {
		this.arrays[key] = this.getRandomArray (length, randomMin, randomMax);
		this.arrayTypes[key] = GlobalArrayType.random;
		this.randomRanges[key] = {min: randomMin, max: randomMax};
	}
}

export class Mission {
	// 現在のミッション内容
	missionContent: MissionContent;
	// グローバルデータ現在値
	currentTwoDimensionalArrays: { [key: string]: number[][] } = {};
	currentOneDimensionalArrays: { [key: string]: number[] } = {};
	// コンソール出力内容
	consoleOutputs: string[] = [];
	// キャンバス描画関数
	drawVariableView: () => void;
	// コンソール書き込み関数
	writeConsoleView: (output: { text: string, type: ConsoleOutputType }) => void;
	// スレッド追加
	addThreadView: (threadInfo: { name: string, blocksXml: string }) => void;
	// スレッド削除
	removeThreadView: (threadName: string) => void;

	constructor (missionContent: MissionContent,
				 drawVariableTable: () => void, writeConsole: (output: { text: string, type: ConsoleOutputType }) => void,
				 addThread: (threadInfo: { name: string, blocksXml: string }) => void, removeThread: (threadName: string) => void) {
		this.missionContent = missionContent;
		this.drawVariableView = drawVariableTable;
		this.writeConsoleView = writeConsole;
		this.addThreadView = addThread;
		this.removeThreadView = removeThread;

		this.resetGlobalArray ();
	}

	judge () {
		return this.missionContent.judge (this.consoleOutputs,
			this.missionContent.twoDimensionalArrays.arrays, this.missionContent.oneDimensionalArrays.arrays,
			this.currentTwoDimensionalArrays, this.currentOneDimensionalArrays);
	}

	printLog (text: string) {
		this.consoleOutputs.push (text);
		this.writeConsoleView ({text: text, type: ConsoleOutputType.Log});
	}

	printError (text: string) {
		this.writeConsoleView ({text: text, type: ConsoleOutputType.Error});
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

	resetGlobalArray () {
		// ランダム配列をシャッフルして現在値に初期値をコピー
		this.missionContent.twoDimensionalArrays.randomizeAll ();
		this.missionContent.oneDimensionalArrays.randomizeAll ();
		this.currentTwoDimensionalArrays = JSON.parse (JSON.stringify (this.missionContent.twoDimensionalArrays.arrays));
		this.currentOneDimensionalArrays = JSON.parse (JSON.stringify (this.missionContent.oneDimensionalArrays.arrays));
	}

	addThread (threadName: string, functionStatementElement: Element) {
		const xml = Blockly.Xml.domToText (functionStatementElement);
		this.addThreadView ({name: threadName, blocksXml: xml});
	}

	removeThread (threadName: string) {
		this.removeThreadView (threadName);
	}
}
