/*
	Copyright (c) 2022 aquilaneo
	This software is released under the MIT License.
	LICENSE file is in the root directory of this repository.
*/

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

// ステージ1-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "1.プログラムの作り方",
		missionExplanation: <div>
			<div>まずは<span className={"keyword"}>コンソール</span>に文字列を表示するプログラムを作り、基本的なプログラミング方法を学びます。</div>
			<div>
				<span className={"keyword"}>プログラム画面</span>左側のメニューにある「動作」から<span className={"keyword"}>表示ブロック</span>を
				<span className={"keyword"}>関数 スタート</span>内にドラッグアンドドロップし、緑色の入力欄に「Hello」と入力してみてください。
			</div>
			<div>
				「ブロックを実行」ボタンを押すとプログラムがスタートします。
			</div>
		</div>,
		missionSummary: "まずはこのビジュアルプログラミングの使い方を学習します。",
		missionID: "mission1-01",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>コンソールに "Hello" と出力する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "2.複数のブロック",
		missionExplanation: <div>
			<div>プログラムのブロックは複数個連ねることができます。今回はコンソールにHelloと3回表示したいので、表示ブロックを3つ連ねます。</div>
			<div>配置し終わったら「ブロックを実行」ボタンからプログラムを実行してください。</div>
		</div>,
		missionSummary: "複数の命令ブロックを並べる方法を知っておきましょう。",
		missionID: "mission1-02",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>コンソールに3回 "Hello" と出力する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "3.繰り返し",
		missionExplanation: <div>
			<div>ある命令を指定した回数繰り返すには<span className={"keyword"}>繰り返しブロック</span>を使います。</div>
			<div>繰り返しブロックは「ループ」カテゴリの中にあります。</div>
			<div>このステージは使用するブロック数の制限があるため、ただ表示ブロックを50個並べる方法ではクリアできません。</div>
		</div>,
		missionSummary: "同じ操作を何回も繰り返すには「繰り返し(ループ)」を使うと便利です。",
		missionID: "mission1-03",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>コンソールに50回 "Hello" と出力する</div>,
		editable: true,
		blockCountLimit: 10,
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

