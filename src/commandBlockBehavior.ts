import * as BlockDefinitions from "./blockDefinitions";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";
import {assertIsDefined, assertIsNumber, assertIsString} from "./common";

export class CommandBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	userProgram: BlockDefinitions.UserProgram;
	myRoutine: BlockDefinitions.Routine;
	wait: number;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlからブロックIDを取得
		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.userProgram = userProgram;
		this.myRoutine = myRoutine;
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
	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine) {
		const constructedBlocks = [];
		let block = blockXml;
		while (true) {
			// 該当するブロック定義を探し、そのクラスをインスタンス化
			for (const commandBlockDefinition of BlockDefinitions.commandBlockDefinitions) {
				if (commandBlockDefinition.type === block.getAttribute ("type")) {
					const wait = commandBlockDefinition.wait;
					constructedBlocks.push (commandBlockDefinition.instantiate (block, userProgram, myRoutine, wait));
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const text = super.getValue ("TEXT");
		this.text = text ? ValueBlockBehaviors.ValueBlock.constructBlock (text, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.text);

		const text = this.text.executeBlock ();
		this.userProgram.mission.print (text.toString ());
	}
}

export class SecondsWaitBlock extends CommandBlock {
	second: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const second = super.getValue ("second");
		this.second = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second, userProgram, myRoutine) : null;
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const second = super.getValue ("millisecond");
		this.millisecond = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second, userProgram, myRoutine) : null;
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, myRoutine) : null;
		const statement = super.getStatement ("DO0");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram, myRoutine) : [];
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, myRoutine) : null;
		const statement1 = super.getStatement ("DO0");
		this.statement1 = statement1 ? CommandBlock.constructBlock (statement1, userProgram, myRoutine) : [];
		const statement2 = super.getStatement ("ELSE");
		this.statement2 = statement2 ? CommandBlock.constructBlock (statement2, userProgram, myRoutine) : [];
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const count = super.getValue ("TIMES");
		this.count = count ? ValueBlockBehaviors.ValueBlock.constructBlock (count, userProgram, myRoutine) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram, myRoutine) : [];
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const mode = super.getField ("MODE");
		this.mode = mode ? mode : "";
		const condition = super.getValue ("BOOL");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, myRoutine) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram, myRoutine) : [];
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsNumber (value);
		this.myRoutine?.writeLocalNumberVariable (this.variable, value);
	}
}

export class VariablesAddNumber extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsNumber (value);
		const operand = this.myRoutine?.readLocalNumberVariable (this.variable);
		this.myRoutine?.writeLocalNumberVariable (this.variable, operand + 1);
	}
}

export class VariablesSetString extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsString (value);
		this.myRoutine?.writeLocalStringVariable (this.variable, value);
	}
}

export class GlobalVariableWriteBlock extends CommandBlock {
	name: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
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

	constructor (blocklyXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blocklyXml, userProgram, myRoutine, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const index = super.getValue ("index");
		this.index = index ? ValueBlockBehaviors.ValueBlock.constructBlock (index, userProgram, myRoutine) : null;
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
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

	constructor (blocklyXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blocklyXml, userProgram, myRoutine, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const row = super.getValue ("row");
		this.row = row ? ValueBlockBehaviors.ValueBlock.constructBlock (row, userProgram, myRoutine) : null;
		const col = super.getValue ("col");
		this.col = col ? ValueBlockBehaviors.ValueBlock.constructBlock (col, userProgram, myRoutine) : null;
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
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

		this.userProgram.mission.writeTwoDimensionalArray (this.name, row, col, value);
	}
}

export class FunctionDefinitionBlock extends CommandBlock {
	functionName: string;
	statement: CommandBlock[];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const functionName = super.getField ("name");
		this.functionName = functionName ? functionName : "";
		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], userProgram, myRoutine);
		} else {
			this.statement = [];
		}
	}

	async executeBlock () {
		assertIsDefined (this.statement);

		await this.userProgram.executeBlockList (this.statement);
	}

	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine) {
		const blockType = "function_definition";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = BlockDefinitions.commandBlockDefinitions.find ((definition) => {
				return definition.type === blockType
			});

			if (functionBlockDefinition) {
				return [new FunctionDefinitionBlock (blockXml, userProgram, myRoutine, functionBlockDefinition.wait)];
			}
		}
		return [];
	}
}

export class FunctionCallBlock extends CommandBlock {
	name: string;
	argument1: ValueBlockBehaviors.ValueBlock | null;
	argument2: ValueBlockBehaviors.ValueBlock | null;
	argument3: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";

