// ========== ブロック形状や動作を定義するファイル ==========

import * as CommandBlockBehaviors from "./commandBlockBehavior";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";
import {assertIsDefined} from "./common";
import {VariableCanvas} from "./variableCanvas";
import {Mission} from "./mission";

export class UserProgram {
	mission: Mission;
	entryFunction: CommandBlockBehaviors.EntryPointBlock | null = null; // エントリポイント
	functions: CommandBlockBehaviors.FunctionDefinitionBlock[] = []; // 関数一覧
	globalVariables: NumberVariable[] = [];
	stopwatches: { key: number, sw: Stopwatch } [] = []; // ストップウォッチ一覧
	threads: Thread[] = [];

	constructor (xml: Element, mission: Mission) {
		console.log (xml);

		// ミッションを保持
		this.mission = mission;

		// ワークスペース内にあるエントリポイントと全ての関数定義ブロックをリストアップ
		const blocks = xml.getElementsByTagName ("block");
		const entryFunctionXml = Array.from (blocks).find ((block) => {
			return block.getAttribute ("type") === "entry_point";
		});
		const functionsXml = Array.from (blocks).filter ((block) => {
			return block.getAttribute ("type") === "function_definition";
		});

		// エントリポイントと関数ブロックのXMLをパース
		if (entryFunctionXml) {
			this.entryFunction = CommandBlockBehaviors.EntryPointBlock.constructBlock (entryFunctionXml, this)[0];
		}
		this.functions = functionsXml.map ((functionXml) => {
			return CommandBlockBehaviors.FunctionDefinitionBlock.constructBlock (functionXml, this)[0];
		});

		console.log ("エントリポイント", this.entryFunction);
		console.log ("関数", this.functions);
	}

	async executeBlockList (blockList: CommandBlockBehaviors.CommandBlock[]) {
		for (const block of blockList) {
			await block.executeBlock ();
			await sleep (block.wait);

			// 動的時間待機を考慮
			while (block.isWaiting ()) {
				await sleep (1);
			}
		}

		function sleep (ms: number) {
			return new Promise (resolve => setTimeout (resolve, ms));
		}
	}

	async executeEntryFunction () {
		assertIsDefined (this.entryFunction);

		await this.entryFunction.executeBlock ();
	}

	async executeFunction (functionName: string) {
		// 関数名が一致する関数を実行
		const searchedFunction = this.getFunction (functionName);
		if (searchedFunction) {
			await searchedFunction.executeBlock ();
		} else {
			console.error (`関数 ${functionName} が見つかりません！`);
		}
	}

	getFunction (functionName: string) {
		return this.functions.find ((func) => {
			return func.functionName === functionName;
		});
	}

	readGlobalVariable (variableName: string) {
		return this.getGlobalVariable (variableName).readValue ();
	}

	writeGlobalVariable (variableName: string, value: number) {
		this.getGlobalVariable (variableName).writeValue (value);
	}

	getGlobalVariable (variableName: string) {
		const searchedVariable = this.globalVariables.find ((globalVariable) => {
			return globalVariable.variableName === variableName;
		});
		// なかったら新しい変数を作る
		if (searchedVariable) {
			return searchedVariable;
		} else {
			return this.addGlobalVariable (variableName, 0);
		}
	}

	addGlobalVariable (variableName: string, initValue: number) {
		const newVariable = new NumberVariable (variableName, initValue)
		this.globalVariables.push (newVariable);
		return newVariable;
	}

	writeGlobalTwoDimensionalArrays (arrayName: string, row: number, col: number, value: number) {
		this.mission.writeTwoDimensionalArray (arrayName, row, col, value);
	}

	readLocalNumberVariable (functionName: string, variableName: string) {
		// まずはエントリポイントの関数を調べる
		if (functionName === "スタート") {
			if (this.entryFunction) {
				return this.entryFunction.readLocalNumberVariable (variableName);
			}
		}

		// 関数名が一致する関数を探索し変数を読み込み
		const searchedFunction = this.getFunction (functionName);
		if (searchedFunction) {
			return searchedFunction.readLocalNumberVariable (variableName);
		} else {
			console.error (`関数 ${functionName} が見つかりません！`);
			return 0;
		}
	}

	readLocalStringVariable (functionName: string, variableName: string) {
		// まずはエントリポイントの関数を調べる
		if (functionName === "スタート") {
			if (this.entryFunction) {
				return this.entryFunction.readLocalStringVariable (variableName);
			}
		}

		// 関数名が一致する関数を探索し変数を読み込み
		const searchedFunction = this.getFunction (functionName);
		if (searchedFunction) {
			return searchedFunction.readLocalStringVariable (variableName);
		} else {
			console.error (`関数 ${functionName} が見つかりません！`);
			return "";
		}
	}

	writeLocalNumberVariable (functionName: string, variableName: string, value: number) {
		// まずはエントリポイントの関数を調べる
		if (functionName === "スタート") {
			if (this.entryFunction) {
				this.entryFunction.writeLocalNumberVariable (variableName, value);
				return;
			}
		}

		// 関数名が一致する関数を探索し変数を読み込み
		const searchedFunction = this.getFunction (functionName);
		if (searchedFunction) {
			searchedFunction.writeLocalNumberVariable (variableName, value);
		} else {
			console.error (`関数 ${functionName} が見つかりません！`);
		}
	}

