import * as Mission from "./mission";
import {BlockType, getAllBlockListXml} from "./blockSettings";

export const missionContents = new Mission.MissionList ();

// 浮動小数点誤差も考えてコンソール出力と計算結果が正しいか比較する関数
function isEqual (consoleOutputs: string, correctValue: number) {
	const number = Number (consoleOutputs);
	return !isNaN (number) && Math.abs (correctValue - number) < Number.EPSILON;
}

// ミッション1-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 1.プログラムの作り方]",
		missionExplanation: "printブロックを使ってプログラムの作り方を学びます。",
		missionID: "mission1-01",
		score: new Mission.MissionScore (),
		program: "",
		goal: `コンソールに "Hello" と出力する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [],
			math: [],
			text: [BlockType.TEXT],
			localVariables: [],
			globalArrays: [],
			functions: [],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && consoleOutputs[0] === "Hello";
		}
	});
}

// ミッション1-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 2.複数のブロック]",
		missionExplanation: "複数のブロックの並べ方を学びます。",
		missionID: "mission1-02",
		score: new Mission.MissionScore (),
		program: "",
		goal: `コンソールに3回 "Hello" と出力する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [],
			math: [],
			text: [BlockType.TEXT],
			localVariables: [],
			globalArrays: [],
			functions: [],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 3) {
				return false;
			}
			for (const consoleOutput of consoleOutputs) {
				if (consoleOutput !== "Hello") {
					return false;
				}
			}
			return true;
		}
	});
}

// ミッション1-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 3.繰り返し]",
		missionExplanation: "繰り返しブロックの使い方を学びます。",
		missionID: "mission1-03",
		score: new Mission.MissionScore (),
		program: "",
		goal: `コンソールに50回 "Hello" と出力する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER],
			text: [BlockType.TEXT],
			localVariables: [],
			globalArrays: [],
			functions: [],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 50) {
				return false;
			}
			for (const consoleOutput of consoleOutputs) {
				if (consoleOutput !== "Hello") {
					return false;
				}
			}
			return true;
		}
	});
}

// ミッション1-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 4.数値ブロックと計算]",
		missionExplanation: "数値ブロックと計算ブロックの使い方を学びます。",
		missionID: "mission1-04",
		score: new Mission.MissionScore (),
		program: "",
		goal: `数値ブロックや計算ブロックを使用し、 63×87 の答えをコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [],
			functions: [],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && isEqual (consoleOutputs[0], 63 * 87);
		}
	});
}

// ミッション1-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 5.変数の使い方]",
		missionExplanation: "変数の作り方、値の書き込み/読み込み/加算の方法を学びます。",
		missionID: "mission1-05",
		score: new Mission.MissionScore (),
		program: "",
		goal: `変数ブロックを使用し、 1+2+3+4+5 の計算結果をコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [],
			functions: [],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && isEqual (consoleOutputs[0], 1 + 2 + 3 + 4 + 5);
		}
	});
}

// ミッション1-6
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 6.関数の作り方と使い方]",
		missionExplanation: "関数(サブルーチン)の作り方と使い方を学びます。",
		missionID: "mission1-06",
		score: new Mission.MissionScore (),
		program: "",
		goal: `29+76 を計算しコンソールに表示する関数を作成する。`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && isEqual (consoleOutputs[0], 29 + 76)
		}
	});
}

// ミッション1-7
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 7.関数の引数]",
		missionExplanation: "関数に値を渡す「引数(ひきすう)」の使い方を学びます。",
		missionID: "mission1-07",
		score: new Mission.MissionScore (),
		program: "",
		goal: `引数で渡された3つの数値の平均を求める関数を作成し、12 65 83の平均をコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && isEqual (consoleOutputs[0], (12 + 65 + 83) / 3);
		}
	});
}

// ミッション1-8
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 8.処理時間計測]",
		missionExplanation: "ストップウォッチ機能を使い、処理にかかった時間の計測を行います。",
		missionID: "mission1-08",
		score: new Mission.MissionScore (),
		program: "",
		goal: `Helloと50回コンソールに表示し、最後にその処理にかかった時間を表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 51) {
				return false;
			}

			// Hello判定
			for (let i = 0; i < consoleOutputs.length - 1; i++) {
				if (consoleOutputs[i] !== "Hello") {
					return false;
				}
			}

			// 判定用にコンソール出力を数値型に変換
			const number = Number (consoleOutputs[consoleOutputs.length - 1]);
			return !isNaN (number);
		}
	});
}

// ミッション1-9
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	oneDimensionalArrays.addConstArray ("Data", [2, 4, 6, 8]);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 9.グローバル1次元配列1]",
		missionExplanation: "グローバル1次元配列の読み込み方を学習します。",
		missionID: "mission1-09",
		score: new Mission.MissionScore (),
		program: "",
		goal: `配列「Data」の2番目の要素を読み取り、その内容をコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return consoleOutputs.length === 1 && isEqual (consoleOutputs[0], oneDimensionalArraysResult["Data"][2]);
		}
	});
}

