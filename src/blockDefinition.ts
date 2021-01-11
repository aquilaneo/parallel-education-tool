import Blockly from "blockly";

export const initBlocks = () => {
	Blockly.defineBlocksWithJsonArray ([
		{
			"type": "wait_s",
			"message0": "%1 秒待機",
			"args0": [
				{
					"type": "input_value",
					"name": "second",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した秒数だけ処理を停止します。",
			"helpUrl": ""
		},
		{
			"type": "local_variable_write",
			"message0": "ローカル変数 %1 %2 に %3 を書き込み",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_value",
					"name": "value",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "ローカル変数に値を書き込みます。",
			"helpUrl": ""
		},
		{
			"type": "local_variable_read",
			"message0": "ローカル変数 %1",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "ローカル変数の値を読み込みます。",
			"helpUrl": ""
		},
		{
			"type": "global_variable_write",
			"message0": "グローバル変数 %1 %2 に %3 を書き込み",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_value",
					"name": "value",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "グローバル変数に値を書き込みます。",
			"helpUrl": ""
		},
		{
			"type": "global_variable_read",
			"message0": "グローバル変数 %1",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "変数名"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "グローバル変数の値を読み込みます。",
			"helpUrl": ""
		},
		{
			"type": "function_definition",
			"message0": "関数 %1 %2 %3",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "関数名"
				},
				{
					"type": "input_dummy"
				},
				{
					"type": "input_statement",
					"name": "routine"
				}
			],
			"inputsInline": false,
			"colour": 230,
			"tooltip": "関数を定義します。",
			"helpUrl": ""
		},
		{
			"type": "function_call",
			"message0": "関数実行 %1",
			"args0": [
				{
					"type": "field_input",
					"name": "name",
					"text": "関数名"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "定義した関数を実行します。",
			"helpUrl": ""
		},
		{
			"type": "stopwatch_start",
			"message0": "ストップウォッチ %1 番スタート",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチをスタートさせます。",
			"helpUrl": ""
		},
		{
			"type": "stopwatch_stop",
			"message0": "ストップウォッチ %1 番ストップ",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチを停止します。",
			"helpUrl": ""
		},
		{
			"type": "stopwatch_reset",
			"message0": "ストップウォッチ %1 番リセット",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチをリセットします。",
			"helpUrl": ""
		},
		{
			"type": "stopwatch_read",
			"message0": "ストップウォッチ %1 番読み取り",
			"args0": [
				{
					"type": "input_value",
					"name": "number",
					"check": "Number"
				}
			],
			"inputsInline": true,
			"output": "Number",
			"colour": 230,
			"tooltip": "指定した番号のストップウォッチの値(秒)を読み取ります。",
			"helpUrl": ""
		},
		{
			"type": "thread_create",
			"message0": "スレッド名 %1 関数名 %2 を実行",
			"args0": [
				{
					"type": "input_value",
					"name": "thread_name",
					"check": "String"
				},
				{
					"type": "input_value",
					"name": "thread_function_name",
					"check": "String"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した名前のスレッドを作成します。",
			"helpUrl": ""
		},
		{
			"type": "thread_join",
			"message0": "スレッド名 %1 を終了待ち",
			"args0": [
				{
					"type": "input_value",
					"name": "thread_name",
					"check": "String"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"colour": 230,
			"tooltip": "指定した名前のスレッドの終了を待ちます。",
			"helpUrl": ""
		}
	]);
}

export const getInitialXml = () => {
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
