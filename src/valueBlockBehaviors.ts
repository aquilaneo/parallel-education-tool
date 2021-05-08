import {valueBlockDefinitions, UserProgram} from "./blockDefinitions";
import {assertIsBoolean, assertIsDefined, assertIsNumber} from "./common";

export class ValueBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	userProgram: UserProgram;
	functionName: string;
	wait: number;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
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

	executeBlock (): number | string | boolean {
		return 0;
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
	static constructBlock (blockXml: Element, userProgram: UserProgram, functionName: string): ValueBlock | null {
		const definition = valueBlockDefinitions.find ((valueBlockDefinition) => {
			return valueBlockDefinition.type === blockXml.getAttribute ("type");
		});
		return definition ? definition.instantiate (blockXml, userProgram, functionName, definition.wait) : null;
	}
}

export class CompareBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, functionName) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, functionName) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		const operand1 = this.operand1.executeBlock ();
		const operand2 = this.operand2.executeBlock ();
		assertIsNumber (operand1);
		assertIsNumber (operand2);
		switch (this.operator) {
			case "EQ":
				return operand1 === operand2;
			case "NEQ":
				return operand1 !== operand2;
			case "LT":
				return operand1 < operand2;
			case "LTE":
				return operand1 <= operand2;
			case "GT":
				return operand1 > operand2;
			case "GTE":
				return operand1 >= operand2;
			default:
				return false;
		}
	}
}

export class LogicOperationBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, functionName) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, functionName) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		const operand1 = this.operand1.executeBlock ();
		const operand2 = this.operand2.executeBlock ();
		assertIsBoolean (operand1);
		assertIsBoolean (operand2);
		switch (this.operator) {
			case "AND":
				return operand1 && operand2;
			case "OR":
				return operand1 || operand2;
			default:
				return false;
		}
	}
}

export class NotBlock extends ValueBlock {
	value: ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const value = super.getValue ("BOOL");
		this.value = value ? ValueBlock.constructBlock (value, userProgram, functionName) : null;
	}

	executeBlock () {
		assertIsDefined (this.value);

		const value = this.value.executeBlock ();
		assertIsBoolean (value);
		return value;
	}
}

export class NumberBlock extends ValueBlock {
	num: number;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const num = super.getField ("NUM");
		this.num = num ? Number (num) : 0;
	}

	executeBlock () {
		return this.num;
	}
}

export class CalculateBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, functionName) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, functionName) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		const operand1 = this.operand1.executeBlock ();
		const operand2 = this.operand2.executeBlock ();
		assertIsNumber (operand1);
		assertIsNumber (operand2);
		switch (this.operator) {
			case "ADD":
				return operand1 + operand2;
			case "MINUS":
				return operand1 - operand2;
			case "MULTIPLY":
				return operand1 * operand2;
			case "DIVIDE":
				return operand1 / operand2;
			case "POWER":
				return Math.pow (operand1, operand2);
			default:
				return 0;
		}
	}
}

export class TextBlock extends ValueBlock {
	text: string;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const text = super.getField ("TEXT");
		this.text = text != null ? text : "";
	}

	executeBlock () {
		return this.text;
	}
}

export class LocalVariableReadBlock extends ValueBlock {
	name: string | null;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const name = super.getField ("name");
		this.name = name ? name : null;
	}

	executeBlock () {
		return this.name ? this.userProgram.readLocalVariable (this.functionName, this.name) : 0;
	}
}

export class GlobalVariableReadBlock extends ValueBlock {
	name: string | null;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const name = super.getField ("name");
		this.name = name ? name : null;
	}

	executeBlock () {
		return this.name ? this.userProgram.readGlobalVariable (this.name) : 0;
	}
}

export class StopwatchReadBlock extends ValueBlock {
	swNumber: ValueBlock | null;

	constructor (blockXml: Element, userProgram: UserProgram, functionName: string, wait: number) {
		super (blockXml, userProgram, functionName, wait);
		const threadNumber = super.getValue ("number");
		this.swNumber = threadNumber ? ValueBlock.constructBlock (threadNumber, userProgram, functionName) : null;
	}
}
