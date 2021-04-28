// ========== ブロック形状や動作を定義するファイル ==========

export class UserProgram {
	entryFunction: CommandBlock | null = null; // エントリポイント
	functions: CommandBlock[] = []; // 関数一覧

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
			this.entryFunction = CommandBlock.constructBlock (entryFunctionXml)[0];
		}
		this.functions = functionsXml.map ((functionXml) => {
			return CommandBlock.constructBlock (functionXml)[0];
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
		}
	}
}

export class CommandBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	wait: number;

	constructor (blockXml: Element, wait: number) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlからブロックIDを取得
		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.wait = wait;
	}

	executeBlock () {
		console.log (this.blockType);
	}

	// 指定した名前のパラメータ(value or shadow)を取得
	getValue (type: string) {
		// typeに合致するタグを探す
		const value = Array.from (this.blockXml.children).find ((child) => {
			return child.getAttribute ("name") === type;
		});
		if (value) {
			// blockタグを探す
			const block = Array.from (value.children).find ((child) => {
				return child.tagName === "block";
			});
			return block ? block : value.children[0]; // blockがあったらそれを、なかったらshadowタグを返す
		}
	}

	// 指定した名前の値(field)を取得
	getField (type: string) {
		const field = Array.from (this.blockXml.children).find ((child) => {
			return child.tagName === "field" && child.getAttribute ("name") === type;
		});
		return field ? field.textContent : null;
	}

	// 指定した名前のステートメント(statement)を取得
	getStatement (type: string) {
		const statement = Array.from (this.blockXml.children).find ((child) => {
			return child.tagName === "statement" && child.getAttribute ("name") === type;
		});
		return statement ? statement.children[0] : null;
	}

	// nextタグでつながっているコマンドブロックをオブジェクト化し配列化
	static constructBlock (blockXml: Element) {
		const constructedBlocks = [];
		let block = blockXml;
		while (true) {
			// 該当するブロック定義を探し、そのクラスをインスタンス化
			for (const commandBlockDefinition of commandBlockDefinitions) {
				if (commandBlockDefinition.type === block.getAttribute ("type")) {
					constructedBlocks.push (new commandBlockDefinition.definition (block, 0.2));
					break;
				}
			}

			// 次のブロックが存在するか調べる
			if (Array.from (block.childNodes).find ((child) => {
				return child.nodeName === "next";
			})) {
				block = block.getElementsByTagName ("next")[0].getElementsByTagName ("block")[0];
			} else {
				break;
			}
		}

		return constructedBlocks;
	}
}

export class ValueBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	wait: number;

	constructor (blockXml: Element, wait: number) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlからブロックIDを取得
		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.wait = wait;
	}

	executeBlock () {

	}

	// 指定した名前のパラメータ(block or shadow)を取得
	getValue (type: string) {
		// typeに合致するタグを探す
		const value = Array.from (this.blockXml.children).find ((child) => {
			return child.getAttribute ("name") === type;
		});
		if (value) {
			// blockタグを探す
			const block = Array.from (value.children).find ((child) => {
				return child.tagName === "block";
			});
			return block ? block : value.children[0]; // blockがあったらそれを、なかったらshadowタグを返す
		}
	}

	// 指定した名前の値(field)を取得
	getField (type: string) {
		const field = Array.from (this.blockXml.children).find ((child) => {
			return child.tagName === "field" && child.getAttribute ("name") === type;
		});

		return field ? field.textContent : null;
	}

	// 与えられた値ブロックをオブジェクトに変換
	static constructBlock (blockXml: Element): ValueBlock | null {
		const definition = valueBlockDefinitions.find ((valueBlockDefinition) => {
			return valueBlockDefinition.type === blockXml.getAttribute ("type");
		})
		return definition ? new definition.definition (blockXml, 0.2) : null;
	}
}

