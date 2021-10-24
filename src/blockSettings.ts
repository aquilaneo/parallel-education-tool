// ========== ブロックの定義をBlocklyに渡すファイル ==========

import Blockly from "blockly";
import {commandBlockDefinitions, valueBlockDefinitions} from "./blockDefinitions";

export const initBlocks = () => {
	// ブロック自体の定義を読み込み
	let jsonArray = [];

	// コマンドブロック
	for (const commandBlock of commandBlockDefinitions) {
		if (commandBlock.blocklyJson && !Blockly.Blocks[commandBlock.type]) {
			jsonArray.push (commandBlock.blocklyJson);
		}
	}

	// 値ブロック
	for (const valueBlock of valueBlockDefinitions) {
		if (valueBlock.blocklyJson && !Blockly.Blocks[valueBlock.type]) {
			jsonArray.push (valueBlock.blocklyJson);
		}
	}

	Blockly.defineBlocksWithJsonArray (jsonArray);
};

export const blockListToXml = (blockList: BlockList) => {
	const categories = [
		`<category name="動作">`,
		`<category name="分岐/論理" colour="%{BKY_LOGIC_HUE}">`,
		`<category name="ループ" colour="%{BKY_LOOPS_HUE}">`,
		`<category name="数学" colour="%{BKY_MATH_HUE}">`,
		`<category name="テキスト" colour="%{BKY_TEXTS_HUE}">`,
		`<category name="ローカル変数" colour="330" custom="TYPED_VARIABLE">`,
		`<category name="グローバル配列">`,
		`<category name="関数">`,
		`<category name="計測">`,
		`<category name="並列処理">`,
	];
	const categoryEnd = `</category>`;

	let xml = `<xml id="toolbox">`;
	Object.entries (blockList).forEach ((category: [string, BlockType[]], index) => {
		if (category[1].length > 0) {
			xml += categories[index];
			for (const blockList of category[1]) {
				xml += blockList;
			}
			xml += categoryEnd;
		}
	});
	xml += `</xml>`;

	return xml;
};

export interface BlockList {
	behaviors: BlockType[],
	logic: BlockType[],
	loops: BlockType[],
	math: BlockType[],
	text: BlockType[],
	localVariables: BlockType[],
	globalArrays: BlockType[],
	functions: BlockType[],
	measurement: BlockType[],
	parallel: BlockType[]
}