	writeLocalStringVariable (functionName: string, variableName: string, value: string) {
		// まずはエントリポイントの関数を調べる
		if (functionName === "スタート") {
			if (this.entryFunction) {
				this.entryFunction.writeLocalStringVariable (variableName, value);
				return;
			}
		}

		// 関数名が一致する関数を探索し変数を読み込み
		const searchedFunction = this.getFunction (functionName);
		if (searchedFunction) {
			searchedFunction.writeLocalStringVariable (variableName, value);
		} else {
			console.error (`関数 ${functionName} が見つかりません！`);
		}
	}

	addStopwatch (swNumber: number) {
		// 番号が重複していたら上書き、そうでなければ追加
		const searchedIndex = this.stopwatches.findIndex ((sw) => {
			return sw.key === swNumber;
		});

		if (searchedIndex === -1) {
			this.stopwatches.push ({key: swNumber, sw: new Stopwatch ()});
		} else {
			this.stopwatches[searchedIndex] = {key: swNumber, sw: new Stopwatch ()};
		}
	}

	getStopwatch (swNumber: number): Stopwatch {
		const searched = this.stopwatches.find ((sw) => {
			return sw.key === swNumber;
		});

		if (searched) {
			return searched.sw;
		} else {
			this.addStopwatch (swNumber);
			return this.getStopwatch (swNumber);
		}
	}

	addThread (threadName: string, threadFunctionName: string) {
		const threadFunction = this.getFunction (threadFunctionName);
		if (threadFunction) {
			this.threads.push (new Thread (threadName, threadFunctionName, this));
		}
	}

	executeThread (threadName: string) {
		const thread = this.getThread (threadName);
		if (thread) {
			thread.execute ();
		}
	}

	getThread (threadName: string) {
		return this.threads.find ((thread) => {
			return thread.threadName === threadName;
		});
	}
}

export class NumberVariable {
	variableName: string;
	value: number;

	constructor (variableName: string, initValue: number) {
		this.variableName = variableName;
		this.value = initValue;
	}

	readValue () {
		return this.value;
	}

	writeValue (value: number) {
		this.value = value;
	}
}

export class StringVariable {
	variableName: string;
	value: string;

	constructor (variableName: string, initValue: string) {
		this.variableName = variableName;
		this.value = initValue;
	}

	readValue () {
		return this.value;
	}

	writeValue (value: string) {
		this.value = value;
	}
}

export class Stopwatch {
	startTime: number | null = null;
	count = 0;

	start () {
		// 開始時間を記録
		this.startTime = Date.now ();
	}

	stop () {
		// 経過時間を加算し、開始時間をリセット
		if (this.startTime) {
			this.count += Date.now () - this.startTime;
		}
		this.startTime = null;
	}

	read () {
		// SWカウント中だったら停止→読み取り→再開
		if (this.startTime) {
			this.stop ();
			const count = this.count;
			this.start ();
			return count;
		} else {
			return this.count;
		}
	}

	reset () {
		// 停止しリセット
		this.stop ();
		this.count = 0;
	}
}

export class Thread {
	threadName: string;
	functionName: string;
	userProgram: UserProgram;
	isExecuting: boolean;

	constructor (threadName: string, functionName: string, userProgram: UserProgram) {
		this.threadName = threadName;
		this.functionName = functionName;
		this.userProgram = userProgram;
		this.isExecuting = false;
	}

	async execute () {
		this.isExecuting = true;
		await this.userProgram.executeFunction (this.functionName);
		this.isExecuting = false;
	}
}

