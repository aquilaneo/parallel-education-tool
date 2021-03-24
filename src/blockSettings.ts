// ========== ブロックの定義をBlocklyに渡すファイル ==========

import Blockly from "blockly";
import {commandBlocks} from "./blockDefinitions";

export const initBlocks = () => {
	// ブロック自体の定義を読み込み
	let jsonArray = [];
	for (const commandBlock of commandBlocks) {
		if (commandBlock.blocklyJson) {
			jsonArray.push (commandBlock.blocklyJson);
		}
	}

	Blockly.defineBlocksWithJsonArray (jsonArray);
}

// ブロック一覧に載せるブロックたち
export const getBlockListXml = () => {
	return `
	<xml id="toolbox">
		<category name="動作">
			<block type="text_print">
            	<value name="TEXT">
            		<shadow type="text"></shadow>
				</value>
			</block>
			
			<block type="wait_s">
				<value name="second">
					<shadow type="math_number">
						<field name="NUM">1</field>
					</shadow>
				</value>
			</block>
		</category>
		
		
		
		<category name="分岐/論理" colour="%{BKY_LOGIC_HUE}">
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
			</block>
			
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
			</block>
			
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
			</block>
			
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
			</block>
			
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
			</block>
		</category>
	
	
        <category name="ループ" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
                <value name="TIMES">
                    <shadow type="math_number">
                        <field name="NUM">10</field>
                    </shadow>
                </value>
            </block>
            
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
			</block>
        </category>
        
        
        <category name="数学" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
                <field name="NUM">123</field>
            </block>
            
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
			</block>
        </category>
        
        
        <category name="テキスト" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
        </category>
        
        
        
        <category name="変数">
        	<block type="local_variable_write">
        		<value name="value">
        			<shadow type="math_number">
        				<field name="NUM">0</field>
					</shadow>
				</value>
			</block>
			
			<block type="local_variable_read"></block>
			
			<block type="global_variable_write">
			     <value name="value">
        			<shadow type="math_number">
        				<field name="NUM">0</field>
					</shadow>
				</value>
			</block>
			
			<block type="global_variable_read"></block>
		</category>
		
		
		
		<category name="関数">
			<block type="function_definition"></block>
			<block type="function_call"></block>
		</category>
		
		
		
		<category name="計測">
			<block type="stopwatch_start">
				<value name="number">
					<shadow type="math_number">
						<field name="NUM">0</field>
					</shadow>
				</value>
			</block>
			
			<block type="stopwatch_stop">
				<value name="number">
					<shadow type="math_number">
						<field name="NUM">0</field>
					</shadow>
				</value>
			</block>
			<block type="stopwatch_reset">
				<value name="number">
					<shadow type="math_number">
						<field name="NUM">0</field>
					</shadow>
				</value>
			</block>
			<block type="stopwatch_read">
				<value name="number">
					<shadow type="math_number">
						<field name="NUM">0</field>
					</shadow>
				</value>
			</block>
		</category>
		
		
		
		<category name="並列処理">
			<block type="thread_create">
				<value name="thread_name">
					<shadow type="text"></shadow>
				</value>
				<value name="thread_function_name">
					<shadow type="text"></shadow>
				</value>
			</block>
			<block type="thread_join">
				<value name="thread_name">
					<shadow type="text"></shadow>
				</value>
			</block>
		</category>
    </xml>
	`;
}