// ミッション1-10
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	oneDimensionalArrays.addConstArray ("Data", [2, 4, 6, 8]);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 10.グローバル1次元配列2]",
		missionExplanation: "グローバル1次元配列の書き込み方を学習します。",
		missionID: "mission1-10",
		score: new Mission.MissionScore (),
		program: "",
		goal: `配列「Data」の全ての要素を0にする`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 0) {
				return false;
			}

			for (const value of oneDimensionalArraysResult["Data"]) {
				if (value !== 0) {
					return false;
				}
			}
			return true;
		}
	});
}

// ミッション1-11
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3], [4, 5, 6]]);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 11.グローバル2次元配列]",
		missionExplanation: "グローバル2次元配列の使い方を学習します。",
		missionID: "mission1-11",
		score: new Mission.MissionScore (),
		program: "",
		goal: `配列「Data」の全ての要素を0にする`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 0) {
				return false;
			}

			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const value of row) {
					if (value !== 0) {
						return false;
					}
				}
			}
			return true;
		}
	});
}

// ミッション1-12
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	twoDimensionalArrays.addRandomArray ("Data", 2, 3, 0, 99);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 12.ランダムな配列]",
		missionExplanation: "グローバル2次元配列を使った計算です。今回は要素の値がランダムで決まります。",
		missionID: "mission1-12",
		score: new Mission.MissionScore (),
		program: "",
		goal: `配列「Data」の全要素の平均をコンソールに出力する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			let sum = 0;
			let count = 0
			for (const row of initialTwoDimensionalArrays["Data"]) {
				for (const value of row) {
					sum += value;
					count++;
				}
			}
			return consoleOutputs.length === 1 && isEqual (consoleOutputs[0], sum / count);
		}
	});
}

// ミッション1-13
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	twoDimensionalArrays.addRandomArray ("Data", 2, 3, 0, 99);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 13.分岐]",
		missionExplanation: "分岐の使い方を学習します。",
		missionID: "mission1-13",
		score: new Mission.MissionScore (),
		program: "",
		goal: `配列「Data」の全要素の平均を計算し、結果が50以上だったら「High」、それ以外の場合は「Low」とコンソールに出力する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			let sum = 0;
			let count = 0
			for (const row of initialTwoDimensionalArrays["Data"]) {
				for (const value of row) {
					sum += value;
					count++;
				}
			}
			const average = sum / count;
			return consoleOutputs.length === 1 && consoleOutputs[0] === (average >= 50 ? "High" : "Low");
		}
	});
}

// ミッション2-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 1.スレッドの生成]",
		missionExplanation: "スレッドの作り方を学習します。",
		missionID: "mission2-1",
		score: new Mission.MissionScore (),
		program: "",
		goal: `4つのスレッドを生成し、それぞれのスレッドから1回ずつ「Hello」とコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 4) {
				return false;
			}
			for (const outputs of consoleOutputs) {
				if (outputs !== "Hello") {
					return false;
				}
			}
			return true;
		}
	});
}

// ミッション2-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 2.スレッドの終了待ち1]",
		missionExplanation: "実用的なスレッド処理について学びます。",
		missionID: "mission2-2",
		score: new Mission.MissionScore (),
		program: "",
		goal: `4つのスレッドを生成し、それぞれのスレッドから10回ずつ「Hello」とコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			return true;
		}
	});
}

