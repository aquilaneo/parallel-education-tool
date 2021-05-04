// ========== ブロック形状や動作を定義するファイル ==========

import * as CommandBlockBehaviors from "./commandBlockBehavior";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";

export class UserProgram {
	entryFunction: CommandBlockBehaviors.EntryPointBlock | null = null; // エントリポイント
	functions: CommandBlockBehaviors.FunctionDefinitionBlock[] = []; // 関数一覧

	constructor (xml: Element) {
		console.log (xml);

		// ワークスペース内にあるエントリポイントと全ての関数定義ブロックをリストアップ
		const blocks = xml.getElementsByTagName ("block");
		const entryFunctionXml = Array.from (blocks).find ((block) => {
			return block.getAttribute ("type") === "entry_point";
		})
		const functionsXml = Array.from (blocks).filter ((block) => {
			return block.getAttribute ("type") === "function_definition";
		});

		// エントリポイントと関数ブロックのXMLをパース
		if (entryFunctionXml) {
			this.entryFunction = CommandBlockBehaviors.EntryPointBlock.constructBlock (entryFunctionXml)[0];
		}
		this.functions = functionsXml.map ((functionXml) => {
			return CommandBlockBehaviors.FunctionDefinitionBlock.constructBlock (functionXml)[0];
		});

		console.log ("エントリポイント", this.entryFunction);
		console.log ("関数", this.functions);
	}

	executeEntryFunction () {
		if (this.entryFunction) {
			this.entryFunction.executeBlock ();
		} else {
			console.error ("entryFunctionがnullです！");
		}
	}

	executeFunction (functionName: string) {
		if (this.functions) {
			// 関数名が一致する関数を全て探索し実行
			const searchedFunctions = this.functions.filter ((func) => {
				return func.functionName === functionName;
			})
			for (const searchedFunction of searchedFunctions) {
				searchedFunction.executeBlock ();
			}
		} else {
			console.error ("functionsがnullです！")
		}
	}
}

