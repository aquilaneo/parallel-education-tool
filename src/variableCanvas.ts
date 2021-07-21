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

	drowTable () {
		if (this.context) {
			this.context.clearRect (0, 0, this.screenWidth, this.screenHeight);

			// 各種定数
			const colors = ["rgb(240,240,240)", "rgb(224,224,224)"];
			const xOffset = 60;
			const yOffset = 80;
			const nameWidth = 220;
			const cellWidth = 100;
			const cellHeight = 60;
			const nameFontSize = 42;
			const indexFontSize = 24;
			const tableFontSize = 36;

			// 表を描画
			let originX = xOffset;
			let originY = yOffset;
			for (const key of Object.keys (this.twoDimensionalArrays)) {
				// 配列の名前を表示
				this.context.font = `${nameFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "left";
				this.context.fillText (key, originX, originY + (this.twoDimensionalArrays[key].length * cellHeight) / 2 + nameFontSize / 2);

				// 表の左と上にインデックス番号を振る
				this.context.font = `${indexFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "center";
				for (let row = 0; row < this.twoDimensionalArrays[key].length; row++) {
					const indexX = originX + nameWidth;
					const indexY = cellHeight * row + originY;
					this.context.fillText (row.toString (), indexX - indexFontSize, indexY + indexFontSize / 2 + cellHeight / 2);
				}
				for (let col = 0; col < this.twoDimensionalArrays[key][0].length; col++) {
					const indexX = cellWidth * col + originX + nameWidth;
					this.context.fillText (col.toString (), indexX + cellWidth / 2, originY - indexFontSize / 2);
				}

				// 表本体を描画
				this.context.font = `${tableFontSize}px serif`;
				this.context.textAlign = "center";
				for (let row = 0; row < this.twoDimensionalArrays[key].length; row++) {
					for (let col = 0; col < this.twoDimensionalArrays[key][row].length; col++) {
						// セルの左上座標を定義
						const cellX = cellWidth * col + originX + nameWidth;
						const cellY = cellHeight * row + originY;

						// セルを描画
						this.context.fillStyle = colors[(row + col) % 2];
						this.context.fillRect (cellX, cellY, cellWidth, cellHeight);

						// 枠線描画
						this.context.strokeStyle = "black";
						this.context.strokeRect (cellX, cellY, cellWidth, cellHeight);

						// 値を描画
						this.context.fillStyle = "black";
						this.context.fillText (this.twoDimensionalArrays[key][row][col].toString (), cellX + cellWidth / 2, cellY + tableFontSize / 2 + cellHeight / 2);
					}
				}

				originY += cellHeight * this.twoDimensionalArrays[key].length + yOffset; // 次の表に向けoriginYを加算
			}
		}
	}

	resize () {
		if (this.canvas) {
			this.screenWidth = this.canvas.clientWidth * window.devicePixelRatio;
			this.screenHeight = this.canvas.clientHeight * window.devicePixelRatio;
			this.canvas.setAttribute ("width", this.screenWidth.toString ());
			this.canvas.setAttribute ("height", this.screenHeight.toString ());

			this.drowTable ();
		}
	}
}
