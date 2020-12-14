export const initBlocks = () => {

}

export const getInitialXml = () => {
	return `
	<xml id="toolbox">
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
            
            <block type="text_print">
            	<value name="TEXT">
            		<shadow type="text"></shadow>
				</value>
			</block>
        </category>
    </xml>
	`;
}