export const commandBlockDefinitions = [
	// ========== print ==========
	{
		type: "text_print",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.PrintBlock (blockXml, wait);
		}
	},

	// ========== 秒数待機 ==========
	{
		type: "wait_s",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.SecondsWaitBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "wait_s",
			"message0": "%1 秒待機",
			"args0": [
				{
					"type": "input_value",
					"name": "second",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した秒数だけ処理を停止します。",
			"helpUrl": ""
		}
	},

	// ========== if ==========
	{
		type: "controls_if",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.IfBlock (blockXml, wait);
		}
	},

	// ========== if-else ==========
	{
		type: "controls_ifelse",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.IfElseBlock (blockXml, wait);
		}
	},

	// ========== for ==========
	{
		type: "controls_repeat_ext",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ForBlock (blockXml, wait);
		}
	},

	// ========== while ==========
	{
		type: "controls_whileUntil",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.WhileBlock (blockXml, wait);
		}
	},

	// ========== ローカル変数書き込み ==========
	{
		type: "local_variable_write",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.LocalVariableWriteBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "local_variable_write",
			"message0": "ローカル変数 %1 %2 に %3 を書き込み",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_value",
					"name": "value",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "ローカル変数に値を書き込みます。",
			"helpUrl": ""
		}
	},

	// ========== グローバル変数書き込み ==========
	{
		type: "global_variable_write",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalVariableWriteBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "global_variable_write",
			"message0": "グローバル変数 %1 %2 に %3 を書き込み",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_value",
					"name": "value",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "グローバル変数に値を書き込みます。",
			"helpUrl": ""
		}
	},

	// ========== 関数定義 ==========
	{
		type: "function_definition",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.FunctionDefinitionBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "function_definition",
			"message0": "関数 %1 %2 %3",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "関数名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_statement",
					"name": "routine"
				}
			],
			"inputsInline": false,
			"colour": 230,
			"tooltip": "関数を定義します。",
			"helpUrl": ""
		}
	},

	// ========== 関数実行 ==========
	{
		type: "function_call",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.FunctionCallBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "function_call",
			"message0": "関数実行 %1",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "関数名"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "定義した関数を実行します。",
			"helpUrl": ""
		}
	},

	// ========== スタート関数 ==========
	{
		type: "entry_point",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.EntryPointBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "entry_point",
			"message0": "関数 スタート %1 %2",
			"args0": [
				{
					"type": "input_dummy"
				},
				{
					"type": "input_statement",
					"name": "routine"
				}
			],
			"inputsInline": false,
			"colour": 230,
			"tooltip": "プログラムが最初に始まる関数です。",
			"helpUrl": ""
		}
	},

	// ========== ストップウォッチ開始 ==========
	{
		type: "stopwatch_start",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchStartBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "stopwatch_start",
			"message0": "ストップウォッチ %1 番スタート",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチをスタートさせます。",
			"helpUrl": ""
		}
	},

	// ========== ストップウォッチ停止 ==========
	{
		type: "stopwatch_stop",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchStopBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "stopwatch_stop",
			"message0": "ストップウォッチ %1 番ストップ",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチを停止します。",
			"helpUrl": ""
		}
	},

	// ========== ストップウォッチリセット ==========
	{
		type: "stopwatch_reset",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchResetBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "stopwatch_reset",
			"message0": "ストップウォッチ %1 番リセット",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチをリセットします。",
			"helpUrl": ""
		}
	},

	// ========== スレッド作成 ==========
	{
		type: "thread_create",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ThreadCreateBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "thread_create",
			"message0": "スレッド名 %1 関数名 %2 を実行",
			"args0": [
				{
					"type": "input_value",
					"name": "thread_name",
					"check": "String"
				},
				{
					"type": "input_value",
					"name": "thread_function_name",
					"check": "String"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した名前のスレッドを作成します。",
			"helpUrl": ""
		}
	},

	// ========== スレッド終了待ち ==========
	{
		type: "thread_join",
		instantiate: (blockXml: Element, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ThreadJoinBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "thread_join",
			"message0": "スレッド名 %1 を終了待ち",
			"args0": [
				{
					"type": "input_value",
					"name": "thread_name",
					"check": "String"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した名前のスレッドの終了を待ちます。",
			"helpUrl": ""
		}
	}
];

export const valueBlockDefinitions = [
	// ========== 比較 ==========
	{
		type: "logic_compare",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.CompareBlock (blockXml, wait);
		}
	},

	// ========== 論理演算 ==========
	{
		type: "logic_operation",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.LogicOperationBlock (blockXml, wait);
		}
	},

	// ========== 否定 ==========
	{
		type: "logic_negate",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.NotBlock (blockXml, wait);
		}
	},

	// ========== 数字 ==========
	{
		type: "math_number",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.NumberBlock (blockXml, wait);
		}
	},

	// ========== 四則演算 ==========
	{
		type: "math_arithmetic",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.CalculateBlock (blockXml, wait);
		}
	},

	// ========== テキスト ==========
	{
		type: "text",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.TextBlock (blockXml, wait);
		}
	},

	// ========== ローカル変数読み込み ==========
	{
		type: "local_variable_read",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.LocalVariableReadBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "local_variable_read",
			"message0": "ローカル変数 %1",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "ローカル変数の値を読み込みます。",
			"helpUrl": ""
		}
	},

	// ========== グローバル変数読み込み ==========
	{
		type: "global_variable_read",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.GlobalVariableReadBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "global_variable_read",
			"message0": "グローバル変数 %1",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "グローバル変数の値を読み込みます。",
			"helpUrl": ""
		}
	},

	// ========== ストップウォッチ読み取り ==========
	{
		type: "stopwatch_read",
		instantiate: (blockXml: Element, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.StopwatchReadBlock (blockXml, wait);
		},
		blocklyJson: {
			"type": "stopwatch_read",
			"message0": "ストップウォッチ %1 番読み取り",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチの値(秒)を読み取ります。",
			"helpUrl": ""
		}
	}
];
