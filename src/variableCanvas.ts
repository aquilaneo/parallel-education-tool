export class VariableCanvas {
	canvas: HTMLCanvasElement | null = null;
	context: CanvasRenderingContext2D | null = null;
	screenWidth: number = 0;
	screenHeight: number = 0;
	twoDimensionalArrayAccesses: { key: string, row: number, col: number, color: string, read: boolean }[] = [];
	oneDimensionalArrayAccesses: { key: string, index: number, color: string, read: boolean }[] = [];
	globalVariableAccesses: { key: string, color: string, read: boolean }[] = [];

	initialize (canvas: HTMLCanvasElement) {
		// Canvas関係
		this.canvas = canvas;
		this.context = this.canvas.getContext ("2d");
		// 解像度設定
		this.resize ();
	}

	addTwoDimensionalArrayAccess (key: string, row: number, col: number, color: string, read: boolean = true) {
		this.twoDimensionalArrayAccesses.push ({key, row, col, color, read});
	}

	removeTwoDimensionalArrayAccess (key: string, row: number, col: number, color: string, read: boolean = true) {
		this.twoDimensionalArrayAccesses = this.twoDimensionalArrayAccesses.filter ((item) => {
			return item.key !== key && item.row !== row && item.col !== col && item.color !== color && item.read !== read;
		});
	}

	addOneDimensionalArrayAccess (key: string, index: number, color: string, read: boolean = true) {
		this.oneDimensionalArrayAccesses.push ({key, index, color, read});
	}

	removeOneDimensionalArrayAccess (key: string, index: number, color: string, read: boolean = true) {
		this.oneDimensionalArrayAccesses = this.oneDimensionalArrayAccesses.filter ((item) => {
			return item.key !== key && item.index !== index && item.color !== color && item.read !== read;
		});
	}

	addGlobalVariableAccess (key: string, color: string, read: boolean = true) {
		this.globalVariableAccesses.push ({key, color, read});
	}

	removeGlobalVariableAccess (key: string, color: string, read: boolean = true) {
		this.globalVariableAccesses = this.globalVariableAccesses.filter ((item) => {
			return item.key !== key && item.color !== color && item.read !== read;
		});
	}

	drawTable (twoDimensionalArrays: { [key: string]: number[][] }, oneDimensionalArrays: { [key: string]: number[] }, variables: { [key: string]: number }) {
		if (this.context) {
			this.context.clearRect (0, 0, this.screenWidth, this.screenHeight);

			// 各種定数
			const colors = ["rgb(240,240,240)", "rgb(224,224,224)"];
			const defaultLineWidth = this.context.lineWidth;
			const xOffset = 60;
			const yOffset = 80;
			const nameWidth = 220;
			const cellWidth = 100;
			const cellHeight = 60;
			const nameFontSize = 42;
			const indexFontSize = 24;
			const tableFontSize = 36;

			// ========== 2次元配列の表を描画 ==========
			let originX = xOffset;
			let originY = yOffset;
			for (const key of Object.keys (twoDimensionalArrays)) {
				// 配列の名前を表示
				this.context.font = `${nameFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "left";
				this.context.fillText (key, originX, originY + (twoDimensionalArrays[key].length * cellHeight) / 2 + nameFontSize / 2);

				// 表の左と上にインデックス番号を振る
				this.context.font = `${indexFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "center";
				for (let row = 0; row < twoDimensionalArrays[key].length; row++) {
					const indexX = originX + nameWidth;
					const indexY = cellHeight * row + originY;
					this.context.fillText (row.toString (), indexX - indexFontSize, indexY + indexFontSize / 2 + cellHeight / 2);
				}
				for (let col = 0; col < twoDimensionalArrays[key][0].length; col++) {
					const indexX = cellWidth * col + originX + nameWidth;
					this.context.fillText (col.toString (), indexX + cellWidth / 2, originY - indexFontSize / 2);
				}

				// 表本体を描画
				this.context.font = `${tableFontSize}px serif`;
				this.context.textAlign = "center";
				for (let row = 0; row < twoDimensionalArrays[key].length; row++) {
					for (let col = 0; col < twoDimensionalArrays[key][row].length; col++) {
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
						this.context.fillText (twoDimensionalArrays[key][row][col].toString (), cellX + cellWidth / 2, cellY + tableFontSize / 2 + cellHeight / 2);
					}
				}

				// アクセスマークを表示
				for (let row = 0; row < twoDimensionalArrays[key].length; row++) {
					for (let col = 0; col < twoDimensionalArrays[key][row].length; col++) {
						const accessesOfThisKey = this.twoDimensionalArrayAccesses.filter ((item) => {
							return item.key === key;
						});
						const accesses = accessesOfThisKey.filter ((item) => {
							return item.row === row && item.col === col;
						});

						if (accesses[0]) {
							const cellX = cellWidth * col + originX + nameWidth;
							const cellY = cellHeight * row + originY;

							this.context.strokeStyle = accesses[0].color;
							this.context.lineWidth = 4;
							this.context.strokeRect (cellX, cellY, cellWidth, cellHeight);
							this.context.lineWidth = defaultLineWidth;
						}
					}
				}

				originY += cellHeight * twoDimensionalArrays[key].length + yOffset; // 次の表に向けoriginYを加算
			}


			// ========== 1次元配列の表を描画 ==========
			for (const key of Object.keys (oneDimensionalArrays)) {
				this.context.font = `${nameFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "left";
				this.context.fillText (key, originX, originY + cellHeight / 2 + nameFontSize / 2);

				// 表の上にインデックス番号を振る
				this.context.font = `${indexFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "center";
				for (let col = 0; col < oneDimensionalArrays[key].length; col++) {
					const indexX = cellWidth * col + originX + nameWidth;
					this.context.fillText (col.toString (), indexX + cellWidth / 2, originY - indexFontSize / 2);
				}

				// 表本体を描画
				this.context.font = `${tableFontSize}px serif`;
				this.context.textAlign = "center";
				for (let index = 0; index < oneDimensionalArrays[key].length; index++) {
					// セルの左上座標を定義
					const cellX = cellWidth * index + originX + nameWidth;
					const cellY = originY;

					// セルを描画
					this.context.fillStyle = colors[index % 2];
					this.context.fillRect (cellX, cellY, cellWidth, cellHeight);

					// 枠線描画
					this.context.strokeStyle = "black";
					this.context.strokeRect (cellX, cellY, cellWidth, cellHeight);

					// 値を描画
					this.context.fillStyle = "black";
					this.context.fillText (oneDimensionalArrays[key][index].toString (), cellX + cellWidth / 2, cellY + tableFontSize / 2 + cellHeight / 2);
				}

				// アクセスマークを表示
				for (let index = 0; index < oneDimensionalArrays[key].length; index++) {
					const accessesOfThisKey = this.oneDimensionalArrayAccesses.filter ((item) => {
						return item.key === key;
					});
					const accesses = accessesOfThisKey.filter ((item) => {
						return item.index === index;
					});

					if (accesses[0]) {
						const cellX = cellWidth * index + originX + nameWidth;
						const cellY = originY;

						this.context.strokeStyle = accesses[0].color;
						this.context.lineWidth = 4;
						this.context.strokeRect (cellX, cellY, cellWidth, cellHeight);
						this.context.lineWidth = defaultLineWidth;
					}
				}
			}
			originY += cellHeight * Object.keys (oneDimensionalArrays).length + yOffset;


			// ========== グローバル変数の表を描画 ==========
			for (const key of Object.keys (variables)) {
				this.context.font = `${nameFontSize}px serif`;
				this.context.fillStyle = "black";
				this.context.textAlign = "left";
				this.context.fillText (key, originX, originY + cellHeight / 2 + nameFontSize / 2);

				// セルを描画
				this.context.font = `${tableFontSize}px serif`;
				this.context.textAlign = "center";
				// セルの左上座標を定義
				const cellX = originX + nameWidth;
				const cellY = originY;

				// セルを描画
				this.context.fillStyle = colors[0];
				this.context.fillRect (cellX, cellY, cellWidth, cellHeight);

				// 枠線描画
				this.context.strokeStyle = "black";
				this.context.strokeRect (cellX, cellY, cellWidth, cellHeight);

				// 値を描画
				this.context.fillStyle = "black";
				this.context.fillText (variables[key].toString (), cellX + cellWidth / 2, cellY + tableFontSize / 2 + cellHeight / 2);

				// アクセスマークを表示
				const accesses = this.globalVariableAccesses.filter ((item) => {
					return item.key === key;
				});

				if (accesses[0]) {
					const cellX = originX + nameWidth;
					const cellY = originY;

					this.context.strokeStyle = accesses[0].color;
					this.context.lineWidth = 4;
					this.context.strokeRect (cellX, cellY, cellWidth, cellHeight);
					this.context.lineWidth = defaultLineWidth;
				}

				originY += yOffset;
			}
		}
	}

	resize () {
		if (this.canvas) {
			this.screenWidth = this.canvas.clientWidth * window.devicePixelRatio;
			this.screenHeight = this.canvas.clientHeight * window.devicePixelRatio;
			this.canvas.setAttribute ("width", this.screenWidth.toString ());
			this.canvas.setAttribute ("height", this.screenHeight.toString ());
		}
	}
}
