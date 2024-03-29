/*
	Copyright (c) 2022 aquilaneo
	This software is released under the MIT License.
	LICENSE file is in the root directory of this repository.
*/

import * as BlockDefinitions from "./blockDefinitions";
import * as ValueBlockBehaviors from "./valueBlockBehaviors";
import {assertIsDefined, assertIsNumber, assertIsString} from "./common";
import * as Blockly from "blockly";
import {ValueBlock} from "./valueBlockBehaviors";

export class CommandBlock {
	blockType: string;
	blockXml: Element;
	blocklyBlock: Blockly.Block | null = null;
	baseBlockColor: string = "";
	executingBlockColor: string = "";
	workspace: Blockly.Workspace | null = null;
	userProgram: BlockDefinitions.UserProgram;
	myRoutine: BlockDefinitions.Routine;
	wait: number;
	randomSpeed: boolean;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		// ブロックのxmlからブロックタイプを取得
		const blockType = blockXml.getAttribute ("type");
		this.blockType = blockType ? blockType : "";
		// ブロックのxmlを取得
		this.blockXml = blockXml;

		this.userProgram = userProgram;
		this.myRoutine = myRoutine;
		this.wait = wait;
		this.randomSpeed = randomSpeed;
	}

	async executeBlock () {
		console.log (this.blockType);
	}

	finalizeBlock () {
	}

	// 色を計算
	calcBlockColor () {
		if (this.blocklyBlock) {
			this.baseBlockColor = this.blocklyBlock.getColour ();
			// executingBlockColorを求める
			const rgbString = this.baseBlockColor.replace ("#", "");
			let rNumber = parseInt (rgbString[0] + rgbString[1], 16);
			let gNumber = parseInt (rgbString[2] + rgbString[3], 16);
			let bNumber = parseInt (rgbString[4] + rgbString[5], 16);
			rNumber += 48;
			gNumber += 48;
			bNumber += 48;
			if (rNumber > 255) {
				rNumber = 255;
			}
			if (gNumber > 255) {
				gNumber = 255;
			}
			if (bNumber > 255) {
				bNumber = 255;
			}
			this.executingBlockColor = `#${rNumber.toString (16)}${gNumber.toString (16)}${bNumber.toString (16)}`;
		}
	}

	// ワークスペース上のブロックを実行中色に変える
	setBlockColorToExecuting () {
		if (this.blocklyBlock) {
			this.blocklyBlock.setColour (this.executingBlockColor);
		}
	}

	// ワークスペース上のブロックをベース色に戻す
	setBlockColorToBase () {
		if (this.blocklyBlock) {
			this.blocklyBlock.setColour (this.baseBlockColor);
		}
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

	// ブロックのワークスペースを設定
	setWorkspace (workspace: Blockly.Workspace | null) {
		this.workspace = workspace;
		const id = this.blockXml.getAttribute ("id");
		if (id && workspace) {
			this.blocklyBlock = workspace.getBlockById (id);
		}
		this.calcBlockColor ();
	}

	// nextタグでつながっているコマンドブロックをオブジェクト化し配列化
	static constructBlock (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine) {
		const constructedBlocks = [];
		let block = blockXml;
		while (true) {
			// 該当するブロック定義を探し、そのクラスをインスタンス化
			for (const commandBlockDefinition of BlockDefinitions.commandBlockDefinitions) {
				if (commandBlockDefinition.type === block.getAttribute ("type")) {
					const wait = commandBlockDefinition.wait;
					const randomSpeed = commandBlockDefinition.randomSpeed;
					constructedBlocks.push (commandBlockDefinition.instantiate (block, workspace, userProgram, myRoutine, wait, randomSpeed));
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

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const text = super.getValue ("TEXT");
		this.text = text ? ValueBlockBehaviors.ValueBlock.constructBlock (text, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.text);

		const text = await this.userProgram.executeValueBlock (this.text);
		this.userProgram.mission.printLog (text.toString ());
	}
}

export class SecondsWaitBlock extends CommandBlock {
	second: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const second = super.getValue ("second");
		this.second = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.second);

		const wait = await this.userProgram.executeValueBlock (this.second);
		assertIsNumber (wait);
		this.wait = wait * 1000;
	}
}

export class MilliSecondsWaitBlock extends CommandBlock {
	millisecond: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const second = super.getValue ("millisecond");
		this.millisecond = second ? ValueBlockBehaviors.ValueBlock.constructBlock (second, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.millisecond);

		const wait = await this.userProgram.executeValueBlock (this.millisecond);
		assertIsNumber (wait);
		this.wait = wait;
	}
}

