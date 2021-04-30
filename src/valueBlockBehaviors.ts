import {valueBlockDefinitions} from "./blockDefinitions";

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
		return definition ? definition.instantiate (blockXml, 0.2) : null;
	}
}

export class CompareBlock extends ValueBlock {
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

export class LogicOperationBlock extends ValueBlock {
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

export class NotBlock extends ValueBlock {
	value: ValueBlock | null;

	constructor (blockXml: Element, wait: number) {
		super (blockXml, wait);
		const value = super.getValue ("BOOL");
		this.value = value ? ValueBlock.constructBlock (value) : null;
	}
}

export class NumberBlock extends ValueBlock {
	num: number | null;

	constructor (blockXml: Element, wait: number) {
		super (blockXml, wait);
		const num = super.getField ("NUM");
		this.num = num ? Number (num) : null;
	}
}

export class CalculateBlock extends ValueBlock {
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

export class TextBlock extends ValueBlock {
	text: string | null;

	constructor (blockXml: Element, wait: number) {
		super (blockXml, wait);
		const text = super.getField ("TEXT");
		this.text = text != null ? text : null;
	}
}

export class LocalVariableReadBlock extends ValueBlock {
	name: string | null;

	constructor (blockXml: Element, wait: number) {
		super (blockXml, wait);
		const name = super.getField ("name");
		this.name = name ? name : null;
	}
}

export class GlobalVariableReadBlock extends ValueBlock {
	name: string | null;

	constructor (blockXml: Element, wait: number) {
		super (blockXml, wait);
		const name = super.getField ("name");
		this.name = name ? name : null;
	}
}

export class StopwatchReadBlock extends ValueBlock {
	swNumber: ValueBlock | null;

	constructor (blockXml: Element, wait: number) {
		super (blockXml, wait);
		const threadNumber = super.getValue ("number");
		this.swNumber = threadNumber ? ValueBlock.constructBlock (threadNumber) : null;
	}
}