export const commandBlockDefinitions = [
	// ========== print ==========
	{
		type: "text_print",
		definition: class PrintBlock extends CommandBlock {
			text: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const text = super.getValue ("TEXT");
				this.text = text ? ValueBlock.constructBlock (text) : null;
			}
		}
	},

	// ========== 秒数待機 ==========
	{
		type: "wait_s",
		definition: class SecondsWaitBlock extends CommandBlock {
			second: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const second = super.getValue ("second");
				this.second = second ? ValueBlock.constructBlock (second) : null;
			}
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
			condition: ValueBlock | null;
			statement: CommandBlock[];

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const condition = super.getValue ("IF0");
				this.condition = condition ? ValueBlock.constructBlock (condition) : null;
				const statement = super.getStatement ("DO0");
				this.statement = statement ? CommandBlock.constructBlock (statement) : [];
			}
		}
	},

	// ========== if-else ==========
	{
		type: "controls_ifelse",
		definition: class IfElseBlock extends CommandBlock {
			condition: ValueBlock | null;
			statement1: CommandBlock[];
			statement2: CommandBlock[];

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const condition = super.getValue ("IF0");
				this.condition = condition ? ValueBlock.constructBlock (condition) : null;
				const statement1 = super.getStatement ("DO0");
				this.statement1 = statement1 ? CommandBlock.constructBlock (statement1) : [];
				const statement2 = super.getStatement ("ELSE");
				this.statement2 = statement2 ? CommandBlock.constructBlock (statement2) : [];
			}
		}
	},

	// ========== for ==========
	{
		type: "controls_repeat_ext",
		definition: class ForBlock extends CommandBlock {
			count: ValueBlock | null;
			statement: CommandBlock [];

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const count = super.getValue ("TIMES");
				this.count = count ? ValueBlock.constructBlock (count) : null;
				const statement = super.getStatement ("DO");
				this.statement = statement ? CommandBlock.constructBlock (statement) : [];
			}
		}
	},

	// ========== while ==========
	{
		type: "controls_whileUntil",
		definition: class WhileBlock extends CommandBlock {
			mode: string | null;
			condition: ValueBlock | null;
			statement: CommandBlock[];

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const mode = super.getField ("MODE");
				this.mode = mode ? mode : null;
				const condition = super.getValue ("BOOL");
				this.condition = condition ? ValueBlock.constructBlock (condition) : null;
				const statement = super.getStatement ("DO");
				this.statement = statement ? CommandBlock.constructBlock (statement) : [];
			}
		}
	},

	// ========== ローカル変数書き込み ==========
	{
		type: "local_variable_write",
		definition: class LocalVariableWriteBlock extends CommandBlock {
			name: string | null;
			value: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const name = super.getField ("name");
				this.name = name ? name : null;
				const value = super.getValue ("value");
				this.value = value ? ValueBlock.constructBlock (value) : null;
			}
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
		definition: class GlobalVariableWriteBlock extends CommandBlock {
			name: string | null;
			value: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const name = super.getField ("name");
				this.name = name ? name : null;
				const value = super.getValue ("value");
				this.value = value ? ValueBlock.constructBlock (value) : null;
			}
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
		definition: class FunctionDefinitionBlock extends CommandBlock {
			statement: CommandBlock[];
			functionName: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const functionName = super.getField ("name");
				this.functionName = functionName ? functionName : null;
				const statement = blockXml.getElementsByTagName ("statement");
				if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
					this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0]);
				} else {
					this.statement = [];
				}
			}

			executeBlock () {
				super.executeBlock ();
				if (this.statement) {
					for (const block of this.statement) {
						block.executeBlock ();
					}
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
			name: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const name = super.getField ("name");
				this.name = name ? name : null;
			}
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

			executeBlock () {
				super.executeBlock ();
				if (this.statement) {
					for (const block of this.statement) {
						block.executeBlock ();
					}
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
			swNumber: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const swNumber = super.getValue ("number");
				this.swNumber = swNumber ? ValueBlock.constructBlock (swNumber) : null;
			}
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
			swNumber: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const swNumber = super.getValue ("number");
				this.swNumber = swNumber ? ValueBlock.constructBlock (swNumber) : null;
			}
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
			swNumber: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const swNumber = super.getValue ("number");
				this.swNumber = swNumber ? ValueBlock.constructBlock (swNumber) : null;
			}
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
		definition: class ThreadCreateBlock extends CommandBlock {
			threadName: ValueBlock | null;
			functionName: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const threadName = super.getValue ("thread_name");
				this.threadName = threadName ? ValueBlock.constructBlock (threadName) : null;
				const functionName = super.getValue ("thread_function_name");
				this.functionName = functionName ? ValueBlock.constructBlock (functionName) : null;
			}
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
			threadName: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);

				const threadName = super.getValue ("thread_name");
				this.threadName = threadName ? ValueBlock.constructBlock (threadName) : null;
			}
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
		definition: class CompareBlock extends ValueBlock {
			operand1: ValueBlock | null;
			operand2: ValueBlock | null;
			operator: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const operand1 = super.getValue ("A");
				this.operand1 = operand1 ? ValueBlock.constructBlock (operand1) : null;
				const operand2 = super.getValue ("B");
				this.operand2 = operand2 ? ValueBlock.constructBlock (operand2) : null;
				const operator = super.getField ("OP");
				this.operator = operator ? operator : null;
			}
		}
	},

	// ========== 論理演算 ==========
	{
		type: "logic_operation",
		definition: class LogicOperationBlock extends ValueBlock {
			operand1: ValueBlock | null;
			operand2: ValueBlock | null;
			operator: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const operand1 = super.getValue ("A");
				this.operand1 = operand1 ? ValueBlock.constructBlock (operand1) : null;
				const operand2 = super.getValue ("B");
				this.operand2 = operand2 ? ValueBlock.constructBlock (operand2) : null;
				const operator = super.getField ("OP");
				this.operator = operator ? operator : null;
			}
		}
	},

	// ========== 否定 ==========
	{
		type: "logic_negate",
		definition: class NotBlock extends ValueBlock {
			value: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const value = super.getValue ("BOOL");
				this.value = value ? ValueBlock.constructBlock (value) : null;
			}
		}
	},

	// ========== 数字 ==========
	{
		type: "math_number",
		definition: class NumberBlock extends ValueBlock {
			num: number | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const num = super.getField ("NUM");
				this.num = num ? Number (num) : null;
			}
		}
	},

	// ========== 四則演算 ==========
	{
		type: "math_arithmetic",
		definition: class CalculateBlock extends ValueBlock {
			operand1: ValueBlock | null;
			operand2: ValueBlock | null;
			operator: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const operand1 = super.getValue ("A");
				this.operand1 = operand1 ? ValueBlock.constructBlock (operand1) : null;
				const operand2 = super.getValue ("B");
				this.operand2 = operand2 ? ValueBlock.constructBlock (operand2) : null;
				const operator = super.getField ("OP");
				this.operator = operator ? operator : null;
			}
		}
	},

	// ========== テキスト ==========
	{
		type: "text",
		definition: class TextBlock extends ValueBlock {
			text: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const text = super.getField ("TEXT");
				this.text = text != null ? text : null;
			}
		}
	},

	// ========== ローカル変数読み込み ==========
	{
		type: "local_variable_read",
		definition: class LocalVariableReadBlock extends ValueBlock {
			name: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const name = super.getField ("name");
				this.name = name ? name : null;
			}
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
		type: "global_variable_read",
		definition: class GlobalVariableWriteBlock extends ValueBlock {
			name: string | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const name = super.getField ("name");
				this.name = name ? name : null;
			}
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
		definition: class StopwatchReadBlock extends ValueBlock {
			swNumber: ValueBlock | null;

			constructor (blockXml: Element, wait: number) {
				super (blockXml, wait);
				const threadNumber = super.getValue ("number");
				this.swNumber = threadNumber ? ValueBlock.constructBlock (threadNumber) : null;
			}
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
