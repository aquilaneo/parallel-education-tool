import * as Mission from "./mission";
import * as BlockSettings from "./blockSettings";

export const missionContents: Mission.MissionContent[] = [];
export let missionScores: { missionID: string, cleared: boolean, time: number, blocks: number }[] = [];

// 浮動小数点誤差も考えてコンソール出力と計算結果が正しいか比較する関数
function isEqual (consoleOutputs: string, correctValue: number) {
	const number = Number (consoleOutputs);
	return !isNaN (number) && Math.abs (correctValue - number) < Number.EPSILON;
}

// ミッション1-1
{
	const twoDimensionalArrays = new Mission.TwoDimensionalArrays ();
	const oneDimensionalArrays = new Mission.OneDimensionalArrays ();
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 1.プログラムの作り方]",
		missionExplanation: "printブロックを使ってプログラムの作り方を学びます。",
		missionID: "mission1-01",
		goal: `コンソールに "Hello" と出力する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 2.複数のブロック]",
		missionExplanation: "複数のブロックの並べ方を学びます。",
		missionID: "mission1-02",
		goal: `コンソールに3回 "Hello" と出力する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 3.繰り返し]",
		missionExplanation: "繰り返しブロックの使い方を学びます。",
		missionID: "mission1-03",
		goal: `コンソールに50回 "Hello" と出力する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 4.数値ブロックと計算]",
		missionExplanation: "数値ブロックと計算ブロックの使い方を学びます。",
		missionID: "mission1-04",
		goal: `数値ブロックや計算ブロックを使用し、 63×87 の答えをコンソールに表示する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 5.変数の使い方]",
		missionExplanation: "変数の作り方、値の書き込み/読み込み/加算の方法を学びます。",
		missionID: "mission1-05",
		goal: `変数ブロックを使用し、 1+2+3+4+5 の計算結果をコンソールに表示する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 6.関数の作り方と使い方]",
		missionExplanation: "関数(サブルーチン)の作り方と使い方を学びます。",
		missionID: "mission1-06",
		goal: `29+76 を計算しコンソールに表示する関数を作成する。`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 7.関数の引数]",
		missionExplanation: "関数に値を渡す「引数(ひきすう)」の使い方を学びます。",
		missionID: "mission1-07",
		goal: `引数で渡された3つの数値の平均を求める関数を作成し、12 65 83の平均をコンソールに表示する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 8.処理時間計測]",
		missionExplanation: "ストップウォッチ機能を使い、処理にかかった時間の計測を行います。",
		missionID: "mission1-08",
		goal: `Helloと50回コンソールに表示し、最後にその処理にかかった時間を表示する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
				
				
				<category name="計測">
					<block type="stopwatch_start">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="stopwatch_stop">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_reset">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_read">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 9.グローバル1次元配列1]",
		missionExplanation: "グローバル1次元配列の読み込み方を学習します。",
		missionID: "mission1-09",
		goal: `配列「Data」の2番目の要素を読み取り、その内容をコンソールに表示する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				
				<category name="グローバル配列">	
					<block type="global_one_dimensional_array_read">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
				
				
				<category name="計測">
					<block type="stopwatch_start">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="stopwatch_stop">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_reset">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_read">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 10.グローバル1次元配列2]",
		missionExplanation: "グローバル1次元配列の書き込み方を学習します。",
		missionID: "mission1-10",
		goal: `配列「Data」の全ての要素を0にする`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				
				<category name="グローバル配列">	
					<block type="global_one_dimensional_array_read">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_one_dimensional_array_write">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
				
				
				<category name="計測">
					<block type="stopwatch_start">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="stopwatch_stop">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_reset">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_read">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 11.グローバル2次元配列]",
		missionExplanation: "グローバル2次元配列の使い方を学習します。",
		missionID: "mission1-11",
		goal: `配列「Data」の全ての要素を0にする`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				
				<category name="グローバル配列">	
					<block type="global_one_dimensional_array_read">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_one_dimensional_array_write">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_two_dimensional_array_read">
						<value name="row">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="col">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_two_dimensional_array_write">
						<value name="row">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="col">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
				
				
				<category name="計測">
					<block type="stopwatch_start">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="stopwatch_stop">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_reset">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_read">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 12.ランダムな配列]",
		missionExplanation: "グローバル2次元配列を使った計算です。今回は要素の値がランダムで決まります。",
		missionID: "mission1-12",
		goal: `配列「Data」の全要素の平均をコンソールに出力する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				
				<category name="グローバル配列">	
					<block type="global_one_dimensional_array_read">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_one_dimensional_array_write">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_two_dimensional_array_read">
						<value name="row">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="col">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_two_dimensional_array_write">
						<value name="row">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="col">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
				
				
				<category name="計測">
					<block type="stopwatch_start">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="stopwatch_stop">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_reset">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_read">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[1章 基本操作編 - 13.分岐]",
		missionExplanation: "分岐の使い方を学習します。",
		missionID: "mission1-13",
		goal: `配列「Data」の全要素の平均を計算し、結果が50以上だったら「High」、それ以外の場合は「Low」とコンソールに出力する`,
		blockListXml: `
			<xml id="toolbox">
				<category name="動作">
					<block type="text_print">
						<value name="TEXT">
							<shadow type="text"></shadow>
						</value>
					</block>
								
					<block type="wait_ms">
						<value name="millisecond">
							<shadow type="math_number">
								<field name="NUM">1000</field>
							</shadow>
						</value>
					</block>
					
					<block type="wait_s">
						<value name="second">
							<shadow type="math_number">
								<field name="NUM">1</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="分岐/論理" colour="%{BKY_LOGIC_HUE}">
					<block type="controls_if">
						<value name="IF0">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
					
					<block type="controls_ifelse">
						<value name="IF0">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
					
					<block type="logic_compare">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="logic_operation">
						<value name="A">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
						<value name="B">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
					
					<block type="logic_negate">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ループ" colour="%{BKY_LOOPS_HUE}">
					<block type="controls_repeat_ext">
						<value name="TIMES">
							<shadow type="math_number">
								<field name="NUM">10</field>
							</shadow>
						</value>
					</block>
					
					<block type="controls_whileUntil">
						<value name="BOOL">
							<shadow type="logic_compare">
								<value name="A">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
								<value name="B">
									<shadow type="math_number">
										<field name="NUM">0</field>
									</shadow>
								</value>
							</shadow>
						</value>
					</block>
 		       </category>
 		       
 		       <category name="数学" colour="%{BKY_MATH_HUE}">
					<block type="math_number">
						<field name="NUM">123</field>
					</block>
					
					<block type="math_arithmetic">
						<value name="A">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="B">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE"></category>
				
				
				<category name="グローバル配列">	
					<block type="global_one_dimensional_array_read">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_one_dimensional_array_write">
						<value name="index">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_two_dimensional_array_read">
						<value name="row">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="col">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="global_two_dimensional_array_write">
						<value name="row">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="col">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="value">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
				
				
				<category name="関数">
					<block type="function_definition"></block>
					<block type="function_call">
						<value name="argument1">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument2">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
						<value name="argument3">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="entry_point"></block>
					<block type="get_argument"></block>
				</category>
				
				
				<category name="計測">
					<block type="stopwatch_start">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					
					<block type="stopwatch_stop">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_reset">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
					<block type="stopwatch_read">
						<value name="number">
							<shadow type="math_number">
								<field name="NUM">0</field>
							</shadow>
						</value>
					</block>
				</category>
			</xml>
		`,
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
	missionContents.push ({
		missionTitle: "[サンプルミッション - グローバル配列]",
		missionExplanation: "グローバル配列について学びます。",
		missionID: "sample",
		goal: `グローバル配列 "Array1" の値をすべて0にする`,
		blockListXml: BlockSettings.getAllBlockListXml (),
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

// ミッションスコア
if (missionScores.length === 0) {
	missionScores = missionContents.map ((missionContent) => {
		return {missionID: missionContent.missionID, cleared: false, time: -1, blocks: -1};
	});
}