export const commandBlockDefinitions = [
	// ========== print ==========
	{
		type: "text_print",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.PrintBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== ミリ秒待機 ==========
	{
		type: "wait_ms",
		wait: 0,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.MilliSecondsWaitBlock (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "wait_ms",
			"message0": "%1 ミリ秒待機",
			"args0": [
				{
					"type": "input_value",
					"name": "millisecond",
					"check": "Number",
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定したミリ秒数だけ処理を停止します。",
			"helpUrl": ""
		}
	},

	// ========== 秒数待機 ==========
	{
		type: "wait_s",
		wait: 0,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.SecondsWaitBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.IfBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== if-else ==========
	{
		type: "controls_ifelse",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.IfElseBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== for ==========
	{
		type: "controls_repeat_ext",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ForBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== while ==========
	{
		type: "controls_whileUntil",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.WhileBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== 数値型変数書き込み ==========
	{
		type: "variables_set_number",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.VariablesSetNumber (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "variables_set_number",
			"message0": "%{BKY_VARIABLES_SET}",
			"args0": [
				{
					"type": "field_variable",
					"name": "variable",
					"variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
					"variableTypes": ["Number"],
					"defaultType": "Number"
				},
				{
					"type": "input_value",
					"name": "value",
					"check": "Number"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"style": "variable_blocks",
			"tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
			"helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
			"extensions": ["contextMenu_variableSetterGetter"]
		}
	},

	// ========== 文字列型変数書き込み ==========
	{
		type: "variables_set_string",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.VariablesSetString (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "variables_set_string",
			"message0": "%{BKY_VARIABLES_SET}",
			"args0": [
				{
					"type": "field_variable",
					"name": "variable",
					"variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
					"variableTypes": ["String"],
					"defaultType": "String"
				},
				{
					"type": "input_value",
					"name": "value",
					"check": "String"
				}
			],
			"previousStatement": null,
			"nextStatement": null,
			"style": "variable_blocks",
			"tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
			"helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
			"extensions": ["contextMenu_variableSetterGetter"]
		}
	},

	// ========== グローバル変数書き込み ==========
	{
		type: "global_variable_write",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalVariableWriteBlock (blockXml, userProgram, functionName, wait);
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

	// ========== グローバル1次元配列書き込み ==========
	{
		type: "global_one_dimensional_array_write",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalOneDimensionalArrayWrite (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "global_one_dimensional_array_write",
			"message0": "グローバル配列 %1 %2 %3 番目に %4 を書き込み",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "配列名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_value",
					"name": "index",
					"check": "Number"
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
			"tooltip": "1次元のグローバル配列に値を書き込みます。",
			"helpUrl": ""
		}
	},

	// ========== グローバル2次元配列書き込み ==========
	{
		type: "global_two_dimensional_array_write",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalTwoDimensionalArrayWrite (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "global_two_dimensional_array_write",
			"message0": "グローバル2次元配列 %1 %2 %3 行 %4 列目に %5 を書き込み",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "配列名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_value",
					"name": "row",
					"check": "Number"
				},
				{
					"type": "input_value",
					"name": "col",
					"check": "Number"
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
			"tooltip": "2次元のグローバル配列に値を書き込みます。",
			"helpUrl": ""
		}
	},

	// ========== 関数定義 ==========
	{
		type: "function_definition",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.FunctionDefinitionBlock (blockXml, userProgram, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.FunctionCallBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.EntryPointBlock (blockXml, userProgram, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchStartBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchStopBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchResetBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ThreadCreateBlock (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "thread_create",
			"message0": "%1 をスレッド名 %2 として並列実行",
			"args0": [
				{
					"type": "field_input",
					"name": "thread_function_name",
					"text": "関数名"
				},
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
			"tooltip": "指定した名前のスレッドを作成します。",
			"helpUrl": ""
		}
	},

	// ========== スレッド終了待ち ==========
	{
		type: "thread_join",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ThreadJoinBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.CompareBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== 論理演算 ==========
	{
		type: "logic_operation",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.LogicOperationBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== 否定 ==========
	{
		type: "logic_negate",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.NotBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== 数字 ==========
	{
		type: "math_number",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.NumberBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== 四則演算 ==========
	{
		type: "math_arithmetic",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.CalculateBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== テキスト ==========
	{
		type: "text",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.TextBlock (blockXml, userProgram, functionName, wait);
		}
	},

	// ========== 文字列計算 ==========
	{
		type: "str_arithmetic",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.TextCalculateBlock (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "str_arithmetic",
			"message0": "%1 %2 %3",
			"args0": [
				{
					"type": "input_value",
					"name": "A"
				},
				{
					"type": "field_dropdown",
					"name": "OP",
					"options": [
						[
							"+",
							"ADD"
						]
					]
				},
				{
					"type": "input_value",
					"name": "B"
				}
			],
			"inputsInline": true,
			"output": "String",
			"colour": 165,
			"tooltip": "",
			"helpUrl": ""
		}
	},

	// ========== 数値型変数読み込み ==========
	{
		type: "variables_get_number",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.VariablesGetNumber (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "variables_get_number",
			"message0": "%1",
			"args0": [
				{
					"type": "field_variable",
					"name": "variable",
					"variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
					"variableTypes": ["Number"],
					"defaultType": "Number"
				}
			],
			"output": "Number",
			"style": "variable_blocks",
			"helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
			"tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
			"extensions": ["contextMenu_variableSetterGetter"]
		},
	},

	// ========== 文字列型変数読み込み ==========
	{
		type: "variables_get_string",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.VariablesGetString (blockXml, userProgram, functionName, wait);
		},
		blocklyJson: {
			"type": "variables_get_string",
			"message0": "%1",
			"args0": [
				{
					"type": "field_variable",
					"name": "variable",
					"variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
					"variableTypes": ["String"],
					"defaultType": "String"
				}
			],
			"output": "String",
			"style": "variable_blocks",
			"helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
			"tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
			"extensions": ["contextMenu_variableSetterGetter"]
		},
	},

	// ========== グローバル変数読み込み ==========
	{
		type: "global_variable_read",
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.GlobalVariableReadBlock (blockXml, userProgram, functionName, wait);
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
		wait: 100,
		instantiate: (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.StopwatchReadBlock (blockXml, userProgram, functionName, wait);
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