export class IfBlock extends CommandBlock {
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock[];

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, myRoutine) : null;
		const statement = super.getStatement ("DO0");
		this.statement = statement ? CommandBlock.constructBlock (statement, workspace, userProgram, myRoutine) : [];
		this.setWorkspace (workspace);
	}

	async executeBlock () {
		assertIsDefined (this.condition);

		if (await this.userProgram.executeValueBlock (this.condition)) {
			await this.userProgram.executeBlockList (this.statement);
		}
	}

	setWorkspace (workspace: Blockly.Workspace | null) {
		super.setWorkspace (workspace);
		for (const commandBlock of this.statement) {
			commandBlock.setWorkspace (workspace);
		}
	}
}

export class IfElseBlock extends CommandBlock {
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement1: CommandBlock[];
	statement2: CommandBlock[];

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const condition = super.getValue ("IF0");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, myRoutine) : null;
		const statement1 = super.getStatement ("DO0");
		this.statement1 = statement1 ? CommandBlock.constructBlock (statement1, workspace, userProgram, myRoutine) : [];
		const statement2 = super.getStatement ("ELSE");
		this.statement2 = statement2 ? CommandBlock.constructBlock (statement2, workspace, userProgram, myRoutine) : [];
		this.setWorkspace (workspace);
	}

	async executeBlock () {
		assertIsDefined (this.condition);

		if (await this.userProgram.executeValueBlock (this.condition)) {
			await this.userProgram.executeBlockList (this.statement1);
		} else {
			await this.userProgram.executeBlockList (this.statement2);
		}
	}

	setWorkspace (workspace: Blockly.Workspace | null) {
		super.setWorkspace (workspace);
		for (const commandBlock of this.statement1) {
			commandBlock.setWorkspace (workspace);
		}
		for (const commandBlock of this.statement2) {
			commandBlock.setWorkspace (workspace);
		}
	}
}

export class ForBlock extends CommandBlock {
	count: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock [];

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const count = super.getValue ("TIMES");
		this.count = count ? ValueBlockBehaviors.ValueBlock.constructBlock (count, userProgram, myRoutine) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, workspace, userProgram, myRoutine) : [];
		this.setWorkspace (workspace);
	}

	async executeBlock () {
		assertIsDefined (this.count);

		const count = await this.userProgram.executeValueBlock (this.count);
		for (let i = 0; i < count; i++) {
			if (!this.userProgram.stopFlg) {
				await this.userProgram.executeBlockList (this.statement);
			} else {
				return;
			}
		}
	}

	setWorkspace (workspace: Blockly.Workspace | null) {
		super.setWorkspace (workspace);
		for (const commandBlock of this.statement) {
			commandBlock.setWorkspace (workspace);
		}
	}
}

export class WhileBlock extends CommandBlock {
	mode: string;
	condition: ValueBlockBehaviors.ValueBlock | null;
	statement: CommandBlock[];

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const mode = super.getField ("MODE");
		this.mode = mode ? mode : "";
		const condition = super.getValue ("BOOL");
		this.condition = condition ? ValueBlockBehaviors.ValueBlock.constructBlock (condition, userProgram, myRoutine) : null;
		const statement = super.getStatement ("DO");
		this.statement = statement ? CommandBlock.constructBlock (statement, workspace, userProgram, myRoutine) : [];
		this.setWorkspace (workspace);
	}

	async executeBlock () {
		assertIsDefined (this.condition);

		switch (this.mode) {
			case "WHILE":
				while (await this.userProgram.executeValueBlock (this.condition)) {
					if (!this.userProgram.stopFlg) {
						await this.userProgram.executeBlockList (this.statement);
					} else {
						return;
					}
				}
				break;
			case "UNTIL":
				while (!await this.userProgram.executeValueBlock (this.condition)) {
					if (!this.userProgram.stopFlg) {
						await this.userProgram.executeBlockList (this.statement);
					} else {
						return;
					}
				}
				break;
		}
	}

	setWorkspace (workspace: Blockly.Workspace | null) {
		super.setWorkspace (workspace);
		for (const commandBlock of this.statement) {
			commandBlock.setWorkspace (workspace);
		}
	}
}

export class VariablesSetNumber extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsNumber (value);
		this.myRoutine?.writeLocalNumberVariable (this.variable, value);
	}
}

export class VariablesAddNumber extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const operand = this.myRoutine?.readLocalNumberVariable (this.variable);
		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsNumber (value);
		this.myRoutine?.writeLocalNumberVariable (this.variable, operand + value);
	}
}

export class VariablesSetString extends CommandBlock {
	variable: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const variable = super.getField ("variable");
		this.variable = variable ? variable : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsString (value);
		this.myRoutine?.writeLocalStringVariable (this.variable, value);
	}
}

export class GlobalVariableWriteBlock extends CommandBlock {
	name: string;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const name = super.getField ("name");
		this.name = name ? name : "";
		const value = super.getValue ("value");
		this.value = value ? ValueBlockBehaviors.ValueBlock.constructBlock (value, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.value);

		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsNumber (value);