// ステージ1-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "4.数値ブロックと計算",
		missionExplanation: <div>
			<span className={"keyword"}>数値ブロック</span>と<span className={"keyword"}>計算ブロック</span>の使い方を学びます。
		</div>,
		missionSummary: "プログラムに四則演算などの計算を行わせることができます。",
		missionID: "mission1-04",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div><span className={"keyword"}>数値ブロック</span>や<span className={"keyword"}>計算ブロック</span>を使用し、
			63×87の答えをコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "5.変数の使い方",
		missionExplanation: <div><span className={"keyword"}>変数の作り方</span>、<span className={"keyword"}>値の書き込み</span>/
			<span className={"keyword"}>読み込み</span>/<span className={"keyword"}>加算</span>の方法を学びます。</div>,
		missionSummary: "値を記憶しておくことのできる「変数」の使い方を学習します。",
		missionID: "mission1-05",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div><span className={"keyword"}>変数ブロック</span>を使用し、 1+2+3+4+5 の計算結果をコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-6
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "6.関数の作り方と使い方",
		missionExplanation: <div><span className={"keyword"}>関数(サブルーチン)</span>の作り方と使い方を学びます。</div>,
		missionSummary: "同じ処理が複数回登場するときは「関数」を使いましょう。",
		missionID: "mission1-06",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>29+76 を計算しコンソールに表示する<span className={"keyword"}>関数</span>を作成する。</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-7
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "7.関数の引数と戻り値",
		missionExplanation: <div>関数に値を渡す<span className={"keyword"}>引数(ひきすう)</span>と
			関数から結果を受け取る<span className={"keyword"}>戻り値</span>の使い方を学びます。</div>,
		missionSummary: "関数には値の入力である「引数」と出力である「戻り値」があります。",
		missionID: "mission1-07",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div><span className={"keyword"}>引数</span>で渡された3つの数値の平均を求める関数を作成し、12 64 83の平均をコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [],
			functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.FUNCTION_CALL_WITH_RETURN, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT, BlockType.RETURN_VALUE],
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

			if (!isEqual (consoleOutputs[0], (12 + 64 + 83) / 3)) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ステージ1-8
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "8.処理時間計測",
		missionExplanation: <div><span className={"keyword"}>ストップウォッチ</span>機能を使い、処理にかかった時間の計測を行います。</div>,
		missionSummary: "処理にかかった時間を計測するストップウォッチ機能の使い方を学習します。",
		missionID: "mission1-08",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>Helloと50回コンソールに表示し、最後にその処理にかかった時間を表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-9
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	globalVariables.addConstValue ("Value", 2);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "9.グローバル変数1",
		missionExplanation: <div>
			<div>
				<span className={"keyword"}>ローカル変数</span>は定義した関数内でしかアクセスすることはできませんが、
				<span className={"keyword"}>グローバル変数</span>は様々な関数内から同じ領域にアクセスすることができます。
			</div>
			<div>その分バグが発生したときに原因の特定が困難になりやすいので、使用する用途には注意するようにしましょう。</div>
			<div>このツールではグローバル変数は必要なものが問題であらかじめ用意され、そこへ読み込み/書き込みしていくとう方法になっています。</div>
			<div>まずはグローバル変数の読み込みを行ってみます。画面中央にグローバル変数の一覧があり、今回は「Value」という変数があります。</div>
			<div>「グローバルデータ」カテゴリのグローバル変数読み込みブロックを使用し、この変数Valueの値を読み取りコンソールに表示してください。</div>
		</div>,
		missionSummary: "どの関数からもアクセスできる変数から値を読み取ってみましょう。",
		missionID: "mission1-09",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル変数「Value」の値を読み込み、コンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_VARIABLE_READ],
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

			if (!isEqual (consoleOutputs[0], initialVariables["Value"])) {
				return {cleared: false, failReason: "出力された数字が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ステージ1-10
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	globalVariables.addConstValue ("Result", 0);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "10.グローバル変数2",
		missionExplanation: <div>
			次はグローバル変数の書き込みを行ってみます。読み込みの時と同じ「グローバルデータ」カテゴリにあるグローバル変数書き込みブロックを使用します。
		</div>,
		missionSummary: "どの関数からもアクセスできる変数に値を書き込んでみましょう。",
		missionID: "mission1-10",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>32 - 24の計算結果をグローバル変数「Result」に書き込む</div>,
		editable: true,
		blockCountLimit: -1,
		blockList: {
			behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
			logic: [],
			loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
			math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
			text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
			localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
			globalArrays: [BlockType.GLOBAL_VARIABLE_READ, BlockType.GLOBAL_VARIABLE_WRITE],
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
			if (variablesResult["Result"] !== 32 - 24) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ステージ1-11
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("Data", [2, 4, 6, 8]);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "11.グローバル1次元配列1",
		missionExplanation: <div>
			<div>
				<span className={"keyword"}>配列</span>は画面中央に図示されているように複数の値を記憶できるデータ構造です。
				値が入っているそれぞれの要素には<span className={"keyword"}>インデックス番号</span>を使ってアクセスします。
			</div>
			<div>このツールでは配列はグローバル領域のみで使用でき、グローバル変数と同じで各問題で必要なものが与えられます。</div>
			<div>
				グローバル配列の読み込みには「グローバルデータ」カテゴリの「グローバル配列読み込み」ブロックを使い、
				読み込みたい配列の名前とインデックス番号を指定します。
			</div>
		</div>,
		missionSummary: "どの関数からもアクセスできる1次元配列から値を読み取ってみましょう。",
		missionID: "mission1-11",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>配列「Data」の2番目の要素を読み取り、その内容をコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

			if (!isEqual (consoleOutputs[0], initialOneDimensionalArrays["Data"][2])) {
				return {cleared: false, failReason: "出力された数字が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ステージ1-12
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("Data", [2, 4, 6, 8]);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "12.グローバル1次元配列2",
		missionExplanation: <div>
			グローバル配列に値を書き込む際も読み込みと同じ「グローバルデータ」カテゴリを使用します。
			書き込みには書き込む配列の名前、インデックス番号と書き込む値を指定して使用します。
		</div>,
		missionSummary: "どの関数からもアクセスできる1次元配列に値を書き込んでみましょう。",
		missionID: "mission1-12",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>配列「Data」の全ての要素を0にする</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-13
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3], [4, 5, 6]]);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "13.グローバル2次元配列",
		missionExplanation: <div>
			<span className={"keyword"}>2次元配列</span>は行と列をインデックス番号として指定し値の読み書きを行うデータ構造です。
			これまでの配列と同じように読み込みと書き込みのブロックがあります。
		</div>,
		missionSummary: "どの関数からもアクセスできる2次元配列に値を読み書きしてみましょう。",
		missionID: "mission1-13",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>配列「Data」の全ての要素を0にする</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-14
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 2, 3, 0, 99);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "14.ランダムな配列",
		missionExplanation: <div>
			グローバル2次元配列を使った計算を行ってみます。今回は要素の値が<span className={"keyword"}>ランダム</span>で決まるため、
			プログラムではなく自分で答えを計算しただ表示するという解法はできません。
		</div>,
		missionSummary: "このツールのグローバル変数や配列には、ステージごとにランダムな値が与えられる場合があります。",
		missionID: "mission1-14",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>配列「Data」の全要素の平均をコンソールに出力する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ1-15
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 2, 3, 0, 99);
	missionContents.addMissionContent ({
		chapterName: "1章 基本操作と逐次プログラミング",
		chapterNameURL: "chapter1",
		missionTitle: "15.分岐",
		missionExplanation: <div>
			<div><span className={"keyword"}>分岐</span>を使うと、条件に応じて実行する処理を変えることができます。</div>
			<div>
				分岐は「分岐/論理」カテゴリ内にあり、条件を満たしたときのみ特定の処理を行う分岐(if文に相当)と、
				条件を満たしたときとそうでないときで別の処理を行わせる分岐(if-else文に相当)が存在します。
			</div>
		</div>,
		missionSummary: "条件によって処理を変えることができる「分岐」を学習します。",
		missionID: "mission1-15",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>配列「Data」の全要素の平均を計算し、結果が50以上だったら「High」、それ以外の場合は「Low」とコンソールに出力する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "1.スレッドの生成",
		missionExplanation: <div>
			<div>ここからいよいよ並列プログラミングに入ります。</div>
			<div>並列処理を行うためには指定した関数を<span className={"keyword"}>スレッド</span>として生成し複数個同時実行する必要があります。</div>
			<div>まずはHelloとコンソールに表示する関数を作りましょう。</div>
			<div>その後、スタート関数内に「並列処理」カテゴリのスレッド作成ブロックを用意し、関数名に作成した関数の名前を入力します。スレッド名はそれぞれのスレッドを区別するための名前で、他のスレッドと名前が被ってはいけません。</div>
			<div>「スレッド1」「スレッド2」というように何番目のスレッドかわかるようにすると良いでしょう。</div>
			<div>今回は4つのスレッドを同時実行するので、スタート関数内にはスレッド作成ブロックを4つ並べる必要があります。</div>
		</div>,
		missionSummary: "並列プログラミングの処理単位である「スレッド」の作成を行なってみます。",
		missionID: "mission2-01",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>4つの<span className={"keyword"}>スレッド</span>を生成し、
			それぞれの<span className={"keyword"}>スレッド</span>から1回ずつ「Hello」とコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "2.スレッドの終了待ち1",
		missionExplanation: <div>
			今回は各スレッドで10回Helloと表示する必要があります。このようにスレッド内である程度時間のかかる処理を行う場合はある困ったことが起こります。
		</div>,
		missionSummary: "複数スレッドを作成する際に気をつけなければならないことがあります。",
		missionID: "mission2-02",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>4つのスレッドを生成し、それぞれのスレッドから10回ずつ「Hello」とコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	missionContents.addMissionContent ({
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "3.スレッドの終了待ち2",
		missionExplanation: <div>
			<div>前回では各スレッドの処理が終了する前にスタート関数が終了してしまったため、途中でプログラムが終了してしまいました。</div>
			<div>これを防ぐためには、スタート関数に各スレッドの処理終了を待機してもらう必要があります。</div>
			<div>
				ここで使うのが<span className={"keyword"}>終了待ち機能(Join)</span>機能です。
				「並列処理」カテゴリの終了待ちブロックを使うと、指定した名前のスレッドの処理が終了するまでそのブロックでプログラムの実行が停止します。
			</div>
			<div>今回は4つのスレッドを生成するため、スタート関数内の終了待ちブロックも4つ必要になります。</div>
		</div>,
		missionSummary: "複数スレッド間で同期を取る方法を学習します。",
		missionID: "mission2-03",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>4つのスレッドを生成し、それぞれのスレッドから10回ずつ「Hello」とコンソールに表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("Data", [1, 2, 3, 4]);
	missionContents.addMissionContent ({
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "4.スレッドの引数",
		missionExplanation: <div>
			<div>関数と同じようにスレッドにも引数を渡すことができます。</div>
			<div>引数を渡す際にはスレッド作成ブロックの引数1~3の部分に値を入れます。
				スレッド内で引数を受け取るには関数の引数受け取りと同じように「関数」カテゴリの引数ブロックを使用します。
			</div>
		</div>,
		missionSummary: "スレッド生成時、通常の関数呼び出しと同じように引数を渡すことができます。",
		missionID: "mission2-04",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>4つのスレッド使い、グローバル配列「Data」の要素を全て0にする</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
	missionContents.addMissionContent ({
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "5.逐次処理と並列処理の比較1",
		missionExplanation: <div>
			<div>今回と次回のステージでは並列処理を使わない逐次的なプログラムと並列プログラムでどのような処理速度の差が出るか比較します。</div>
			<div>今回は並列処理は使用せず、通常の逐次プログラムで2次元配列を処理し、最後にその処理にかかった時間をストップウォッチで測り表示してください。</div>
		</div>,
		missionSummary: "通常の逐次処理と並列処理のプログラムで処理時間を比較します。まずは逐次処理を作ってみます。",
		missionID: "mission2-05",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル配列「Data」の値を並列処理を使わずに全て0にし、その処理にかかった時間を表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-6
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addConstArray ("Data", [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
	missionContents.addMissionContent ({
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "6.逐次処理と並列処理の比較2",
		missionExplanation: <div>
			<div>続いて今回は4スレッドの並列プログラムを使用して2次元配列を処理してください。</div>
			<div>配列の1行目を1スレッド目、2行目を2スレッド目...というように仕事を割り振り、処理させると良いでしょう。</div>
			<div>前回と同じように最後に処理にかかった時間をコンソールに表示し、前回のステージでの経過時間と比較してみてください。</div>
		</div>,
		missionSummary: "通常の逐次処理と並列処理のプログラムで処理時間を比較します。並列処理で同じ動きを作ってみます。",
		missionID: "mission2-06",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル配列「Data」の値を並列処理で全て0にし、その処理にかかった時間を表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-7
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
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "7.仕事の割り振り",
		missionExplanation: <div>
			<div>今回のステージでは8行16列という大きいサイズの配列の処理に挑戦します。</div>
			<div>最大4スレッドまでしか使えない中、各スレッドにどのように仕事を割り振れば良いでしょうか。</div>
		</div>,
		missionSummary: "大量のデータを並列処理するとき、各スレッドにどのように仕事を割り振れば良いでしょうか。",
		missionID: "mission2-07",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル配列「Data」の値を並列処理で全て0にし、その処理にかかった時間を表示する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ2-8
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
		chapterName: "2章 並列プログラミング入門",
		chapterNameURL: "chapter2",
		missionTitle: "8.行列計算",
		missionExplanation: <div>
			並列処理を使用して行列計算を行ってみましょう。
		</div>,
		missionSummary: "実践的な並列プログラミングを練習してみましょう。",
		missionID: "mission2-08",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル2次元配列を行列に見立て、「A」の行列と「B」の行列を加算した結果を「A+B」の行列に代入する</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ3-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	oneDimensionalArrays.addConstArray ("fib", [0, 0, 0, 0, 0, 0, 0, 0]);
	missionContents.addMissionContent ({
		chapterName: "3章 並列プログラミング基礎",
		chapterNameURL: "chapter3",
		missionTitle: "1.並列化困難なアルゴリズム",
		missionExplanation: <div>
			<div>世の中には並列化が難しいアルゴリズムも存在します。</div>
			<div>今回使用するフィボナッチ数列は有名な例です。フィボナッチ数列は、</div>
			<div>F0 = 0</div>
			<div>F1 = 1</div>
			<div>Fn+2 = Fn + Fn+1</div>
			<div>で与えられる数列です。</div>
		</div>,
		missionSummary: "世の中には並列化が難しいアルゴリズムも存在します。",
		missionID: "mission3-01",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>フィボナッチ数列を求め、0番目の要素にF0の値、1番目の要素にF1の値...というように配列「fib」を完成させる</div>,
		editable: true,
		blockCountLimit: -1,
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

// ステージ3-2
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 4, 4, 1, 9);
	globalVariables.addConstValue ("Sum", 0);
	missionContents.addMissionContent ({
		chapterName: "3章 並列プログラミング基礎",
		chapterNameURL: "chapter3",
		missionTitle: "2.排他制御1",
		missionExplanation: <div>複数スレッドからグローバル領域の同じ場所に書き込みを行う時には注意が必要です。</div>,
		missionSummary: "複数スレッドからグローバル領域の同じ場所に書き込みを行う際、逐次プログラミングでは起こらないある現象に注意が必要です。",
		missionID: "mission3-02",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>配列「Data」の各要素の合計を並列処理で求め、グローバル変数「sum」に代入する</div>,
		editable: true,
		blockCountLimit: -1,
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
			if (variablesResult["Sum"] === 0) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ステージ3-3
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	twoDimensionalArrays.addRandomArray ("Data", 4, 4, 1, 9);
	globalVariables.addConstValue ("Sum", 0);
	missionContents.addMissionContent ({
		chapterName: "3章 並列プログラミング基礎",
		chapterNameURL: "chapter3",
		missionTitle: "3.排他制御2",
		missionExplanation: <div>
			<div>前回のステージでは変数「Sum」への加算処理が各スレッドで衝突してしまい、誤った結果が計算されてしまいました。</div>
			<div>ミューテックスを使うと複数スレッドから安全にグローバル領域に書き込みを行うことができます。</div>
		</div>,
		missionSummary: "安全に複数スレッドからグローバル領域に書き込みを行うにはどうしたら良いでしょうか。",
		missionID: "mission3-03",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル変数「sum」に配列「Data」の各要素の合計を並列処理で入れる。</div>,
		editable: true,
		blockCountLimit: -1,
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
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN, BlockType.MUTEX_LOCK, BlockType.MUTEX_UNLOCK]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			let sum = 0;
			for (const row of initialTwoDimensionalArrays["Data"]) {
				for (const col of row) {
					sum += col;
				}
			}
			if (variablesResult["Sum"] !== sum) {
				return {cleared: false, failReason: "計算結果が異なります。"};
			}

			return {cleared: true, failReason: ""};
		}
	});
}

// ステージ3-4
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	globalVariables.addConstValue ("Value1", 0);
	globalVariables.addConstValue ("Value2", 0);
	missionContents.addMissionContent ({
		chapterName: "3章 並列プログラミング基礎",
		chapterNameURL: "chapter3",
		missionTitle: "4.デッドロック1",
		missionExplanation: <div>
			<div>ミューテックスは便利な機能ですが、使い方に注意しないとプログラムがフリーズする原因となります。</div>
			<div>このステージではあらかじめ用意されたプログラムを実行し、その現象を確認してみます。プログラムは編集不可になっています。</div>
		</div>,
		missionSummary: "ミューテックスは便利な機能ですが、使い方に注意しないとプログラムがフリーズする原因となります。",
		missionID: "mission3-04",
		score: new Mission.MissionScore (),
		defaultProgram: "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"entry_point\" id=\"5e{JeNdzKRK}Nyg(x2Ul\" x=\"58\" y=\"59\"><statement name=\"routine\"><block type=\"thread_create\" id=\"M-u)d9Kj*Y0/p(xZa|?@\"><field name=\"thread_function_name\">スレッドA</field><value name=\"thread_name\"><shadow type=\"text\" id=\"b3V,_dF.((/@2N[?,}ai\"><field name=\"TEXT\">スレッド1</field></shadow></value><value name=\"argument1\"><shadow type=\"math_number\" id=\"/hk3C)59^~}gn1tdebqQ\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument2\"><shadow type=\"math_number\" id=\"sKJQMZNlyr(WidSgzrxU\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument3\"><shadow type=\"math_number\" id=\"p{{-gLjtOJ.ZmC3m3[+s\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"thread_create\" id=\"]7i*2m~H-f?,G#}EkOM5\"><field name=\"thread_function_name\">スレッドB</field><value name=\"thread_name\"><shadow type=\"text\" id=\"~fgy!ViH%TLLg?TE/][#\"><field name=\"TEXT\">スレッド2</field></shadow></value><value name=\"argument1\"><shadow type=\"math_number\" id=\"mBzH?(v~goBow8|`n90O\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument2\"><shadow type=\"math_number\" id=\"pho}#mIGcCjwW,nmS?:A\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument3\"><shadow type=\"math_number\" id=\"sZ`sj+xw?X7{#f8hz9Md\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"thread_join\" id=\"+ozu|.Uvf2wuBGQrPk/0\"><value name=\"thread_name\"><shadow type=\"text\" id=\"r5c{3j/+plxClP{*0sa*\"><field name=\"TEXT\">スレッド1</field></shadow></value><next><block type=\"thread_join\" id=\"D@`ZWgGn/),/PPZ%Da]z\"><value name=\"thread_name\"><shadow type=\"text\" id=\"?Awa9y@$}Rp/|Kk1{{y$\"><field name=\"TEXT\">スレッド2</field></shadow></value></block></next></block></next></block></next></block></statement></block><block type=\"function_definition\" id=\"uf]-n=qS=[Vr3;LnO^[,\" x=\"60\" y=\"306\"><field name=\"name\">スレッドA</field><statement name=\"routine\"><block type=\"controls_repeat_ext\" id=\"Mupq}=Zy`:XL4yjbHE]-\"><value name=\"TIMES\"><shadow type=\"math_number\" id=\"k7y-97P3^N/(Bhh1g%Dn\"><field name=\"NUM\">10</field></shadow></value><statement name=\"DO\"><block type=\"mutex_lock\" id=\"~LQ3KvQ%HXSr?+(,dncg\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"GIa!2HaLbxqsA{tG%NP2\"><field name=\"TEXT\">Value1</field></shadow></value><next><block type=\"global_variable_write\" id=\"gUnjd.Q_N,N}cQ$4S@5r\"><field name=\"name\">Value1</field><value name=\"value\"><shadow type=\"math_number\" id=\"t#TDnVY9)Wp3:W7DVlh7\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"Z}`!9,U30Ks;KVkW_=r+\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\" id=\"OaA0qK:[_vk~a$Zo-J,~\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"Q+9Z%(pn5n@8@zQ*O:Y)\"><field name=\"name\">Value1</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"0=dbF)3y::1D$AvqYxj{\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_lock\" id=\"PfTJ}wsEc$duOCE}.C6P\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"{,RhKFK@WS8vm]-i?D$a\"><field name=\"TEXT\">Value2</field></shadow></value><next><block type=\"global_variable_write\" id=\"*eP0cs;iTrb_E2:cIGeK\"><field name=\"name\">Value2</field><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"6RORErS-`-R~IV@aH~CY\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"NaSG4hOaj3kmKHlAMm!h\"><field name=\"name\">Value2</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"wY9bHW.;KUY|+Ko=ex4]\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_unlock\" id=\"M*5{g$gJBP@$OEjpe.7@\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"y*5}tO=)dU^GQEy6#:AJ\"><field name=\"TEXT\">Value1</field></shadow></value><next><block type=\"mutex_unlock\" id=\"aaGJ8;pJ/dkTp}pyhRGd\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"Kcy!4Q]oo52+mc2^4na3\"><field name=\"TEXT\">Value2</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type=\"function_definition\" id=\"aUCR?li!A[up^OHB)jOL\" x=\"58\" y=\"718\"><field name=\"name\">スレッドB</field><statement name=\"routine\"><block type=\"controls_repeat_ext\" id=\"$nrcvf$r_xi(|48Gl/_y\"><value name=\"TIMES\"><shadow type=\"math_number\" id=\"[JWavU]@MY#e=/K#$|6R\"><field name=\"NUM\">10</field></shadow></value><statement name=\"DO\"><block type=\"mutex_lock\" id=\"8d79oZE?F#zllNK4MH30\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"`|uv_51`=ok;Dp6D!ch=\"><field name=\"TEXT\">Value2</field></shadow></value><next><block type=\"global_variable_write\" id=\"/gw98b(]sXhl9nwHex[`\"><field name=\"name\">Value2</field><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"0?{WuOu@cs[?qy~nNhz{\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"hU-xleuOFO+qD^nd/e0p\"><field name=\"name\">Value2</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"*[4+1nr9C/;MWTjw(tBk\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_lock\" id=\"gXO.n~jgmhq_d^vz28so\"><value name=\"mutex_id\"><shadow type=\"text\" id=\";wm9.jLUa}KUBX|b$1/H\"><field name=\"TEXT\">Value1</field></shadow></value><next><block type=\"global_variable_write\" id=\"J%;WuZwa}NkolQb,X}Fb\"><field name=\"name\">Value1</field><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"5{e|@0aE;+GOwDC.x`~e\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"!*+^F}f(g-thw9(YaiD*\"><field name=\"name\">Value1</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"n?9Q/`2#T;SeqAp@9i,9\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_unlock\" id=\"Y~.[l(bmK5A{3xQr(qJ9\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"@I#/5v!nB1p-^=;o_gNY\"><field name=\"TEXT\">Value2</field></shadow></value><next><block type=\"mutex_unlock\" id=\"Fz~zI.XOyC-Q}v8Q1jgo\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"/(05zQx#,.Y3^sB7OJoW\"><field name=\"TEXT\">Value1</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block></xml>",
		program: "",
		goal: <div>用意されたプログラムを実行する。</div>,
		editable: false,
		blockCountLimit: -1,
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
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN, BlockType.MUTEX_LOCK, BlockType.MUTEX_UNLOCK]
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

// ステージ3-5
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	const globalVariables = new Mission.GlobalVariables ();
	globalVariables.addConstValue ("Value1", 0);
	globalVariables.addConstValue ("Value2", 0);
	missionContents.addMissionContent ({
		chapterName: "3章 並列プログラミング基礎",
		chapterNameURL: "chapter3",
		missionTitle: "5.デッドロック2",
		missionExplanation: <div>
			<div>
				先ほどのような、お互いに相手のスレッドのロック解除を待ってしまいプログラムが先に進まなくなる現象を
				<span className={"keyword"}>デッドロック</span>と言います。
			</div>
			<div>このような現象を防止するにはどのようにすれば良いでしょうか。先ほどのプログラムを改造して動作を改善してみましょう。</div>
		</div>,
		missionSummary: "デッドロックを防止するにはどのようにすれば良いでしょうか。",
		missionID: "mission3-05",
		score: new Mission.MissionScore (),
		defaultProgram: "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"entry_point\" id=\"5e{JeNdzKRK}Nyg(x2Ul\" x=\"58\" y=\"59\"><statement name=\"routine\"><block type=\"thread_create\" id=\"M-u)d9Kj*Y0/p(xZa|?@\"><field name=\"thread_function_name\">スレッドA</field><value name=\"thread_name\"><shadow type=\"text\" id=\"b3V,_dF.((/@2N[?,}ai\"><field name=\"TEXT\">スレッド1</field></shadow></value><value name=\"argument1\"><shadow type=\"math_number\" id=\"/hk3C)59^~}gn1tdebqQ\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument2\"><shadow type=\"math_number\" id=\"sKJQMZNlyr(WidSgzrxU\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument3\"><shadow type=\"math_number\" id=\"p{{-gLjtOJ.ZmC3m3[+s\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"thread_create\" id=\"]7i*2m~H-f?,G#}EkOM5\"><field name=\"thread_function_name\">スレッドB</field><value name=\"thread_name\"><shadow type=\"text\" id=\"~fgy!ViH%TLLg?TE/][#\"><field name=\"TEXT\">スレッド2</field></shadow></value><value name=\"argument1\"><shadow type=\"math_number\" id=\"mBzH?(v~goBow8|`n90O\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument2\"><shadow type=\"math_number\" id=\"pho}#mIGcCjwW,nmS?:A\"><field name=\"NUM\">0</field></shadow></value><value name=\"argument3\"><shadow type=\"math_number\" id=\"sZ`sj+xw?X7{#f8hz9Md\"><field name=\"NUM\">0</field></shadow></value><next><block type=\"thread_join\" id=\"+ozu|.Uvf2wuBGQrPk/0\"><value name=\"thread_name\"><shadow type=\"text\" id=\"r5c{3j/+plxClP{*0sa*\"><field name=\"TEXT\">スレッド1</field></shadow></value><next><block type=\"thread_join\" id=\"D@`ZWgGn/),/PPZ%Da]z\"><value name=\"thread_name\"><shadow type=\"text\" id=\"?Awa9y@$}Rp/|Kk1{{y$\"><field name=\"TEXT\">スレッド2</field></shadow></value></block></next></block></next></block></next></block></statement></block><block type=\"function_definition\" id=\"uf]-n=qS=[Vr3;LnO^[,\" x=\"60\" y=\"306\"><field name=\"name\">スレッドA</field><statement name=\"routine\"><block type=\"controls_repeat_ext\" id=\"Mupq}=Zy`:XL4yjbHE]-\"><value name=\"TIMES\"><shadow type=\"math_number\" id=\"k7y-97P3^N/(Bhh1g%Dn\"><field name=\"NUM\">10</field></shadow></value><statement name=\"DO\"><block type=\"mutex_lock\" id=\"~LQ3KvQ%HXSr?+(,dncg\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"GIa!2HaLbxqsA{tG%NP2\"><field name=\"TEXT\">Value1</field></shadow></value><next><block type=\"global_variable_write\" id=\"gUnjd.Q_N,N}cQ$4S@5r\"><field name=\"name\">Value1</field><value name=\"value\"><shadow type=\"math_number\" id=\"t#TDnVY9)Wp3:W7DVlh7\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"Z}`!9,U30Ks;KVkW_=r+\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\" id=\"OaA0qK:[_vk~a$Zo-J,~\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"Q+9Z%(pn5n@8@zQ*O:Y)\"><field name=\"name\">Value1</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"0=dbF)3y::1D$AvqYxj{\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_lock\" id=\"PfTJ}wsEc$duOCE}.C6P\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"{,RhKFK@WS8vm]-i?D$a\"><field name=\"TEXT\">Value2</field></shadow></value><next><block type=\"global_variable_write\" id=\"*eP0cs;iTrb_E2:cIGeK\"><field name=\"name\">Value2</field><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"6RORErS-`-R~IV@aH~CY\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"NaSG4hOaj3kmKHlAMm!h\"><field name=\"name\">Value2</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"wY9bHW.;KUY|+Ko=ex4]\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_unlock\" id=\"M*5{g$gJBP@$OEjpe.7@\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"y*5}tO=)dU^GQEy6#:AJ\"><field name=\"TEXT\">Value1</field></shadow></value><next><block type=\"mutex_unlock\" id=\"aaGJ8;pJ/dkTp}pyhRGd\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"Kcy!4Q]oo52+mc2^4na3\"><field name=\"TEXT\">Value2</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type=\"function_definition\" id=\"aUCR?li!A[up^OHB)jOL\" x=\"58\" y=\"718\"><field name=\"name\">スレッドB</field><statement name=\"routine\"><block type=\"controls_repeat_ext\" id=\"$nrcvf$r_xi(|48Gl/_y\"><value name=\"TIMES\"><shadow type=\"math_number\" id=\"[JWavU]@MY#e=/K#$|6R\"><field name=\"NUM\">10</field></shadow></value><statement name=\"DO\"><block type=\"mutex_lock\" id=\"8d79oZE?F#zllNK4MH30\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"`|uv_51`=ok;Dp6D!ch=\"><field name=\"TEXT\">Value2</field></shadow></value><next><block type=\"global_variable_write\" id=\"/gw98b(]sXhl9nwHex[`\"><field name=\"name\">Value2</field><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"0?{WuOu@cs[?qy~nNhz{\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"hU-xleuOFO+qD^nd/e0p\"><field name=\"name\">Value2</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"*[4+1nr9C/;MWTjw(tBk\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_lock\" id=\"gXO.n~jgmhq_d^vz28so\"><value name=\"mutex_id\"><shadow type=\"text\" id=\";wm9.jLUa}KUBX|b$1/H\"><field name=\"TEXT\">Value1</field></shadow></value><next><block type=\"global_variable_write\" id=\"J%;WuZwa}NkolQb,X}Fb\"><field name=\"name\">Value1</field><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"math_arithmetic\" id=\"5{e|@0aE;+GOwDC.x`~e\"><field name=\"OP\">ADD</field><value name=\"A\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow><block type=\"global_variable_read\" id=\"!*+^F}f(g-thw9(YaiD*\"><field name=\"name\">Value1</field></block></value><value name=\"B\"><shadow type=\"math_number\" id=\"n?9Q/`2#T;SeqAp@9i,9\"><field name=\"NUM\">1</field></shadow></value></block></value><next><block type=\"mutex_unlock\" id=\"Y~.[l(bmK5A{3xQr(qJ9\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"@I#/5v!nB1p-^=;o_gNY\"><field name=\"TEXT\">Value2</field></shadow></value><next><block type=\"mutex_unlock\" id=\"Fz~zI.XOyC-Q}v8Q1jgo\"><value name=\"mutex_id\"><shadow type=\"text\" id=\"/(05zQx#,.Y3^sB7OJoW\"><field name=\"TEXT\">Value1</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></statement></block></xml>",
		program: "",
		goal: <div>用意されたプログラムを改造し、グローバル変数Value1とValue2が無事に20になるようにする</div>,
		editable: true,
		blockCountLimit: -1,
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
			parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN, BlockType.MUTEX_LOCK, BlockType.MUTEX_UNLOCK]
		},
		twoDimensionalArrays: twoDimensionalArrays,
		oneDimensionalArrays: oneDimensionalArrays,
		globalVariables: globalVariables,
		judge: (consoleOutputs,
				initialTwoDimensionalArrays, initialOneDimensionalArrays, initialVariables,
				twoDimensionalArraysResult, oneDimensionalArraysResult, variablesResult) => {
			if (variablesResult["Value1"] !== 20) {
				return {cleared: false, failReason: "Value1の値が異なります。"};
			}
			if (variablesResult["Value2"] !== 20) {
				return {cleared: false, failReason: "Value2の値が異なります。"};
			}
			return {cleared: true, failReason: ""};
		}
	});
}

// サンプルステージ
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
		chapterNameURL: "sample",
		missionTitle: "グローバル配列",
		missionExplanation: <div>グローバル配列について学びます。</div>,
		missionSummary: "サンプルステージです。",
		missionID: "sample",
		score: new Mission.MissionScore (),
		defaultProgram: "",
		program: "",
		goal: <div>グローバル配列 "Array1" の値をすべて0にする</div>,
		editable: true,
		blockCountLimit: -1,
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
