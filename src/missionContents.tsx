import * as Mission from "./mission";
import {BlockType, getAllBlockListXml} from "./blockSettings";
import React from "react";
import "./missionContents.scss";

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
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 1.プログラムの作り方]",
		missionExplanation: <div><span className={"keyword"}>printブロック</span>を使ってプログラムの作り方を学びます。</div>,
		missionID: "mission1-01",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>コンソールに "Hello" と出力する</div>,
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
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールにテキストを出力してください。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			if (consoleOutputs[0] !== "Hello") {
				return {cleared: false, failReason: "出力されたテキストが違います。「Hello」と出力してください。"};
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 2.複数のブロック]",
		missionExplanation: <div><span className={"keyword"}>複数のブロック</span>の並べ方を学びます。</div>,
		missionID: "mission1-02",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>コンソールに3回 "Hello" と出力する</div>,
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
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 3) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 3) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const consoleOutput of consoleOutputs) {
				if (consoleOutput !== "Hello") {
					return {cleared: false, failReason: "「Hello」ではないコンソール出力が混ざっています。"};
				}
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 3.繰り返し]",
		missionExplanation: <div><span className={"keyword"}>繰り返しブロック</span>の使い方を学びます。</div>,
		missionID: "mission1-03",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>コンソールに50回 "Hello" と出力する</div>,
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
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 50) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 50) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const consoleOutput of consoleOutputs) {
				if (consoleOutput !== "Hello") {
					return {cleared: false, failReason: "「Hello」ではないコンソール出力が混ざっています。"};
				}
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 4.数値ブロックと計算]",
		missionExplanation: <div>
			<span className={"keyword"}>数値ブロック</span>と<span className={"keyword"}>計算ブロック</span>の使い方を学びます。
		</div>,
		missionID: "mission1-04",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div><span className={"keyword"}>数値ブロック</span>や<span className={"keyword"}>計算ブロック</span>を使用し、
			63×87の答えをコンソールに表示する</div>,
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
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			if (!isEqual (consoleOutputs[0], 63 * 87)) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 5.変数の使い方]",
		missionExplanation: <div><span className={"keyword"}>変数の作り方</span>、<span className={"keyword"}>値の書き込み</span>/
			<span className={"keyword"}>読み込み</span>/<span className={"keyword"}>加算</span>の方法を学びます。</div>,
		missionID: "mission1-05",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div><span className={"keyword"}>変数ブロック</span>を使用し、 1+2+3+4+5 の計算結果をコンソールに表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [],
			functions: [],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			if (!isEqual (consoleOutputs[0], 1 + 2 + 3 + 4 + 5)) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-6
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 6.関数の作り方と使い方]",
		missionExplanation: <div><span className={"keyword"}>関数(サブルーチン)</span>の作り方と使い方を学びます。</div>,
		missionID: "mission1-06",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>29+76 を計算しコンソールに表示する<span className={"keyword"}>関数</span>を作成する。</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			if (!isEqual (consoleOutputs[0], 29 + 76)) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-7
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 7.関数の引数]",
		missionExplanation: <div>関数に値を渡す<span className={"keyword"}>引数(ひきすう)</span>の使い方を学びます。</div>,
		missionID: "mission1-07",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div><span className={"keyword"}>引数</span>で渡された3つの数値の平均を求める関数を作成し、12 65 83の平均をコンソールに表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			if (!isEqual (consoleOutputs[0], (12 + 65 + 83) / 3)) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-8
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 8.処理時間計測]",
		missionExplanation: <div><span className={"keyword"}>ストップウォッチ</span>機能を使い、処理にかかった時間の計測を行います。</div>,
		missionID: "mission1-08",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>Helloと50回コンソールに表示し、最後にその処理にかかった時間を表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 51) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 51) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			// Hello判定
			for (let i = 0; i < consoleOutputs.length - 1; i++) {
				if (consoleOutputs[i] !== "Hello") {
					return {cleared: false, failReason: "「Hello」ではないコンソール出力が混ざっています。"};
				}
			}

			// 判定用にコンソール出力を数値型に変換
			const number = Number (consoleOutputs[consoleOutputs.length - 1]);
			if (isNaN (number)) {
				return {cleared: false, failReason: "最後にはストップウォッチで測った時間を出力してください。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-9
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("Data", [2, 4, 6, 8]);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 9.グローバル1次元配列1]",
		missionExplanation: <div><span className={"keyword"}>グローバル1次元配列</span>の読み込み方を学習します。</div>,
		missionID: "mission1-09",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>配列「Data」の2番目の要素を読み取り、その内容をコンソールに表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			if (!isEqual (consoleOutputs[0], oneDimensionalArraysResult["Data"][2])) {
				return {cleared: false, failReason: "出力された数字が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-10
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("Data", [2, 4, 6, 8]);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 10.グローバル1次元配列2]",
		missionExplanation: <div><span className={"keyword"}>グローバル1次元配列</span>の書き込み方を学習します。</div>,
		missionID: "mission1-10",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>配列「Data」の全ての要素を0にする</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			for (const value of oneDimensionalArraysResult["Data"]) {
				if (value !== 0) {
					return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
				}
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-11
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3], [4, 5, 6]]);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 11.グローバル2次元配列]",
		missionExplanation: <div><span className={"keyword"}>グローバル2次元配列</span>の使い方を学習します。</div>,
		missionID: "mission1-11",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>配列「Data」の全ての要素を0にする</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const value of row) {
					if (value !== 0) {
						return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
					}
				}
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-12
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 2, 3, 0, 99);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 12.ランダムな配列]",
		missionExplanation: <div>グローバル2次元配列を使った計算です。今回は要素の値が<span className={"keyword"}>ランダム</span>で決まります。</div>,
		missionID: "mission1-12",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>配列「Data」の全要素の平均をコンソールに出力する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			let sum = 0;
			let count = 0
			for (const row of initialTwoDimensionalArrays["Data"]) {
				for (const value of row) {
					sum += value;
					count++;
				}
			}
			if (!isEqual (consoleOutputs[0], sum / count)) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション1-13
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 2, 3, 0, 99);
	missionContents.addMissionContent ({
		chapterName: "1章",
		missionTitle: "[1章 基本操作編 - 13.分岐]",
		missionExplanation: <div><span className={"keyword"}>分岐</span>の使い方を学習します。</div>,
		missionID: "mission1-13",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>配列「Data」の全要素の平均を計算し、結果が50以上だったら「High」、それ以外の場合は「Low」とコンソールに出力する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: []
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			let sum = 0;
			let count = 0
			for (const row of initialTwoDimensionalArrays["Data"]) {
				for (const value of row) {
					sum += value;
					count++;
				}
			}
			const average = sum / count;
			if (consoleOutputs[0] !== (average >= 50 ? "High" : "Low")) {
				return {cleared: false, failReason: "出力結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 1.スレッドの生成]",
		missionExplanation: <div><span className={"keyword"}>スレッド</span>の作り方を学習します。</div>,
		missionID: "mission2-01",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>4つの<span className={"keyword"}>スレッド</span>を生成し、
			それぞれの<span className={"keyword"}>スレッド</span>から1回ずつ「Hello」とコンソールに表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 4) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 4) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const outputs of consoleOutputs) {
				if (outputs !== "Hello") {
					return {cleared: false, failReason: "「Hello」ではないコンソール出力が混ざっています。"};
				}
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 2.スレッドの終了待ち1]",
		missionExplanation: <div>実用的なスレッド処理について学びます。</div>,
		missionID: "mission2-02",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>4つのスレッドを生成し、それぞれのスレッドから10回ずつ「Hello」とコンソールに表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 3.スレッドの終了待ち2]",
		missionExplanation: <div>スレッドの<span className={"keyword"}>終了待ち機能(Join)</span>について学びます。</div>,
		missionID: "mission2-03",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>4つのスレッドを生成し、それぞれのスレッドから10回ずつ「Hello」とコンソールに表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 4 * 10) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 4 * 10) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const output of consoleOutputs) {
				if (output !== "Hello") {
					return {cleared: false, failReason: "「Hello」ではないコンソール出力が混ざっています。"};
				}
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("Data", [1, 2, 3, 4]);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 4.スレッドの引数]",
		missionExplanation: <div>スレッドに渡す<span className={"keyword"}>引数</span>について学びます。</div>,
		missionID: "mission2-04",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>4つのスレッド使い、グローバル配列「Data」の要素を全て0にする</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			for (const value of oneDimensionalArraysResult["Data"]) {
				if (value !== 0) {
					return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
				}
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 5.逐次処理と並列処理の比較1]",
		missionExplanation: <div>逐次処理と並列処理の処理速度について比較します。</div>,
		missionID: "mission2-05",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>グローバル配列「Data」の値を並列処理を使わずに全て0にし、その処理にかかった時間を表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const col of row) {
					if (col !== 0) {
						return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
					}
				}
			}

			if (isNaN (Number (consoleOutputs[0]))) {
				return {cleared: false, failReason: "コンソールには処理時間を出力してください。"}
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-6
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
	missionContents.addMissionContent ({
		chapterName: "2章",
		missionTitle: "[2章 並列プログラミング入門編 - 6.逐次処理と並列処理の比較2]",
		missionExplanation: <div>逐次処理と並列処理の処理速度について比較します。</div>,
		missionID: "mission2-06",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>グローバル配列「Data」の値を並列処理で全て0にし、その処理にかかった時間を表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const col of row) {
					if (col !== 0) {
						return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
					}
				}
			}

			if (isNaN (Number (consoleOutputs[0]))) {
				return {cleared: false, failReason: "コンソールには処理時間を出力してください。"}
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-7
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
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
		missionExplanation: <div>各スレッドにどう仕事を割り振るかの学習です。</div>,
		missionID: "mission2-07",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>グローバル配列「Data」の値を並列処理で全て0にし、その処理にかかった時間を表示する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (consoleOutputs.length < 1) {
				return {cleared: false, failReason: "コンソールへの出力が少なすぎます。"};
			} else if (consoleOutputs.length > 1) {
				return {cleared: false, failReason: "コンソールへの出力が多すぎます。"};
			}

			for (const row of twoDimensionalArraysResult["Data"]) {
				for (const col of row) {
					if (col !== 0) {
						return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
					}
				}
			}

			if (isNaN (Number (consoleOutputs[0]))) {
				return {cleared: false, failReason: "コンソールには処理時間を出力してください。"}
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション2-8
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
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
		missionExplanation: <div>並列処理を使って行列計算をしてみましょう</div>,
		missionID: "mission2-08",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>グローバル2次元配列を行列に見立て、「A」の行列と「B」の行列を加算した結果を「A+B」の行列に代入する</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			for (let row = 0; row < initialTwoDimensionalArrays["A+B"].length; row++) {
				for (let col = 0; col < initialTwoDimensionalArrays["A+B"][0].length; col++) {
					const correct = initialTwoDimensionalArrays["A"][row][col] + initialTwoDimensionalArrays["B"][row][col];
					if (twoDimensionalArraysResult["A+B"][row][col] !== correct) {
						return {cleared: false, failReason: "計算結果が異なります。"};
					}
				}
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション3-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("fib", [0, 0, 0, 0, 0, 0, 0, 0]);
	missionContents.addMissionContent ({
		chapterName: "3章",
		missionTitle: "[3章 並列プログラミング基礎編 - 1.並列化できないアルゴリズム]",
		missionExplanation: <div>世の中には並列化できないアルゴリズムも存在します。</div>,
		missionID: "mission3-01",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>フィボナッチ数列を求める。</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			const correct = [0, 1, 1, 2, 3, 5, 8, 13];
			for (let i = 0; i < correct.length; i++) {
				if (oneDimensionalArraysResult["fib"][i] !== correct[i]) {
					return {cleared: false, failReason: "計算結果が異なります。"};
				}
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ミッション3-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 4, 4, 1, 9);
	globalVariables.addConstValue ("Sum", 0);
	missionContents.addMissionContent ({
		chapterName: "3章",
		missionTitle: "[3章 並列プログラミング基礎編 - 4.排他制御1]",
		missionExplanation: <div>複数スレッドからグローバル領域の同じ場所に書き込みを行う時には注意が必要です。</div>,
		missionID: "mission3-04",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>グローバル変数「sum」に配列「Data」の各要素の合計を並列処理で入れる。</div>,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_VARIABLE_READ, BlockType.GLOBAL_VARIABLE_WRITE, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
			measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (variablesResult["sum"] === 0) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
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
	const globalVariables = new Mission.GlobalVariables ();
	globalVariables.addConstValue ("Value1", 2);
	globalVariables.addRandomValue ("Value2", 0, 99);
	missionContents.addMissionContent ({
		chapterName: "サンプル",
		missionTitle: "[サンプルミッション - グローバル配列]",
		missionExplanation: <div>グローバル配列について学びます。</div>,
		missionID: "sample",
		score: new Mission.MissionScore (),
		program: "",
		goal: <div>グローバル配列 "Array1" の値をすべて0にする</div>,
		blockList: getAllBlockListXml (),
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			for (const row of twoDimensionalArraysResult["Array1"]) {
				for (const element of row) {
					if (element !== 0) {
						return {cleared: false, failReason: "Dataに0でない要素が含まれています。"};
					}
				}
			}
			return {cleared: true, failReason: ""};
		}

	});
}
