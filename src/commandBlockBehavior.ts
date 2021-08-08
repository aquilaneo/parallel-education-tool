import * as BlockDefinitions from "./blockDefinitions";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";
import {assertIsDefined, assertIsNumber, assertIsString} from "./common";
import {ValueBlock} from "./valueBlockBehaviors";

export class CommandBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	userProgram: BlockDefinitions.UserProgram;
	functionName: string;
	wait: number;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlからブロックIDを取得
		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.userProgram = userProgram;
		this.functionName = functionName;
		this.wait = wait;
	}

	async executeBlock () {
		console.log (this.blockType);
	}

	// 動的時間待機するかどうかのフラグを返す
	isWaiting () {
		return false;
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
	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string) {
		const constructedBlocks = [];
		let block = blockXml;
		while (true) {
			// 該当するブロック定義を探し、そのクラスをインスタンス化
			for (const commandBlockDefinition of BlockDefinitions.commandBlockDefinitions) {
				if (commandBlockDefinition.type === block.getAttribute ("type")) {
					const wait = commandBlockDefinition.wait;
					constructedBlocks.push (commandBlockDefinition.instantiate (block, userProgram, functionName, wait));
					break;
				}
			}

			// 次のブロックが存在するか調べる
			const next = Array.from (block.children).find ((child) => {
				return child.nodeName === "next";
			});
			if (next) {
				block = next.getElementsByTagName ("block")[0];
			} else {
				break;
			}
		}

		return constructedBlocks;
	}
}

export class PrintBlock extends CommandBlock {
	text: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const text = super.getValue ("TEXT");
		this.text = text ? ValueBlockBehaviors.ValueBlock.constructBlock (text, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.text);

		const text = this.text.executeBlock ();
		assertIsString (text);

		console.log (text);
		this.userProgram.mission.print (text);
	}
}

export class SecondsWaitBlock extends CommandBlock {
	second: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const second = super.getValue ("second");
		this.second = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.second);

		const wait = this.second.executeBlock ();
		assertIsNumber (wait);
		this.wait = wait * 1000;
	}
}

export class MilliSecondsWaitBlock extends CommandBlock {
	millisecond: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const second = super.getValue ("millisecond");
		this.millisecond = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.millisecond);

		const wait = this.millisecond.executeBlock ();
		assertIsNumber (wait);
		this.wait = wait;
	}
}

export class IfBlock extends CommandBlock {
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock[];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, functionName) : null;
		const statement = super.getStatement ("DO0");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram, functionName) : [];
	}

	async executeBlock () {
		assertIsDefined (this.condition);

		if (this.condition.executeBlock ()) {
			await this.userProgram.executeBlockList (this.statement);
		}
	}
}

export class IfElseBlock extends CommandBlock {
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement1: CommandBlock[];
	statement2: CommandBlock[];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, functionName) : null;
		const statement1 = super.getStatement ("DO0");
		this.statement1 = statement1 ? CommandBlock.constructBlock (statement1, userProgram, functionName) : [];
		const statement2 = super.getStatement ("ELSE");
		this.statement2 = statement2 ? CommandBlock.constructBlock (statement2, userProgram, functionName) : [];
	}

	async executeBlock () {
		assertIsDefined (this.condition);

		if (this.condition.executeBlock ()) {
			await this.userProgram.executeBlockList (this.statement1);
		} else {
			await this.userProgram.executeBlockList (this.statement2);
		}
	}
}

export class ForBlock extends CommandBlock {
	count: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock [];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const count = super.getValue ("TIMES");
		this.count = count ? ValueBlockBehaviors.ValueBlock.constructBlock (count, userProgram, functionName) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram, functionName) : [];
	}

	async executeBlock () {
		assertIsDefined (this.count);

		const count = this.count.executeBlock ();
		for (let i = 0; i < count; i++) {
			await this.userProgram.executeBlockList (this.statement);
		}
	}
}

export class WhileBlock extends CommandBlock {
	mode: string;
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock[];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const mode = super.getField ("MODE");
		this.mode = mode ? mode : "";
		const condition = super.getValue ("BOOL");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, functionName) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram, functionName) : [];
	}

	async executeBlock () {
		assertIsDefined (this.condition);

		switch (this.mode) {
			case "WHILE":
				while (this.condition.executeBlock ()) {
					await this.userProgram.executeBlockList (this.statement);
				}
				break;
			case "UNTIL":
				while (!this.condition.executeBlock ()) {
					await this.userProgram.executeBlockList (this.statement);
				}
				break;
		}
	}
}

export class VariablesSetNumber extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsNumber (value);
		this.userProgram.writeLocalNumberVariable (this.functionName, this.variable, value);
	}
}

export class VariablesAddNumber extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsNumber (value);
		const result = this.userProgram.readLocalNumberVariable (this.functionName, this.variable) + value;
		this.userProgram.writeLocalNumberVariable (this.functionName, this.variable, result);
	}
}

export class VariablesSetString extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsString (value);
		this.userProgram.writeLocalStringVariable (this.functionName, this.variable, value);
	}
}

export class GlobalVariableWriteBlock extends CommandBlock {
	name: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsNumber (value);
		this.userProgram.writeGlobalVariable (this.name, value);
	}
}

export class GlobalOneDimensionalArrayWrite extends CommandBlock {
	name: string;
	index: ValueBlockBehaviors.ValueBlock | null;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blocklyXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blocklyXml, userProgram, functionName, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const index = super.getValue ("index");
		this.index = index ? ValueBlockBehaviors.ValueBlock.constructBlock (index, userProgram, functionName) : null;
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.index);
		assertIsDefined (this.value);

		const index = this.index.executeBlock ();
		const value = this.value.executeBlock ();
	}
}

