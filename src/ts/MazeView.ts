class MazeView {
	private MyMaze: Maze;

	constructor(public myMaze: Maze) {
		this.MyMaze = myMaze;
	}

	public displayMaze() {
		// $(`#play-again`).hide();

		let html: string = "";

		for (let layer = 0; layer < this.MyMaze.MazeGrid.length; layer++) {
			const layerName: string = this.getNameFromLayer(layer);

			html += `<div id="layer${layer}" class="${layerName}">`;
			html += `<h3 class="${layerName} maze-header">`
				+  `<button onclick="goDown()" class="down-button" aria-label="Move Back">&nbsp;</button>`
				 +	`<span class="${layerName} layer-name">${layerName}</span>`
				+	`<button onclick="goUp()" class="up-button" aria-label="Move Forward">&nbsp;</button>`
				 +	`</h3>`;
			html += `<table id="layer${layer}-table" class="maze-table ${layerName}">`;

			for (let row = 0; row < this.MyMaze.MazeGrid[layer].length; row++) {
				html += "<tr class='r'>";

				for (let column = 0; column < this.MyMaze.GridWidth; column++) {
					const classes: string = this.getClassesFromCell(this.MyMaze.MazeGrid[layer][row][column]);
					html += `<td class="cell ${classes} ${layerName} y${row}x${column}">&nbsp;`;
					html += "</td>";
				}
				html += "</tr> <!-- end row -->\n";
			}
			html += "</table>";
			html += "</div>";
		}

		(document.body.querySelector("#maze-game") as HTMLElement).innerHTML = html;
	}

	private getClassesFromCell(cell: Cell) {
		let classes: string = "";

		if (!cell.North)
			classes += " top ";
		if (!cell.East)
			classes += " right ";
		if (!cell.South)
			classes += " bottom ";
		if (!cell.West)
			classes += " left ";
		if (!cell.Up)
			classes += " up ";
		if (!cell.Down)
			classes += " down ";
		if ({ Z: cell.Z, Y: cell.Y, X: cell.X } === this.MyMaze.EndLocation)
			classes += " end ";
		return classes;
	}

	private getNameFromLayer(layer: number) {
		switch (layer) {
			case 0:
				return "winter";
			case 1:
				return "spring";
			case 2:
				return "summer";
			case 3:
				return "fall";
			default:
				return "";
		}
	}
}
