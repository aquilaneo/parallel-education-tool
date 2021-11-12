import * as BlockDefinitions from "./blockDefinitions";
import {assertIsBoolean, assertIsDefined, assertIsNumber, assertIsString} from "./common";

export class ValueBlock {
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

	async executeBlock (): Promise<number | string | boolean> {
		return 0;
	}

	finalizeBlock () {
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
	static constructBlock (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine): ValueBlock | null {
		const definition = BlockDefinitions.valueBlockDefinitions.find ((valueBlockDefinition) => {
			return valueBlockDefinition.type === blockXml.getAttribute ("type");
		});
		return definition ? definition.instantiate (blockXml, userProgram, myRoutine, definition.wait) : null;
	}
}

export class CompareBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, myRoutine) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, myRoutine) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	async executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		const operand1 = await this.userProgram.executeValueBlock (this.operand1);
		const operand2 = await this.userProgram.executeValueBlock (this.operand2);
		assertIsNumber (operand1);
		assertIsNumber (operand2);
		// 演算子ごとに適した演算結果を返す
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, myRoutine) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, myRoutine) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	async executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		const operand1 = await this.userProgram.executeValueBlock (this.operand1);
		const operand2 = await this.userProgram.executeValueBlock (this.operand2);
		assertIsBoolean (operand1);
		assertIsBoolean (operand2);
		// 演算子ごとに適した演算結果を返す。
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const value = super.getValue ("BOOL");
		this.value = value ? ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsBoolean (value);
		return value;
	}
}

export class NumberBlock extends ValueBlock {
	num: number;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const num = super.getField ("NUM");
		this.num = num ? Number (num) : 0;
	}

	async executeBlock () {
		return this.num;
	}
}

export class CalculateBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, myRoutine) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, myRoutine) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	async executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		const operand1 = await this.userProgram.executeValueBlock (this.operand1);
		const operand2 = await this.userProgram.executeValueBlock (this.operand2);
		assertIsNumber (operand1);
		assertIsNumber (operand2);
		// 演算子ごとに適した演算結果を返す。
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

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const text = super.getField ("TEXT");
		this.text = text != null ? text : "";
	}

	async executeBlock () {
		return this.text;
	}
}

export class TextCalculateBlock extends ValueBlock {
	operand1: ValueBlock | null;
	operand2: ValueBlock | null;
	operator: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const operand1 = super.getValue ("A");
		this.operand1 = operand1 ? ValueBlock.constructBlock (operand1, userProgram, myRoutine) : null;
		const operand2 = super.getValue ("B");
		this.operand2 = operand2 ? ValueBlock.constructBlock (operand2, userProgram, myRoutine) : null;
		const operator = super.getField ("OP");
		this.operator = operator ? operator : "";
	}

	async executeBlock () {
		assertIsDefined (this.operand1);
		assertIsDefined (this.operand2);

		let operand1 = await this.userProgram.executeValueBlock (this.operand1);
		let operand2 = await this.userProgram.executeValueBlock (this.operand2);

		operand1 = operand1.toString ();
		operand2 = operand2.toString ();

		// 演算子ごとに適した演算結果を返す。
		switch (this.operator) {
			case "ADD":
				return operand1 + operand2;
			default:
				return "";
		}
	}
}

export class VariablesGetNumber extends ValueBlock {
	variableName: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const variableName = super.getField ("variable");
		this.variableName = variableName ? variableName : "";
	}

	async executeBlock () {
		const result = this.myRoutine?.readLocalNumberVariable (this.variableName);
		return result ? result : 0;
	}
}

export class VariablesGetString extends ValueBlock {
	variableName: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const variableName = super.getField ("variable");
		this.variableName = variableName ? variableName : "";
	}

	async executeBlock () {
		const result = this.myRoutine?.readLocalStringVariable (this.variableName);
		return result ? result : "";
	}
}

export class GlobalVariableReadBlock extends ValueBlock {
	name: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const name = super.getField ("name");
		this.name = name ? name : "";
	}

	async executeBlock () {
		this.userProgram.mission.addGlobalVariableAccess (this.name, "rgb(0, 255, 0)");
		const result = this.userProgram.mission.readVariable (this.name);
		return result ? result : 0;
	}

	finalizeBlock () {
		this.userProgram.mission.removeGlobalVariableAccess (this.name, "rgb(0, 255, 0)");
	}
}

