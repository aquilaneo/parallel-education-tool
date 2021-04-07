// ========== ブロック形状や動作を定義するファイル ==========

export class UserProgram {
	entryFunction: CommandBlock | null = null;
	functions: CommandBlock[] = [];

	constructor (xml: Element) {
		// ワークスペース内にある全ての関数定義ブロックをリストアップ
		let entryFunctionXml: Element | null = null;
		const functionsXml: Element[] = [];
		const blocks = xml.getElementsByTagName ("block");
		for (let i = 0; i < blocks.length; i++) {
			switch (blocks[i].getAttribute ("type")) {
				case "entry_point":
					entryFunctionXml = blocks[i];
					break;
				case "function_definition":
					functionsXml.push (blocks[i]);
					break;
			}
		}

		// 関数ブロックのXMLをパース
		if (entryFunctionXml) {
			this.entryFunction = CommandBlock.constructBlock (entryFunctionXml)[0];
		}
		for (const functionXml of functionsXml) {
			const constructedBlock = CommandBlock.constructBlock (functionXml);
			this.functions.push (constructedBlock[0]);
		}

		console.log ("エントリポイント", this.entryFunction);
		console.log ("関数", this.functions);
	}
}

export class CommandBlock {
	blockType: string;
	id: string;
	wait: number;

	constructor (blockXml: Element, wait: number) {
		// ブロックのxmlからブロックタイプとブロックIDを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";

		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";

		this.wait = wait;
	}

	static constructBlock (blockXml: Element) {
		// nextタグでつながっているブロックを配列化
		const constructedBlocks = [];
		let block = blockXml;
		while (true) {
			// 該当するブロック定義を探し、そのクラスをインスタンス化
			for (const blockDefinition of blockDefinitions) {
				if (blockDefinition.type === block.getAttribute ("type")) {
					constructedBlocks.push (new blockDefinition.definition (block, 0.2));
					break;
				}
			}

			// 次のブロックが存在するか調べる
			let nextExists = false;
			for (let i = 0; i < block.childNodes.length; i++) {
				if (block.childNodes[i].nodeName === "next") {
					nextExists = true;
				}
			}
			if (nextExists) {
				block = block.getElementsByTagName ("next")[0].getElementsByTagName ("block")[0];
			} else {
				break;
			}
		}

		return constructedBlocks;
	}
}

export class ValueBlock {

}

export const blockDefinitions = [
	// ========== print ==========
	{
		type: "text_print",
		definition: class PrintBlock extends CommandBlock {

		}
	},

	// ========== 秒数待機 ==========
	{
		type: "wait_s",
		definition: class SecondsWaitBlock extends CommandBlock {

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
		definition: class IfBlock extends CommandBlock {

		}
	},

	// ========== if-else ==========
	{
		type: "controls_ifelse",
		definition: class IfElseBlock extends CommandBlock {

		}
	},

	// ========== 比較 ==========
	{
		type: "logic_compare",
		definition: class CompareBlock extends CommandBlock {

		}
	},

	// ========== 論理演算 ==========
	{
		type: "logic_operation",
		definition: class LogicOperationBlock extends CommandBlock {

		}
	},

	// ========== 否定 ==========
	{
		type: "logic_negate",
		definition: class NotBlock extends CommandBlock {

		}
	},

	// ========== for ==========
	{
		type: "controls_repeat_ext",
		definition: class ForBlock extends CommandBlock {

		}
	},

	// ========== while ==========
	{
		type: "controls_whileUntil",
		definition: class WhileBlock extends CommandBlock {

		}
	},

	// ========== 数字 ==========
	{
		type: "math_number",
		definition: class NumberBlock extends CommandBlock {

		}
	},

	// ========== テキスト ==========
	{
		type: "text",
		definition: class TextBlock extends CommandBlock {

		}
	},

	// ========== ローカル変数書き込み ==========
	{
		type: "local_variable_write",
		definition: class LocalVariableWriteBlock extends CommandBlock {

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

	// ========== ローカル変数読み込み ==========
	{
		type: "local_variable_read",
		definition: class LocalVariableReadBlock extends CommandBlock {

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

	// ========== グローバル変数書き込み ==========
	{
		type: "global_variable_write",
		definition: class GlobalVariableWriteBlock extends CommandBlock {

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

	// ========== グローバル変数書き込み ==========
	{
		type: "global_variable_read",
		definition: class GlobalVariableWriteBlock extends CommandBlock {

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

	// ========== 関数定義 ==========
	{
		type: "function_definition",
		definition: class FunctionDefinitionBlock extends CommandBlock {
			statement: CommandBlock[];

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const statement = blockXml.getElementsByTagName ("statement");
				if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
					this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0]);
				} else {
					this.statement = [];
				}
			}
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
		definition: class FunctionCallBlock extends CommandBlock {

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
		definition: class EntryPointBlock extends CommandBlock {
			statement: CommandBlock[];

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const statement = blockXml.getElementsByTagName ("statement");
				if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
					this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0]);
				} else {
					this.statement = [];
				}
			}
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
		definition: class StopwatchStartBlock extends CommandBlock {

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
		definition: class StopwatchStopBlock extends CommandBlock {

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
		definition: class StopwatchResetBlock extends CommandBlock {

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

	// ========== ストップウォッチ読み取り ==========
	{
		type: "stopwatch_read",
		definition: class StopwatchReadBlock extends CommandBlock {

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
	},

	// ========== スレッド作成 ==========
	{
		type: "thread_create",
		definition: class ThreadCreateBlock extends CommandBlock {

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
		definition: class ThreadJoinBlock extends CommandBlock {

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
]