export enum BlockType {
	TEXT_PRINT = `
		<block type="text_print">
			<value name="TEXT">
				<shadow type="text"></shadow>
			</value>
		</block>`,
	WAIT_MS = `
		<block type="wait_ms">
			<value name="millisecond">
				<shadow type="math_number">
					<field name="NUM">1000</field>
				</shadow>
			</value>
		</block>`,
	WAIT_S = `
		<block type="wait_s">
			<value name="second">
				<shadow type="math_number">
					<field name="NUM">1</field>
				</shadow>
			</value>
		</block>`,
	CONTROLS_IF = `
		<block type="controls_if">
			<value name="IF0">
				<shadow type="logic_compare">
					<value name="A">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
					<value name="B">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
				</shadow>
			</value>
		</block>`,
	CONTROLS_IFELSE = `
		<block type="controls_ifelse">
			<value name="IF0">
				<shadow type="logic_compare">
					<value name="A">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
					<value name="B">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
				</shadow>
			</value>
		</block>`,
	LOGIC_COMPARE = `
		<block type="logic_compare">
			<value name="A">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="B">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	LOGIC_OPERATION = `
		<block type="logic_operation">
			<value name="A">
				<shadow type="logic_compare">
					<value name="A">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
					<value name="B">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
				</shadow>
			</value>
			<value name="B">
				<shadow type="logic_compare">
					<value name="A">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
					<value name="B">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
				</shadow>
			</value>
		</block>`,
	LOGIC_NEGATE = `
		<block type="logic_negate">
			<value name="BOOL">
				<shadow type="logic_compare">
					<value name="A">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
					<value name="B">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
				</shadow>
			</value>
		</block>`,
	CONTROLS_REPEAT_EXT = `
		<block type="controls_repeat_ext">
			<value name="TIMES">
				<shadow type="math_number">
					<field name="NUM">10</field>
				</shadow>
			</value>
		</block>`,
	CONTROLS_WHILEUNTIL = `
		<block type="controls_whileUntil">
			<value name="BOOL">
				<shadow type="logic_compare">
					<value name="A">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
					<value name="B">
						<shadow type="math_number">
							<field name="NUM">0</field>
						</shadow>
					</value>
				</shadow>
			</value>
		</block>`,
	MATH_NUMBER = `
		<block type="math_number">
			<field name="NUM">123</field>
		</block>`,
	MATH_ARITHMETIC = `
		<block type="math_arithmetic">
			<value name="A">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="B">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	TEXT = `
		<block type="text"></block>`,
	STR_ARITHMETIC = `
		<block type="str_arithmetic">
			<value name="A">
				<shadow type="text"></shadow>
			</value>
			<value name="B">
				<shadow type="text"></shadow>
			</value>				
		</block>`,
	LOCAL_VARIABLE_AVAILABLE = "",
	GLOBAL_VARIABLE_READ = `<block type="global_variable_read"></block>`,
	GLOBAL_VARIABLE_WRITE = `
		<block type="global_variable_write">
			<value name="value">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>
	`,
	GLOBAL_ONE_DIMENSIONAL_ARRAY_READ = `
		<block type="global_one_dimensional_array_read">
			<value name="index">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE = `
		<block type="global_one_dimensional_array_write">
			<value name="index">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="value">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	GLOBAL_TWO_DIMENSIONAL_ARRAY_READ = `
		<block type="global_two_dimensional_array_read">
			<value name="row">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="col">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE = `
		<block type="global_two_dimensional_array_write">
			<value name="row">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="col">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="value">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	FUNCTION_DEFINITION = `
		<block type="function_definition"></block>`,
	FUNCTION_CALL = `
		<block type="function_call">
			<value name="argument1">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="argument2">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="argument3">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	ENTRY_POINT = `
		<block type="entry_point"></block>`,
	GET_ARGUMENT = `
		<block type="get_argument"></block>`,
	STOPWATCH_START = `
		<block type="stopwatch_start">
			<value name="number">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	STOPWATCH_STOP = `
		<block type="stopwatch_stop">
			<value name="number">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	STOPWATCH_RESET = `
		<block type="stopwatch_reset">
			<value name="number">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	STOPWATCH_READ = `
		<block type="stopwatch_read">
			<value name="number">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	THREAD_CREATE = `
		<block type="thread_create">
			<value name="thread_name">
				<shadow type="text"></shadow>
			</value>
			<value name="argument1">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="argument2">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
			<value name="argument3">
				<shadow type="math_number">
					<field name="NUM">0</field>
				</shadow>
			</value>
		</block>`,
	THREAD_JOIN = `
		<block type="thread_join">
			<value name="thread_name">
				<shadow type="text"></shadow>
			</value>
		</block>`,
	MUTEX_LOCK = `
		<block type="mutex_lock">
			<value name="mutex_id">
				<shadow type="text"></shadow>
			</value>
		</block>`,
	MUTEX_UNLOCK = `
		<block type="mutex_unlock">
			<value name="mutex_id">
				<shadow type="text"></shadow>
			</value>
		</block>
	`
}

// ブロック一覧に載せる全命令ブロックたち
export const getAllBlockListXml = () => {
	return {
		behaviors: [BlockType.TEXT_PRINT, BlockType.WAIT_MS, BlockType.WAIT_S],
		logic: [BlockType.CONTROLS_IF, BlockType.CONTROLS_IFELSE, BlockType.LOGIC_COMPARE, BlockType.LOGIC_OPERATION, BlockType.LOGIC_NEGATE],
		loops: [BlockType.CONTROLS_REPEAT_EXT, BlockType.CONTROLS_WHILEUNTIL],
		math: [BlockType.MATH_NUMBER, BlockType.MATH_ARITHMETIC],
		text: [BlockType.TEXT, BlockType.STR_ARITHMETIC],
		localVariables: [BlockType.LOCAL_VARIABLE_AVAILABLE],
		globalArrays: [BlockType.GLOBAL_VARIABLE_READ, BlockType.GLOBAL_VARIABLE_WRITE, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_ONE_DIMENSIONAL_ARRAY_WRITE, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_READ, BlockType.GLOBAL_TWO_DIMENSIONAL_ARRAY_WRITE],
		functions: [BlockType.FUNCTION_DEFINITION, BlockType.FUNCTION_CALL, BlockType.ENTRY_POINT, BlockType.GET_ARGUMENT],
		measurement: [BlockType.STOPWATCH_START, BlockType.STOPWATCH_STOP, BlockType.STOPWATCH_RESET, BlockType.STOPWATCH_READ],
		parallel: [BlockType.THREAD_CREATE, BlockType.THREAD_JOIN, BlockType.MUTEX_LOCK, BlockType.MUTEX_UNLOCK]
	};
};