export class GlobalOneDimensionalArrayRead extends ValueBlock {
	name: string;
	index: ValueBlock | null;
	indexNumber: number = 0;

	constructor (blocklyXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blocklyXml, userProgram, myRoutine, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const index = super.getValue ("index");
		this.index = index ? ValueBlock.constructBlock (index, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.index);

		const index = await this.userProgram.executeValueBlock (this.index);
		assertIsNumber (index);
		this.indexNumber = index;

		this.userProgram.mission.addOneDimensionalArrayAccess (this.name, this.indexNumber, "rgb(0, 255, 0)");
		const result = this.userProgram.mission.readOneDimensionalArray (this.name, index);
		return result ? result : 0;
	}

	finalizeBlock () {
		this.userProgram.mission.removeOneDimensionalArrayAccess (this.name, this.indexNumber, "rgb(0, 255, 0)");
	}
}

export class GlobalTwoDimensionalArrayRead extends ValueBlock {
	name: string;
	row: ValueBlock | null;
	rowNumber: number = 0;
	col: ValueBlock | null;
	colNumber: number = 0;

	constructor (blocklyXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blocklyXml, userProgram, myRoutine, wait);

		const name = super.getField ("name");
		this.name = name ? name : "";
		const row = super.getValue ("row");
		this.row = row ? ValueBlock.constructBlock (row, userProgram, myRoutine) : null;
		const col = super.getValue ("col");
		this.col = col ? ValueBlock.constructBlock (col, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.row);
		assertIsDefined (this.col);

		const row = await this.userProgram.executeValueBlock (this.row);
		const col = await this.userProgram.executeValueBlock (this.col);
		assertIsNumber (row);
		assertIsNumber (col);
		this.rowNumber = row;
		this.colNumber = col;

		this.userProgram.mission.addTwoDimensionalArrayAccess (this.name, this.rowNumber, this.colNumber, "rgb(0, 255, 0)");
		const result = this.userProgram.mission.readTwoDimensionalArray (this.name, row, col);
		return result ? result : 0;
	}

	finalizeBlock () {
		this.userProgram.mission.removeTwoDimensionalArrayAccess (this.name, this.rowNumber, this.colNumber, "rgb(0, 255, 0)");
	}
}

export class GetArgumentBlock extends ValueBlock {
	argument: string;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const argument = super.getField ("argument");
		this.argument = argument ? argument : "";
	}

	async executeBlock () {
		if (this.myRoutine) {
			switch (this.argument) {
				case "argument1":
					return this.myRoutine.getArgument (0);
				case "argument2":
					return this.myRoutine.getArgument (1);
				case "argument3":
					return this.myRoutine.getArgument (2);
			}
		}
		return 0;
	}
}

export class FunctionCallWithReturnBlock extends ValueBlock {
	name: string;
	argument1: ValueBlock | null;
	argument2: ValueBlock | null;
	argument3: ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const name = super.getField ("name");
		this.name = name ? name : "";

		const argument1 = super.getValue ("argument1");
		this.argument1 = argument1 ? ValueBlock.constructBlock (argument1, userProgram, myRoutine) : null;
		const argument2 = super.getValue ("argument2");
		this.argument2 = argument2 ? ValueBlock.constructBlock (argument2, userProgram, myRoutine) : null;
		const argument3 = super.getValue ("argument3");
		this.argument3 = argument3 ? ValueBlock.constructBlock (argument3, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.argument1);
		assertIsDefined (this.argument2);
		assertIsDefined (this.argument3);
		const argument1 = await this.userProgram.executeValueBlock (this.argument1);
		const argument2 = await this.userProgram.executeValueBlock (this.argument2);
		const argument3 = await this.userProgram.executeValueBlock (this.argument3);
		assertIsNumber (argument1);
		assertIsNumber (argument2);
		assertIsNumber (argument3);

		return await this.userProgram.executeFunction (this.name, argument1, argument2, argument3);
	}
}

export class StopwatchReadBlock extends ValueBlock {
	swNumber: ValueBlock | null;

	constructor (blockXml: Element, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number) {
		super (blockXml, userProgram, myRoutine, wait);
		const threadNumber = super.getValue ("number");
		this.swNumber = threadNumber ? ValueBlock.constructBlock (threadNumber, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = await this.userProgram.executeValueBlock (this.swNumber);
		assertIsNumber (swNumber);
		return Math.round (this.userProgram.getStopwatch (swNumber).read ());
	}
}