		const argument1 = super.getValue ("argument1");
		this.argument1 = argument1 ? ValueBlockBehaviors.ValueBlock.constructBlock (argument1, userProgram, myRoutine) : null;
		const argument2 = super.getValue ("argument2");
		this.argument2 = argument2 ? ValueBlockBehaviors.ValueBlock.constructBlock (argument2, userProgram, myRoutine) : null;
		const argument3 = super.getValue ("argument3");
		this.argument3 = argument3 ? ValueBlockBehaviors.ValueBlock.constructBlock (argument3, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.argument1);
		assertIsDefined (this.argument2);
		assertIsDefined (this.argument3);
		const argument1 = this.argument1.executeBlock ();
		const argument2 = this.argument2.executeBlock ();
		const argument3 = this.argument3.executeBlock ();
		assertIsNumber (argument1);
		assertIsNumber (argument2);
		assertIsNumber (argument3);

		await this.userProgram.executeFunction (this.name, argument1, argument2, argument3);
	}
}

export class EntryPointBlock extends CommandBlock {
	statement: CommandBlock[];
	localNumberVariables: BlockDefinitions.NumberVariable[] = [];
	localStringVariables: BlockDefinitions.StringVariable[] = [];

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], userProgram, myRoutine);
		} else {
			this.statement = [];
		}

		this.localNumberVariables = [];
	}

	async executeBlock () {
		assertIsDefined (this.statement);

		await this.userProgram.executeBlockList (this.statement);
	}

	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine) {
		const blockType = "entry_point";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = BlockDefinitions.commandBlockDefinitions.find ((definition) => {
				return definition.type === blockType
			});

			if (functionBlockDefinition) {
				return [new EntryPointBlock (blockXml, userProgram, myRoutine, functionBlockDefinition.wait)];
			}
		}
		return [];
	}
}

export class StopwatchStartBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, myRoutine) : null;
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, myRoutine) : null;
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = this.swNumber.executeBlock ();
		assertIsNumber (swNumber);
		this.userProgram.getStopwatch (swNumber).reset ();
	}
}

export class ThreadCreateBlock extends CommandBlock {
	routineName: string;
	threadID: ValueBlockBehaviors.ValueBlock | null;
	argument1: ValueBlockBehaviors.ValueBlock | null;
	argument2: ValueBlockBehaviors.ValueBlock | null;
	argument3: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const threadFunctionName = super.getField ("thread_function_name");
		this.routineName = threadFunctionName ? threadFunctionName : "";
		const threadID = super.getValue ("thread_name");
		this.threadID = threadID ? ValueBlockBehaviors.ValueBlock.constructBlock (threadID, userProgram, myRoutine) : null;
		const argument1 = super.getValue ("argument1");
		this.argument1 = argument1 ? ValueBlockBehaviors.ValueBlock.constructBlock (argument1, userProgram, myRoutine) : null;
		const argument2 = super.getValue ("argument2");
		this.argument2 = argument2 ? ValueBlockBehaviors.ValueBlock.constructBlock (argument2, userProgram, myRoutine) : null;
		const argument3 = super.getValue ("argument3");
		this.argument3 = argument3 ? ValueBlockBehaviors.ValueBlock.constructBlock (argument3, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.threadID);

		const threadID = this.threadID.executeBlock ();
		assertIsString (threadID);

		assertIsDefined (this.argument1);
		assertIsDefined (this.argument2);
		assertIsDefined (this.argument3);
		const argument1 = this.argument1.executeBlock ();
		const argument2 = this.argument2.executeBlock ();
		const argument3 = this.argument3.executeBlock ();
		assertIsNumber (argument1);
		assertIsNumber (argument2);
		assertIsNumber (argument3);

		const func = this.userProgram.getFunctionDefinitionBlockByName (this.routineName);
		if (func) {
			this.userProgram.addThread (this.routineName, threadID, func, argument1, argument2, argument3);
			await this.userProgram.executeThread (threadID);
		}
	}
}

export class ThreadJoinBlock extends CommandBlock {
	threaedID: ValueBlockBehaviors.ValueBlock | null;
	threadIDStr: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);

		const threadID = super.getValue ("thread_name");
		this.threaedID = threadID ? ValueBlockBehaviors.ValueBlock.constructBlock (threadID, userProgram, myRoutine) : null;
		this.threadIDStr = "";
	}

	async executeBlock () {
		assertIsDefined (this.threaedID);

		const threadName = this.threaedID.executeBlock ();
		assertIsString (threadName);
		this.threadIDStr = threadName;
	}

	isWaiting (): boolean {
		const thread = this.userProgram.getThread (this.threadIDStr);
		if (thread) {
			return thread.isExecuting;
		} else {
			return false;
		}
	}
}
