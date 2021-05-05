import {commandBlockDefinitions, UserProgram} from "./blockDefinitions";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";

export class CommandBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	userProgram: UserProgram;
	wait: number;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlからブロックIDを取得
		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.userProgram = userProgram;

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
	static constructBlock (blockXml: Element, userProgram: UserProgram) {
		const constructedBlocks = [];
		let block = blockXml;
		while (true) {
			// 該当するブロック定義を探し、そのクラスをインスタンス化
			for (const commandBlockDefinition of commandBlockDefinitions) {
				if (commandBlockDefinition.type === block.getAttribute ("type")) {
					const wait = commandBlockDefinition.wait;
					constructedBlocks.push (commandBlockDefinition.instantiate (block, userProgram, wait));
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

export class PrintBlock extends CommandBlock {
	text: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const text = super.getValue ("TEXT");
		this.text = text ? ValueBlockBehaviors.ValueBlock.constructBlock (text) : null;
	}

	executeBlock () {
		console.log (this.text?.executeBlock ());
	}
}

export class SecondsWaitBlock extends CommandBlock {
	second: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const second = super.getValue ("second");
		this.second = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second) : null;
	}

	executeBlock () {
		if (this.second) {
			const wait = this.second.executeBlock ();
			if (typeof (wait) === "number") {
				this.wait = wait * 1000;
			} else {
				this.wait = 0;
			}
		}
	}
}

export class MilliSecondsWaitBlock extends CommandBlock {
	millisecond: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const second = super.getValue ("millisecond");
		this.millisecond = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second) : null;
	}

	executeBlock () {
		if (this.millisecond) {
			const wait = this.millisecond.executeBlock ();
			if (typeof (wait) === "number") {
				this.wait = wait;
			} else {
				this.wait = 0;
			}
		}
	}
}

export class IfBlock extends CommandBlock {
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock[];

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition) : null;
		const statement = super.getStatement ("DO0");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram) : [];
	}

	async executeBlock () {
		if (this.condition) {
			if (this.condition.executeBlock ()) {
				await this.userProgram.executeBlockList (this.statement);
			}
		}
	}
}

export class IfElseBlock extends CommandBlock {
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement1: CommandBlock[];
	statement2: CommandBlock[];

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition) : null;
		const statement1 = super.getStatement ("DO0");
		this.statement1 = statement1 ? CommandBlock.constructBlock (statement1, userProgram) : [];
		const statement2 = super.getStatement ("ELSE");
		this.statement2 = statement2 ? CommandBlock.constructBlock (statement2, userProgram) : [];
	}

	async executeBlock () {
		if (this.condition) {
			if (this.condition.executeBlock ()) {
				await this.userProgram.executeBlockList (this.statement1);
			} else {
				await this.userProgram.executeBlockList (this.statement2);
			}
		}
	}
}

export class ForBlock extends CommandBlock {
	count: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock [];

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);
		const count = super.getValue ("TIMES");
		this.count = count ? ValueBlockBehaviors.ValueBlock.constructBlock (count) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram) : [];
	}

	async executeBlock () {
		if (this.count) {
			const count = this.count.executeBlock ();
			for (let i = 0; i < count; i++) {
				await this.userProgram.executeBlockList (this.statement);
			}
		}
	}
}

export class WhileBlock extends CommandBlock {
	mode: string | null;
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock[];

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);
		const mode = super.getField ("MODE");
		this.mode = mode ? mode : null;
		const condition = super.getValue ("BOOL");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, userProgram) : [];
	}

	async executeBlock () {
		if (this.mode && this.condition) {
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
}

export class LocalVariableWriteBlock extends CommandBlock {
	name: string | null;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const name = super.getField ("name");
		this.name = name ? name : null;
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value) : null;
	}
}

export class GlobalVariableWriteBlock extends CommandBlock {
	name: string | null;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const name = super.getField ("name");
		this.name = name ? name : null;
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value) : null;
	}
}

export class FunctionDefinitionBlock extends CommandBlock {
	statement: CommandBlock[];
	functionName: string | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const functionName = super.getField ("name");
		this.functionName = functionName ? functionName : null;
		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], userProgram);
		} else {
			this.statement = [];
		}
	}

	async executeBlock () {
		if (this.statement) {
			await this.userProgram.executeBlockList (this.statement);
		}
	}

	static constructBlock (blockXml: Element, userProgram: UserProgram) {
		const blockType = "function_definition";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = commandBlockDefinitions.find ((definition) => {
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
	name: string | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const name = super.getField ("name");
		this.name = name ? name : null;
	}

	executeBlock () {
		if (this.name) {
			this.userProgram.executeFunction (this.name);
		}
	}
}

export class EntryPointBlock extends CommandBlock {
	statement: CommandBlock[];

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], userProgram);
		} else {
			this.statement = [];
		}
	}

	async executeBlock () {
		if (this.statement) {
			await this.userProgram.executeBlockList (this.statement);
		}
	}

	static constructBlock (blockXml: Element, userProgram: UserProgram) {
		const blockType = "entry_point";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = commandBlockDefinitions.find ((definition) => {
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

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber) : null;
	}

	executeBlock () {
		if (this.swNumber) {
			const swNumber = this.swNumber.executeBlock ();
			if (typeof (swNumber) === "number") {
				this.userProgram.getStopwatch (swNumber).start ();
			}
		}
	}
}

export class StopwatchStopBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber) : null;
	}

	executeBlock () {
		if (this.swNumber) {
			const swNumber = this.swNumber.executeBlock ();
			if (typeof (swNumber) === "number") {
				this.userProgram.getStopwatch (swNumber).stop ();
			}
		}
	}
}

export class StopwatchResetBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber) : null;
	}

	executeBlock () {
		if (this.swNumber) {
			const swNumber = this.swNumber.executeBlock ();
			if (typeof (swNumber) === "number") {
				this.userProgram.getStopwatch (swNumber).reset ();
			}
		}
	}
}

export class ThreadCreateBlock extends CommandBlock {
	threadName: ValueBlockBehaviors.ValueBlock | null;
	functionName: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const threadName = super.getValue ("thread_name");
		this.threadName = threadName ? ValueBlockBehaviors.ValueBlock.constructBlock (threadName) : null;
		const functionName = super.getValue ("thread_function_name");
		this.functionName = functionName ? ValueBlockBehaviors.ValueBlock.constructBlock (functionName) : null;
	}
}

export class ThreadJoinBlock extends CommandBlock {
	threadName: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, wait: number) {
		super (blockXml, userProgram, wait);

		const threadName = super.getValue ("thread_name");
		this.threadName = threadName ? ValueBlockBehaviors.ValueBlock.constructBlock (threadName) : null;
	}
}
