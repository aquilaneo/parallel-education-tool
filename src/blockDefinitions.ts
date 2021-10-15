// ========== ブロック形状や動作を定義するファイル ==========

import * as CommandBlockBehaviors from "./commandBlockBehavior";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";
import {assertIsDefined} from "./common";
import {Mission} from "./mission";
import * as Blockly from "blockly";

export class UserProgram {
	stopFlg: boolean = false;
	programSpeed: number = 1;
	mission: Mission;
	entryFunction: Function | null = null; // エントリポイント
	functions: Function[] = []; // 関数一覧
	threads: Thread[] = []; // スレッド一覧
	functionStatementElements: { name: string, element: Element }[] = [];
	globalVariables: NumberVariable[] = [];
	currentMilliSecond: number = 0;
	oldTime: number = 0;
	stopwatches: { key: number, sw: Stopwatch } [] = []; // ストップウォッチ一覧

	constructor (xml: Element, mission: Mission, workspace: Blockly.Workspace | null) {
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
			this.entryFunction = new Function ("スタート", null, entryFunctionXml);
			const entryFunctionBlock = CommandBlockBehaviors.EntryPointBlock.constructBlock (entryFunctionXml, workspace, this, this.entryFunction)[0];
			this.entryFunction.setDefinitionBlock (entryFunctionBlock);
		}
		for (const functionXml of functionsXml) {
			const func = new Function ("", null, functionXml);
			const functionBlock = CommandBlockBehaviors.FunctionDefinitionBlock.constructBlock (functionXml, workspace, this, func)[0];
			func.setDefinitionBlock (functionBlock);
			func.setFunctionName (functionBlock.functionName);
			this.functions.push (func);
			this.functionStatementElements.push ({name: functionBlock.functionName, element: functionXml});
		}

