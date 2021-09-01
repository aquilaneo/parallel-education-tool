import {ConsoleOutputType} from "./App";
import Blockly from "blockly";

export interface MissionContent {
	missionName: string, // ミッション名
	missionExplanation: string, // ミッションの説明
	initialTwoDimensionalArrays: { [key: string]: number[][] }; // グローバル2次元配列の初期値
	initialOneDimensionalArrays: { [key: string]: number[] }; // グローバル1次元配列の初期値
	judge: (consoleOutput: string,
			initialTwoDimensionalArrays: { [key: string]: number[][] },
			initialOneDimensionalArrays: { [key: string]: number[] },
			twoDimensionalArraysResult: { [key: string]: number[][] },
			oneDimensionalArraysResult: { [key: string]: number[] },
	) => boolean; // ミッション達成判断関数(プログラム終了時に呼び出される)
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
		const lastConsoleOutput = this.consoleOutputs.length > 0 ? this.consoleOutputs[this.consoleOutputs.length] : "";
		return this.missionContent.judge (lastConsoleOutput,
			this.missionContent.initialTwoDimensionalArrays, this.missionContent.initialOneDimensionalArrays,
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
		// 現在値に初期値をコピー
		this.currentTwoDimensionalArrays = JSON.parse (JSON.stringify (this.missionContent.initialTwoDimensionalArrays));
		this.currentOneDimensionalArrays = JSON.parse (JSON.stringify (this.missionContent.initialOneDimensionalArrays));
	}

	addThread (threadName: string, functionStatementElement: Element) {
		const xml = Blockly.Xml.domToText (functionStatementElement);
		this.addThreadView ({name: threadName, blocksXml: xml});
	}

	removeThread (threadName: string) {
		this.removeThreadView (threadName);
	}
}