		this.userProgram.mission.addGlobalVariableAccess (this.name, this.myRoutine.routineColor, false);

		this.userProgram.mission.writeVariable (this.name, value);
	}

	finalizeBlock () {
		this.userProgram.mission.removeGlobalVariableAccess (this.name, this.myRoutine.routineColor, false);
	}
}

export class GlobalOneDimensionalArrayWrite extends CommandBlock {
	name: string;
	index: ValueBlockBehaviors.ValueBlock | null;
	indexNumber: number = 0;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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

		const index = await this.userProgram.executeValueBlock (this.index);
		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsNumber (index);
		this.indexNumber = index;
		assertIsNumber (value);

		this.userProgram.mission.addOneDimensionalArrayAccess (this.name, this.indexNumber, this.myRoutine.routineColor, false);
		this.userProgram.mission.writeOneDimensionalArray (this.name, this.indexNumber, value);
	}

	finalizeBlock () {
		this.userProgram.mission.removeOneDimensionalArrayAccess (this.name, this.indexNumber, this.myRoutine.routineColor, false);
	}
}

export class GlobalTwoDimensionalArrayWrite extends CommandBlock {
	name: string;
	row: ValueBlockBehaviors.ValueBlock | null;
	rowNumber: number = 0;
	col: ValueBlockBehaviors.ValueBlock | null;
	colNumber: number = 0;
	value: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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

		const row = await this.userProgram.executeValueBlock (this.row);
		const col = await this.userProgram.executeValueBlock (this.col);
		const value = await this.userProgram.executeValueBlock (this.value);
		assertIsNumber (row);
		assertIsNumber (col);
		this.rowNumber = row;
		this.colNumber = col;
		assertIsNumber (value);

		this.userProgram.mission.addTwoDimensionalArrayAccess (this.name, this.rowNumber, this.colNumber, this.myRoutine.routineColor, false);
		this.userProgram.mission.writeTwoDimensionalArray (this.name, row, col, value);
	}

	finalizeBlock () {
		this.userProgram.mission.removeTwoDimensionalArrayAccess (this.name, this.rowNumber, this.colNumber, this.myRoutine.routineColor, false);
	}
}

export class FunctionDefinitionBlock extends CommandBlock {
	functionName: string;
	statement: CommandBlock[];

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const functionName = super.getField ("name");
		this.functionName = functionName ? functionName : "";
		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], workspace, userProgram, myRoutine);
		} else {
			this.statement = [];
		}
		this.setWorkspace (workspace);
	}

	async executeBlock () {
		assertIsDefined (this.statement);

		await this.userProgram.executeBlockList (this.statement);
	}

	setWorkspace (workspace: Blockly.Workspace | null) {
		super.setWorkspace (workspace);
		for (const commandBlock of this.statement) {
			commandBlock.setWorkspace (workspace);
		}
	}

	static constructBlock (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine) {
		const blockType = "function_definition";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = BlockDefinitions.commandBlockDefinitions.find ((definition) => {
				return definition.type === blockType
			});

			if (functionBlockDefinition) {
				return [new FunctionDefinitionBlock (blockXml, workspace, userProgram, myRoutine, functionBlockDefinition.wait, functionBlockDefinition.randomSpeed)];
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

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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
		const argument1 = await this.userProgram.executeValueBlock (this.argument1);
		const argument2 = await this.userProgram.executeValueBlock (this.argument2);
		const argument3 = await this.userProgram.executeValueBlock (this.argument3);
		assertIsNumber (argument1);
		assertIsNumber (argument2);
		assertIsNumber (argument3);

		await this.userProgram.executeFunction (this.name, argument1, argument2, argument3);
	}
}

export class ReturnValueBlock extends CommandBlock {
	returnValue: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);

		const returnValue = super.getValue ("return_value");
		this.returnValue = returnValue ? ValueBlockBehaviors.ValueBlock.constructBlock (returnValue, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.returnValue);
		const returnValue = await this.userProgram.executeValueBlock (this.returnValue);
		assertIsNumber (returnValue);

		this.myRoutine.returnValue = returnValue;
	}
}

export class EntryPointBlock extends CommandBlock {
	statement: CommandBlock[];

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const statement = blockXml.getElementsByTagName ("statement");
		if (statement.length > 0 && statement[0].getAttribute ("name") === "routine") {
			this.statement = CommandBlock.constructBlock (statement[0].getElementsByTagName ("block")[0], workspace, userProgram, myRoutine);
		} else {
			this.statement = [];
		}
		this.setWorkspace (workspace);
	}

	async executeBlock () {
		assertIsDefined (this.statement);

		await this.userProgram.executeBlockList (this.statement);
	}

	setWorkspace (workspace: Blockly.Workspace | null) {
		super.setWorkspace (workspace);
		for (const commandBlock of this.statement) {
			commandBlock.setWorkspace (workspace);
		}
	}

	static constructBlock (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine) {
		const blockType = "entry_point";
		if (blockXml.getAttribute ("type") === blockType) {
			const functionBlockDefinition = BlockDefinitions.commandBlockDefinitions.find ((definition) => {
				return definition.type === blockType
			});

			if (functionBlockDefinition) {
				return [new EntryPointBlock (blockXml, workspace, userProgram, myRoutine, functionBlockDefinition.wait, functionBlockDefinition.randomSpeed)];
			}
		}
		return [];
	}
}

