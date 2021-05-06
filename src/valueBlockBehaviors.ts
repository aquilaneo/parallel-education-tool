import {valueBlockDefinitions} from "./blockDefinitions";

export class ValueBlock {
	blockType: string;
	id: string;
	blockXml: Element;
	functionName: string;
	wait: number;

	constructor (blockXml: Element, functionName: string, wait: number) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlからブロックIDを取得
		const id = blockXml.getAttribute ("id");
		this.id = id ? id : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.functionName = functionName;
		this.wait = wait;
	}

	executeBlock (): number | string | boolean {
		console.log (this.blockType);
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
	static constructBlock (blockXml: Element, functionName: string): ValueBlock | null {
		const definition = valueBlockDefinitions.find ((valueBlockDefinition) => {
			return valueBlockDefinition.type === blockXml.getAttribute ("type");
		});
		return definition ? definition.instantiate (blockXml, functionName, definition.wait) : null;
	}
}

export class CompareBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, functionName) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, functionName) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	executeBlock () {
		if (this.operand1 && this.operand2) {
			switch (this.operator) {
				case "EQ":
					return this.operand1.executeBlock () === this.operand2.executeBlock ();
				case "NEQ":
					return this.operand1.executeBlock () !== this.operand2.executeBlock ();
				case "LT":
					return this.operand1.executeBlock () < this.operand2.executeBlock ();
				case "LTE":
					return this.operand1.executeBlock () <= this.operand2.executeBlock ();
				case "GT":
					return this.operand1.executeBlock () > this.operand2.executeBlock ();
				case "GTE":
					return this.operand1.executeBlock () >= this.operand2.executeBlock ();
			}
		}
		return false;
	}
}

export class LogicOperationBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, functionName) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, functionName) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	executeBlock () {
		if (this.operand1 && this.operand2) {
			switch (this.operator) {
				case "AND":
					return this.operand1.executeBlock () && this.operand2.executeBlock ();
				case "OR":
					return this.operand1.executeBlock () || this.operand2.executeBlock ();
			}
		}
		return false;
	}
}

export class NotBlock extends ValueBlock {
	value: ValueBlock | null;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const value = super.getValue ("BOOL");
		this.value = value ? ValueBlock.constructBlock (value, functionName) : null;
	}

	executeBlock () {
		if (this.value) {
			return !this.value.executeBlock ();
		} else {
			return false;
		}
	}
}

export class NumberBlock extends ValueBlock {
	num: number;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
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

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, functionName) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, functionName) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	executeBlock () {
		if (this.operand1 && this.operand2) {
			const operand1 = this.operand1.executeBlock ();
			const operand2 = this.operand2.executeBlock ();
			if (typeof (operand1) === "number" && typeof (operand2) === "number") {
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
				}
			}
		}
		return 0;
	}
}

export class TextBlock extends ValueBlock {
	text: string;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const text = super.getField ("TEXT");
		this.text = text != null ? text : "";
	}

	executeBlock () {
		return this.text ? this.text : "";
	}
}

export class LocalVariableReadBlock extends ValueBlock {
	name: string | null;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const name = super.getField ("name");
		this.name = name ? name : null;
	}
}

export class GlobalVariableReadBlock extends ValueBlock {
	name: string | null;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const name = super.getField ("name");
		this.name = name ? name : null;
	}
}

export class StopwatchReadBlock extends ValueBlock {
	swNumber: ValueBlock | null;

	constructor (blockXml: Element, functionName: string, wait: number) {
		super (blockXml, functionName, wait);
		const threadNumber = super.getValue ("number");
		this.swNumber = threadNumber ? ValueBlock.constructBlock (threadNumber, functionName) : null;
	}
}