// ミッション2-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 3.スレッドの終了待ち2]",
		missionExplanation: "スレッドの終了待ち機能(Join)について学びます。",
		missionID: "mission2-3",
		score: new Mission.MissionScore (),
		program: "",
		goal: `4つのスレッドを生成し、それぞれのスレッドから10回ずつ「Hello」とコンソールに表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			if (consoleOutputs.length !== 4 * 10) {
				return false;
			}
			for (const output of consoleOutputs) {
				if (output !== "Hello") {
					return false;
				}
			}
			return true;
		}
	});
}

// ミッション2-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	oneDimensionalArrays.addConstArray ("Data", [1, 2, 3, 4]);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 4.スレッドの引数]",
		missionExplanation: "スレッドに渡す引数について学びます。",
		missionID: "mission2-4",
		score: new Mission.MissionScore (),
		program: "",
		goal: `4つのスレッド使い、グローバル配列「Data」の要素を全て0にする`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (const value of oneDimensionalArraysResult["Data"]) {
				if (value !== 0) {
					return false;
				}
			}
			return true;
		}
	});
}

// ミッション2-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 5.逐次処理と並列処理の比較1]",
		missionExplanation: "逐次処理と並列処理の処理速度について比較します。",
		missionID: "mission2-5",
		score: new Mission.MissionScore (),
		program: "",
		goal: `グローバル配列「Data」の値を並列処理を使わずに全て0にし、その処理にかかった時間を表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const col of row) {
					if (col !== 0) {
						return false;
					}
				}
			}

			return consoleOutputs.length === 1 && !isNaN (Number (consoleOutputs[0]));
		}
	});
}

// ミッション2-6
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 6.逐次処理と並列処理の比較2]",
		missionExplanation: "逐次処理と並列処理の処理速度について比較します。",
		missionID: "mission2-6",
		score: new Mission.MissionScore (),
		program: "",
		goal: `グローバル配列「Data」の値を並列処理で全て0にし、その処理にかかった時間を表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const col of row) {
					if (col !== 0) {
						return false;
					}
				}
			}

			return consoleOutputs.length === 1 && !isNaN (Number (consoleOutputs[0]));
		}
	});
}

// ミッション2-7
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const array = [];
	const rowCount = 8;
	const colCount = 16;
	for (let i = 0; i < rowCount; i++) {
		const row = [];
		for (let j = 0; j < colCount; j++) {
			row.push (i * rowCount + j);
		}
		array.push (row);
	}
	twoDimensionalArrays.addConstArray ("Data", array);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 7.仕事の割り振り]",
		missionExplanation: "各スレッドにどう仕事を割り振るかの学習です。",
		missionID: "mission2-7",
		score: new Mission.MissionScore (),
		program: "",
		goal: `グローバル配列「Data」の値を並列処理で全て0にし、その処理にかかった時間を表示する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const col of row) {
					if (col !== 0) {
						return false;
					}
				}
			}

			return consoleOutputs.length === 1 && !isNaN (Number (consoleOutputs[0]));
		}
	});
}

// ミッション2-8
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const rowCount = 4;
	const colCount = 8;
	twoDimensionalArrays.addRandomArray ("A", rowCount, colCount, 0, 10);
	twoDimensionalArrays.addRandomArray ("B", rowCount, colCount, 0, 10);
	const array: number[][] = Array (4);
	const row = Array (8);
	row.fill (0);
	array.fill (row);
	twoDimensionalArrays.addConstArray ("A+B", array);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 8.行列計算1]",
		missionExplanation: "並列処理を使って行列計算をしてみましょう",
		missionID: "mission2-8",
		score: new Mission.MissionScore (),
		program: "",
		goal: `グローバル2次元配列を行列に見立て、「A」の行列と「B」の行列を加算した結果を「A+B」の行列に代入する`,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (let row = 0; row < initialTwoDimensionalArrays["A+B"].length; row++) {
				for (let col = 0; col < initialTwoDimensionalArrays["A+B"][0].length; col++) {
					const correct = initialTwoDimensionalArrays["A"][row][col] + initialTwoDimensionalArrays["B"][row][col];
					if (twoDimensionalArraysResult["A+B"][row][col] !== correct) {
						return false;
					}
				}
			}
			return true;
		}
	});
}

// サンプルミッション
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	twoDimensionalArrays.addConstArray ("Array1", [
		[1, 2, 3, 4],
		[5, 6, 7, 8]
	]);
	twoDimensionalArrays.addRandomArray ("Array2", 2, 2, 0, 100);
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	oneDimensionalArrays.addRandomArray ("Array3", 4, 0, 10);
	missionContents.addMissionContent ({
		chapterName: "サンプル",
		missionTitle: "[サンプルミッション - グローバル配列]",
		missionExplanation: "グローバル配列について学びます。",
		missionID: "sample",
		score: new Mission.MissionScore (),
		program: "",
		goal: `グローバル配列 "Array1" の値をすべて0にする`,
		blockList: getAllBlockListXml (),
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays,
				initialOneDimensionalArrays,
				twoDimensionalArraysResult,
				oneDimensionalArraysResult) => {
			for (const row of twoDimensionalArraysResult["Array1"]) {
				for (const element of row) {
					if (element !== 0) {
						return false;
					}
				}
			}
			return true;
		}

	});
}