export class StopwatchStartBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = await this.userProgram.executeValueBlock (this.swNumber);
		assertIsNumber (swNumber);
		this.userProgram.getStopwatch (swNumber).start ();
	}
}

export class StopwatchStopBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = await this.userProgram.executeValueBlock (this.swNumber);
		assertIsNumber (swNumber);
		this.userProgram.getStopwatch (swNumber).stop ();
	}
}

export class StopwatchResetBlock extends CommandBlock {
	swNumber: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const swNumber = super.getValue ("number");
		this.swNumber = swNumber ? ValueBlockBehaviors.ValueBlock.constructBlock (swNumber, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.swNumber);

		const swNumber = await this.userProgram.executeValueBlock (this.swNumber);
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

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
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

		const threadID = await this.userProgram.executeValueBlock (this.threadID);
		assertIsString (threadID);

		assertIsDefined (this.argument1);
		assertIsDefined (this.argument2);
		assertIsDefined (this.argument3);
		const argument1 = await this.userProgram.executeValueBlock (this.argument1);
		const argument2 = await this.userProgram.executeValueBlock (this.argument2);
		const argument3 = await this.userProgram.executeValueBlock (this.argument3);
		assertIsNumber (argument1);
		assertIsNumber (argument2);
		assertIsNumber (argument3);

		const functionStatementElement = this.userProgram.getFunctionStatementElementByName (this.routineName);
		if (functionStatementElement) {
			if (this.userProgram.addThread (this.routineName, threadID, functionStatementElement.element, argument1, argument2, argument3)) {
				this.userProgram.executeThread (threadID);
			}
		} else {
			this.userProgram.mission.printError (`"${this.routineName}" という名前の関数はありません！`);
		}
	}
}

export class ThreadJoinBlock extends CommandBlock {
	threadID: ValueBlockBehaviors.ValueBlock | null;
	threadIDStr: string;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const threadID = super.getValue ("thread_name");
		this.threadID = threadID ? ValueBlockBehaviors.ValueBlock.constructBlock (threadID, userProgram, myRoutine) : null;
		this.threadIDStr = "";
	}

	async executeBlock () {
		assertIsDefined (this.threadID);

		const threadName = await this.userProgram.executeValueBlock (this.threadID);
		assertIsString (threadName);
		this.threadIDStr = threadName;
	}

	isWaiting () {
		const thread = this.userProgram.getThread (this.threadIDStr);
		if (thread) {
			return thread.isExecuting;
		} else {
			this.userProgram.mission.printError (`"${this.threadIDStr}" というスレッドは存在しません！`);
			return false;
		}
	}
}

export class MutexLockBlock extends CommandBlock {
	mutexID: ValueBlockBehaviors.ValueBlock | null;
	mutexIDStr: string;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const mutexID = super.getValue ("mutex_id");
		this.mutexID = mutexID ? ValueBlockBehaviors.ValueBlock.constructBlock (mutexID, userProgram, myRoutine) : null;
		this.mutexIDStr = "";
	}

	async executeBlock () {
		assertIsDefined (this.mutexID);

		const mutexID = await this.userProgram.executeValueBlock (this.mutexID);
		assertIsString (mutexID);
		this.mutexIDStr = mutexID;
	}

	isWaiting () {
		return !this.userProgram.lockMutex (this.mutexIDStr);
	}
}

export class MutexUnlockBlock extends CommandBlock {
	mutexID: ValueBlockBehaviors.ValueBlock | null;

	constructor (blockXml: Element, workspace: Blockly.Workspace | null, userProgram: BlockDefinitions.UserProgram, myRoutine: BlockDefinitions.Routine, wait: number, randomSpeed: boolean) {
		super (blockXml, workspace, userProgram, myRoutine, wait, randomSpeed);
		const mutexID = super.getValue ("mutex_id");
		this.mutexID = mutexID ? ValueBlockBehaviors.ValueBlock.constructBlock (mutexID, userProgram, myRoutine) : null;
	}

	async executeBlock () {
		assertIsDefined (this.mutexID);

		const mutexID = await this.userProgram.executeValueBlock (this.mutexID);
		assertIsString (mutexID);

		this.userProgram.unlockMutex (mutexID);
	}
}