export class GlobalTwoDimensionalArrayWrite extends CommandBlock {
	name: string;
	row: ValueBlockBehaviors.ValueBlock | null;
	col: ValueBlockBehaviors.ValueBlock | null;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blocklyXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blocklyXml, userProgram, functionName, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const row = super.getValue ("row");
		this.row = row ? ValueBlockBehaviors.ValueBlock.constructBlock (row, userProgram, functionName) : null;
		const col = super.getValue ("col");
		this.col = col ? ValueBlockBehaviors.ValueBlock.constructBlock (col, userProgram, functionName) : null;
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.row);
		assertIsDefined (this.col);
		assertIsDefined (this.value);

		const row = this.row.executeBlock ();
		const col = this.col.executeBlock ();
		const value = this.value.executeBlock ();
		assertIsNumber (row);
		assertIsNumber (col);
		assertIsNumber (value);

		this.userProgram.mission.writeTwoDimensionalArray(this.name, row, col, value);
	}
}

export class FunctionDefinitionBlock extends CommandBlock {
	statement: CommandBlock[];
	localNumberVariables: BlockDefinitions.NumberVariable[] = [];
	localStringVariables: BlockDefinitions.StringVariable[] = [];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, wait: number) {
		super (blockXml, userProgram, "", wait);

		const functionName = super.getField ("name");
		this.functionName = functionName ? functionName : "";
		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], userProgram, this.functionName);
		} else {
			this.statement = [];
		}
	}

	async executeBlock () {
		assertIsDefined (this.statement);

		await this.userProgram.executeBlockList (this.statement);
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
		const newVariable = new BlockDefinitions.NumberVariable (variableName, initValue);
		this.localNumberVariables.push (newVariable);
		return newVariable;
	}

	addLocalStringVariable (variableName: string, initValue: string) {
		const newVariable = new BlockDefinitions.StringVariable (variableName, initValue);
		this.localStringVariables.push (newVariable);
		return newVariable;
	}

	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram) {
		const blockType = "function_definition";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = BlockDefinitions.commandBlockDefinitions.find ((definition) => {
				return definition.type === blockType
			});

			if (functionBlockDefinition) {
				return [new FunctionDefinitionBlock (blockXml, userProgram, functionBlockDefinition.wait)];
			}
		}
		return [];
	}
}

export class FunctionCallBlock extends CommandBlock {
	name: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
	}

	async executeBlock () {
		await this.userProgram.executeFunction (this.name);
	}
}

export class EntryPointBlock extends CommandBlock {
	statement: CommandBlock[];
	localNumberVariables: BlockDefinitions.NumberVariable[] = [];
	localStringVariables: BlockDefinitions.StringVariable[] = [];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, wait: number) {
		super (blockXml, userProgram, "スタート", wait);

		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], userProgram, "スタート");
		} else {
			this.statement = [];
		}

		this.localNumberVariables = [];
	}

	async executeBlock () {
		assertIsDefined (this.statement);

		await this.userProgram.executeBlockList (this.statement);
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
		const newVariable = new BlockDefinitions.NumberVariable (variableName, initValue);
		this.localNumberVariables.push (newVariable);
		return newVariable;
	}

	addLocalStringVariable (variableName: string, initValue: string) {
		const newVariable = new BlockDefinitions.StringVariable (variableName, initValue);
		this.localStringVariables.push (newVariable);
		return newVariable;
	}

	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram) {
		const blockType = "entry_point";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = BlockDefinitions.commandBlockDefinitions.find ((definition) => {
				return definition.type === blockType
			});

			if (functionBlockDefinition) {
				return [new EntryPointBlock (blockXml, userProgram, functionBlockDefinition.wait)];
			}
		}
		return [];
	}
}

export class StopwatchStartBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = this.swNumber.executeBlock ();
		assertIsNumber (swNumber);
		this.userProgram.getStopwatch (swNumber).start ();
	}
}

export class StopwatchStopBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = this.swNumber.executeBlock ();
		assertIsNumber (swNumber);
		this.userProgram.getStopwatch (swNumber).stop ();
	}
}

export class StopwatchResetBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = this.swNumber.executeBlock ();
		assertIsNumber (swNumber);
		this.userProgram.getStopwatch (swNumber).reset ();
	}
}

export class ThreadCreateBlock extends CommandBlock {
	threadFunctionName: string;
	threadName: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const threadFunctionName = super.getField ("thread_function_name");
		this.threadFunctionName = threadFunctionName ? threadFunctionName : "";
		const threadName = super.getValue ("thread_name");
		this.threadName = threadName ? ValueBlockBehaviors.ValueBlock.constructBlock (threadName, userProgram, functionName) : null;
	}

	async executeBlock () {
		assertIsDefined (this.threadName);

		const threadName = this.threadName.executeBlock ();
		assertIsString (threadName);

		this.userProgram.addThread (threadName, this.threadFunctionName);
		this.userProgram.executeThread (threadName);
	}
}

export class ThreadJoinBlock extends CommandBlock {
	threadName: ValueBlockBehaviors.ValueBlock | null;
	threadNameStr: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);

		const threadName = super.getValue ("thread_name");
		this.threadName = threadName ? ValueBlockBehaviors.ValueBlock.constructBlock (threadName, userProgram, functionName) : null;
		this.threadNameStr = "";
	}

	async executeBlock () {
		assertIsDefined (this.threadName);

		const threadName = this.threadName.executeBlock ();
		assertIsString (threadName);
		this.threadNameStr = threadName;
	}

	isWaiting (): boolean {
		const thread = this.userProgram.getThread (this.threadNameStr);
		if (thread) {
			return thread.isExecuting;
		} else {
			return false;
		}
	}
}
