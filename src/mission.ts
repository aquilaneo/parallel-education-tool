import {ConsoleOutputType} from "./playground";
import Blockly from "blockly";
import {missionContents} from "./missionContents";

// ミッション一覧
export class MissionList {
	missionContents: { chapterName: string, contents: MissionContent[] }[] = [];

	addMissionContent (missionContent: MissionContent) {
		const chapter = this.missionContents.find ((item) => {
			return item.chapterName === missionContent.chapterName;
		});
		if (chapter) {
			// すでにチャプターあったらそこに追加
			chapter.contents.push (missionContent);
		} else {
			// なかったら新しいチャプター追加
			this.missionContents.push ({chapterName: missionContent.chapterName, contents: [missionContent]});
		}
	}

	findMissionByID (missionID: string) {
		for (const chapter of this.missionContents) {
			for (const missionContent of chapter.contents) {
				if (missionContent.missionID === missionID) {
					return missionContent;
				}
			}
		}
		return undefined;
	}

	findChapter (chapterName: string) {
		const chapter = this.missionContents.find ((missionContent) => {
			return missionContent.chapterName === chapterName;
		});
		return chapter ? chapter.contents : undefined;
	}

	findNextMission (currentMissionID: string) {
		for (let chapterIndex = 0; chapterIndex < this.missionContents.length; chapterIndex++) {
			for (let missionIndex = 0; missionIndex < this.missionContents[chapterIndex].contents.length; missionIndex++) {
				if (this.missionContents[chapterIndex].contents[missionIndex].missionID === currentMissionID) {
					if (missionIndex + 1 < this.missionContents[chapterIndex].contents.length) {
						return this.missionContents[chapterIndex].contents[missionIndex + 1].missionID;
					} else if (chapterIndex + 1 < this.missionContents.length && this.missionContents[chapterIndex + 1].contents.length > 0) {
						return this.missionContents[chapterIndex + 1].contents[0].missionID;
					} else {
						return undefined;
					}
				}
			}
		}
	}
}

// ミッション内容
export interface MissionContent {
	chapterName: string; // チャプター名
	missionTitle: string, // ミッション名
	missionExplanation: string, // ミッションの説明
	missionID: string, // ミッションID
	score: MissionScore, // スコア
	goal: string, // クリア条件
	blockListXml: string, // 命令ブロック一覧
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

export class MissionScore {
	cleared: boolean = false;
	time: number = -1;
	blockCount: number = -1;

	setClear (time: number, blockCount: number) {
		this.cleared = true;
		this.time = time;
		this.blockCount = blockCount;
	}

	isClear () {
		return this.cleared;
	}

	getTimeSecond () {
		return this.time / 1000;
	}

	getBlockCount () {
		return this.blockCount;
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
	// コンソール全消去
	clearConsoleView: () => void;
	// スレッド追加
	addThreadView: (threadInfo: { name: string, blocksXml: string }) => void;
	// スレッド削除
	removeThreadView: (threadName: string) => void;

	constructor (missionContent: MissionContent,
				 drawVariableTable: () => void, writeConsole: (output: { text: string, type: ConsoleOutputType }) => void, clearConsole: () => void,
				 addThread: (threadInfo: { name: string, blocksXml: string }) => void, removeThread: (threadName: string) => void) {
		this.missionContent = missionContent;
		this.drawVariableView = drawVariableTable;
		this.writeConsoleView = writeConsole;
		this.clearConsoleView = clearConsole;
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

	clearConsole () {
		this.consoleOutputs = [];
		this.clearConsoleView ();
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
