export class VariableCanvas {
	canvas: HTMLCanvasElement | null = null;
	context: CanvasRenderingContext2D | null = null;
	screenWidth: number = 0;
	screenHeight: number = 0;

	oneDimensionalArrays: { [key: string]: number[] } = {};
	twoDimensionalArrays: { [key: string]: number[][] } = {};

	initialize (canvas: HTMLCanvasElement, oneDimensionalArrays: { [key: string]: number[] }, twoDimensionalArrays: { [key: string]: number[][] }) {
		// Canvas関係
		this.canvas = canvas;
		this.context = this.canvas.getContext ("2d");

		// グローバルデータ
		this.oneDimensionalArrays = oneDimensionalArrays;
		this.twoDimensionalArrays = twoDimensionalArrays;

		// リサイズ・解像度周りの処理
		window.onresize = () => {
			this.resize ();
		};
		this.resize ();
	}

	drawTable () {
		if (this.context) {
			this.context.clearRect (0, 0, this.screenWidth, this.screenHeight);

			// 各種定数
			const colors = ["rgb(240,240,240)", "rgb(224,224,224)"];
			const xOffset = 100;
			const yOffset = 60;
			const cellWidth = 100;
			const cellHeight = 60;
			const fontSize = 36;

			// 表を描画
			let y = 0;
			for (const key of Object.keys (this.twoDimensionalArrays)) {
				y += yOffset;
				for (let raw = 0; raw < this.twoDimensionalArrays[key].length; raw++) {
					for (let col = 0; col < this.twoDimensionalArrays[key][raw].length; col++) {
						const x = cellWidth * col + xOffset;

						// セルを描画
						this.context.fillStyle = colors[(raw + col) % 2];
						this.context.fillRect (x, y, cellWidth, cellHeight);

						// 枠線描画
						this.context.strokeStyle = "black";
						this.context.strokeRect (x, y, cellWidth, cellHeight);

						// 値を描画
						this.context.fillStyle = "black";
						this.context.font = `${fontSize}px serif`;

						this.context.textAlign = "center";

						this.context.fillText (this.twoDimensionalArrays[key][raw][col].toString (), x + cellWidth / 2, y + fontSize / 2 + cellHeight / 2);
					}
					y += cellHeight;
				}
			}
		}
	}

	resize () {
		if (this.canvas) {
			this.screenWidth = this.canvas.clientWidth * window.devicePixelRatio;
			this.screenHeight = this.canvas.clientHeight * window.devicePixelRatio;
			this.canvas.setAttribute ("width", this.screenWidth.toString ());
			this.canvas.setAttribute ("height", this.screenHeight.toString ());

			this.drawTable ();
		}
	}
}