		console.log ("エントリポイント", this.entryFunction);
		console.log ("関数", this.functions);
	}

	async executeBlockList (blockList: CommandBlockBehaviors.CommandBlock[]) {
		for (const block of blockList) {
			if (!this.stopFlg) {
				block.setBlockColorToExecuting (); // 色を変える

				await block.executeBlock ();

				// 各ブロックの待機時間
				const start = new Date ();
				let time = 0;
				const random = block.randomSpeed ? Math.random () * (1.15 - 0.85) + 0.85 : 1;
				const wait = block.wait * (1 / this.programSpeed) * random;
				while (time < wait && !this.stopFlg) {
					await this.sleep1ms ();
					time = new Date ().getTime () - start.getTime ();
				}
				// 動的時間待機を考慮
				while (block.isWaiting () && !this.stopFlg) {
					await this.sleep1ms ();
				}

				block.setBlockColorToBase (); // 色を戻す
			} else {
				return;
			}
		}
	}

	async executeUserProgram () {
		assertIsDefined (this.entryFunction);

		this.oldTime = Date.now ();
		setTimeout (() => {
			this.tick ();
		}, 1);
		await this.entryFunction.executeBlock ();
		this.stopUserProgram ();
	}

	async executeValueBlock (valueBlock: ValueBlockBehaviors.ValueBlock) {
		const result = valueBlock.executeBlock ();

		// 各ブロックの待機時間
		const start = new Date ();
		let time = 0;
		const random = Math.random () * (1.15 - 0.85) + 0.85;
		const wait = valueBlock.wait * (1 / this.programSpeed) * random;
		while (time < wait && !this.stopFlg) {
			await this.sleep1ms ();
			time = new Date ().getTime () - start.getTime ();
		}

		return result;
	}

	sleep1ms () {
		return new Promise (resolve => setTimeout (resolve, 1));
	}

	stopUserProgram () {
		this.stopFlg = true;
	}

	setProgramSpeed (speed: number) {
		this.programSpeed = speed;
	}

	async executeFunction (functionName: string, argument1: number, argument2: number, argument3: number) {
		// 関数名が一致する関数を実行
		const searchedFunction = this.getFunctionByName (functionName);
		if (searchedFunction) {
			searchedFunction.setArguments (argument1, argument2, argument3);
			await searchedFunction.executeBlock ();
		} else {
			this.mission.printError (`"${functionName}" という関数は存在しません！`);
		}
	}

	getFunctionByName (functionName: string) {
		return this.functions.find ((func) => {
			return func.routineName === functionName;
		});
	}

	getFunctionStatementElementByName (functionName: string) {
		return this.functionStatementElements.find ((item) => {
			return item.name === functionName;
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

	addStopwatch (swNumber: number) {
		// 番号が重複していたら上書き、そうでなければ追加
		const searchedIndex = this.stopwatches.findIndex ((sw) => {
			return sw.key === swNumber;
		});

		if (searchedIndex === -1) {
			this.stopwatches.push ({key: swNumber, sw: new Stopwatch (this)});
		} else {
			this.stopwatches[searchedIndex] = {key: swNumber, sw: new Stopwatch (this)};
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

	addThread (routineName: string, threadID: string, functionStatementElement: Element,
			   argument1: number, argument2: number, argument3: number) {
		const thread = new Thread (routineName, threadID, null, this, functionStatementElement, argument1, argument2, argument3);
		const functionInstance = CommandBlockBehaviors.FunctionDefinitionBlock.constructBlock (functionStatementElement, null, this, thread)[0];
		thread.setDefinitionBlock (functionInstance);
		this.threads.push (thread);
	}

	removeThread (threadID: string) {
		this.threads = this.threads.filter ((item) => {
			return item.threadID !== threadID;
		});
	}

	setWorkspaceToThread (threadIndex: number, workspace: Blockly.Workspace) {
		if (this.threads.length > threadIndex) {
			this.threads[threadIndex].setWorkspace (workspace);
		}
	}

	async executeThread (threadID: string) {
		const thread = this.getThread (threadID);
		if (thread) {
			await thread.executeBlock ();
		}
	}

	getThread (threadID: string) {
		return this.threads.find ((thread) => {
			return thread.threadID === threadID;
		});
	}

	getCurrentMilliSecond () {
		return this.currentMilliSecond;
	}

	tick () {
		if (!this.stopFlg) {
			this.currentMilliSecond += (Date.now () - this.oldTime) * this.programSpeed;
			this.oldTime = Date.now ();
			setTimeout (() => {
				this.tick ();
			}, 1);
		}
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
	userProgram: UserProgram;

	constructor (userProgram: UserProgram) {
		this.userProgram = userProgram;
	}

	start () {
		// 開始時間を記録
		this.startTime = this.userProgram.getCurrentMilliSecond ();
	}

	stop () {
		// 経過時間を加算し、開始時間をリセット
		if (this.startTime !== null) {
			this.count += this.userProgram.getCurrentMilliSecond () - this.startTime;
		}
		this.startTime = null;
	}

	read () {
		// SWカウント中だったら停止→読み取り→再開
		if (this.startTime !== null) {
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

export class Routine {
	routineName: string;
	argument1: number = 0;
	argument2: number = 0;
	argument3: number = 0;
	definitionBlock: CommandBlockBehaviors.FunctionDefinitionBlock | CommandBlockBehaviors.EntryPointBlock | null;
	functionStatementElement: Element;
	localNumberVariables: NumberVariable[] = [];
	localStringVariables: StringVariable[] = [];

	constructor (routineName: string, definitionBlock: CommandBlockBehaviors.FunctionDefinitionBlock | CommandBlockBehaviors.EntryPointBlock | null, functionStatementElement: Element) {
		this.routineName = routineName;
		this.definitionBlock = definitionBlock;
		this.functionStatementElement = functionStatementElement;
	}

	async executeBlock () {
		await this.definitionBlock?.executeBlock ();
	}

	setDefinitionBlock (definitionBlock: CommandBlockBehaviors.FunctionDefinitionBlock | CommandBlockBehaviors.EntryPointBlock) {
		this.definitionBlock = definitionBlock;
	}

	setFunctionName (functionName: string) {
		this.routineName = functionName;
	}

	setArguments (argument1: number, argument2: number, argument3: number) {
		this.argument1 = argument1;
		this.argument2 = argument2;
		this.argument3 = argument3;
	}

	getArgument (argumentNumber: number) {
		switch (argumentNumber) {
			case 0:
				return this.argument1;
			case 1:
				return this.argument2;
			case 2:
				return this.argument3;
			default:
				return 0;
		}
	}

	readLocalNumberVariable (variableName: string) {
		return this.getLocalNumberVariable (variableName).readValue ();
	}

	readLocalStringVariable (variableName: string) {
		return this.getLocalStringVariable (variableName).readValue ();
	}

	writeLocalNumberVariable (variableName: string, value: number) {
		this.getLocalNumberVariable (variableName).writeValue (value);
	}

	writeLocalStringVariable (variableName: string, value: string) {
		this.getLocalStringVariable (variableName).writeValue (value);
	}

	getLocalNumberVariable (variableName: string) {
		const searchedVariable = this.localNumberVariables.find ((localVariable) => {
			return localVariable.variableName === variableName;
		});
		// なかったら新しい変数を作る
		if (searchedVariable) {
			return searchedVariable;
		} else {
			return this.addLocalNumberVariable (variableName, 0);
		}
	}

	getLocalStringVariable (variableName: string) {
		const searchedVariable = this.localStringVariables.find ((localVariable) => {
			return localVariable.variableName === variableName;
		});
		// なかったら新しい変数を作る
		if (searchedVariable) {
			return searchedVariable;
		} else {
			return this.addLocalStringVariable (variableName, "");
		}
	}

	addLocalNumberVariable (variableName: string, initValue: number) {
		const newVariable = new NumberVariable (variableName, initValue);
		this.localNumberVariables.push (newVariable);
		return newVariable;
	}

	addLocalStringVariable (variableName: string, initValue: string) {
		const newVariable = new StringVariable (variableName, initValue);
		this.localStringVariables.push (newVariable);
		return newVariable;
	}
}

export class Function extends Routine {
	constructor (routineName: string, definitionBlock: CommandBlockBehaviors.FunctionDefinitionBlock | CommandBlockBehaviors.EntryPointBlock | null, functionStatementElement: Element) {
		super (routineName, definitionBlock, functionStatementElement);
	}
}

export class Thread extends Routine {
	threadID: string;
	userProgram: UserProgram;
	isExecuting: boolean = false;

	constructor (routineName: string, threadID: string, definitionBlock: CommandBlockBehaviors.FunctionDefinitionBlock | null, userProgram: UserProgram, functionStatementElement: Element,
				 argument1: number, argument2: number, argument3: number) {
		super (routineName, definitionBlock, functionStatementElement);
		this.threadID = threadID;
		this.userProgram = userProgram;
		this.argument1 = argument1;
		this.argument2 = argument2;
		this.argument3 = argument3;
	}

	setWorkspace (workspace: Blockly.Workspace) {
		if (this.definitionBlock) {
			this.definitionBlock.setWorkspace (workspace);
		}
	}

	async executeBlock () {
		this.userProgram.mission.addThread (this.threadID, this.functionStatementElement);
		this.isExecuting = true;
		await super.executeBlock ();
		this.isExecuting = false;
		this.userProgram.mission.removeThread (this.threadID);
	}
}

export const commandBlockDefinitions = [
	// ========== print ==========
	{
		type: "text_print",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.PrintBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		}
	},

	// ========== ミリ秒待機 ==========
	{
		type: "wait_ms",
		wait: 0,
		randomSpeed: false,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.MilliSecondsWaitBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: false,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.SecondsWaitBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.IfBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		}
	},

	// ========== if-else ==========
	{
		type: "controls_ifelse",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.IfElseBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		}
	},

	// ========== for ==========
	{
		type: "controls_repeat_ext",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ForBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		}
	},

	// ========== while ==========
	{
		type: "controls_whileUntil",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.WhileBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		}
	},

	// ========== 数値型変数書き込み ==========
	{
		type: "variables_set_number",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.VariablesSetNumber (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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

	// ========== 数値型変数加算 ==========
	{
		type: "variables_add_number",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.VariablesAddNumber (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		},
		blocklyJson: {
			"type": "variables_add_number",
			"message0": "%1 に %2 を加算",
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
			// "colour": 330,
			"tooltip": "数値型変数に値を足します。",
			"helpUrl": ""
		}
	},

	// ========== 文字列型変数書き込み ==========
	{
		type: "variables_set_string",
		wait: 100,
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.VariablesSetString (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalVariableWriteBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalOneDimensionalArrayWrite (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.GlobalTwoDimensionalArrayWrite (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.FunctionDefinitionBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.FunctionCallBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		},
		blocklyJson: {
			"type": "function_call",
			"message0": "実行 %1 %2 引数1 %3 引数2 %4 引数3 %5",
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
					"type": "input_value",
					"name": "argument1",
					"check": "Number"
				},
				{
					"type": "input_value",
					"name": "argument2",
					"check": "Number"
				},
				{
					"type": "input_value",
					"name": "argument3",
					"check": "Number"
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.EntryPointBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchStartBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchStopBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.StopwatchResetBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ThreadCreateBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		},
		blocklyJson: {
			"type": "thread_create",
			"message0": "スレッド作成 %1 スレッド名 %2 引数1 %3 引数2 %4 引数3 %5",
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
				},
				{
					"type": "input_value",
					"name": "argument1",
					"check": "Number"
				},
				{
					"type": "input_value",
					"name": "argument2",
					"check": "Number"
				},
				{
					"type": "input_value",
					"name": "argument3",
					"check": "Number"
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
		randomSpeed: true,
		instantiate: (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: UserProgram, myRoutine: Routine, wait: number, randomSpeed: boolean): CommandBlockBehaviors.CommandBlock => {
			return new CommandBlockBehaviors.ThreadJoinBlock (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.CompareBlock (blockXml, userProgram, myRoutine, wait);
		}
	},

	// ========== 論理演算 ==========
	{
		type: "logic_operation",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.LogicOperationBlock (blockXml, userProgram, myRoutine, wait);
		}
	},

	// ========== 否定 ==========
	{
		type: "logic_negate",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.NotBlock (blockXml, userProgram, myRoutine, wait);
		}
	},

	// ========== 数字 ==========
	{
		type: "math_number",
		wait: 0,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.NumberBlock (blockXml, userProgram, myRoutine, wait);
		}
	},

	// ========== 四則演算 ==========
	{
		type: "math_arithmetic",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.CalculateBlock (blockXml, userProgram, myRoutine, wait);
		}
	},

	// ========== テキスト ==========
	{
		type: "text",
		wait: 0,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.TextBlock (blockXml, userProgram, myRoutine, wait);
		}
	},

	// ========== 文字列計算 ==========
	{
		type: "str_arithmetic",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.TextCalculateBlock (blockXml, userProgram, myRoutine, wait);
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
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.VariablesGetNumber (blockXml, userProgram, myRoutine, wait);
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
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.VariablesGetString (blockXml, userProgram, myRoutine, wait);
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
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.GlobalVariableReadBlock (blockXml, userProgram, myRoutine, wait);
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

	// ========== グローバル1次元配列読み込み ==========
	{
		type: "global_one_dimensional_array_read",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.GlobalOneDimensionalArrayRead (blockXml, userProgram, myRoutine, wait);
		},
		blocklyJson: {
			"type": "global_one_dimensional_array_read",
			"message0": "グローバル配列 %1 %2 %3 番目",
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
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "1次元のグローバル配列の値を読み取ります。",
			"helpUrl": ""
		}
	},

	// ========== グローバル2次元配列読み込み ==========
	{
		type: "global_two_dimensional_array_read",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.GlobalTwoDimensionalArrayRead (blockXml, userProgram, myRoutine, wait);
		},
		blocklyJson: {
			"type": "global_two_dimensional_array_read",
			"message0": "グローバル2次元配列 %1 %2 %3 行 %4 列目",
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
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "1次元のグローバル配列の値を読み取ります。",
			"helpUrl": ""
		}
	},

	// ========== 引数読み取り ==========
	{
		type: "get_argument",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.GetArgumentBlock (blockXml, userProgram, myRoutine, wait);
		},
		blocklyJson: {
			"type": "get_argument",
			"message0": "%1",
			"args0": [
				{
					"type": "field_dropdown",
					"name": "argument",
					"options": [
						[
							"引数1",
							"argument1"
						],
						[
							"引数2",
							"argument2"
						],
						[
							"引数3",
							"argument3"
						]
					]
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "引数を読み取ります。",
			"helpUrl": ""
		}
	},

	// ========== ストップウォッチ読み取り ==========
	{
		type: "stopwatch_read",
		wait: 20,
		instantiate: (blockXml: Element, userProgram: UserProgram, myRoutine: Routine, wait: number): ValueBlockBehaviors.ValueBlock => {
			return new ValueBlockBehaviors.StopwatchReadBlock (blockXml, userProgram, myRoutine, wait);
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
