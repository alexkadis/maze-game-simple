class MazeView {
	public MazeGrid: Cell[][][];
	private GridWidth: number;
	public EndCell: Cell;

	constructor(public mazegrid : Cell[][][],  public endCell : Cell) {
		this.MazeGrid = mazegrid;
		this.GridWidth = mazegrid[0][0].length;
		this.EndCell = endCell;
	}
	public displayMaze() {
		
		$(`.new-button`).hide();
		$(`.desc`).show();
		$(`.gameButtons`).show();
		$(`.gameButtons`).show();
		$(`.MazeHeader`).show();
		
		let html: string = "";

		for (let layer = 0; layer < this.MazeGrid.length; layer++) {
			const layerName: string = this.getNameFromLayer(layer);

			html += `<div id="layer${layer}" class="${layerName}">`;
			html += `<h3 class="${layerName} mazeHeader"><button onclick="goDown()" class="down-button">&nbsp;</button> <span class="layer-name">${layerName}</span> <button onclick="goUp()" class="up-button">&nbsp;</button></h3>`;
			html += `<table id="layer${layer}-table class="${layerName}">`;

			for (let row = 0; row < this.MazeGrid[layer].length; row++) {
				html += "<tr class='r'>";

				for (let column = 0; column < this.GridWidth; column++) {
					const classes: string = this.getClassesFromCell(this.MazeGrid[layer][row][column]);
					html += `<td class="cell ${classes} ${layerName} y${row}x${column}">&nbsp;`;
					html += "</td>";
				}
				html += "</tr> <!-- end row -->\n";
			}
			html += "</table>";
			html += "</div>";
		}
		$("#maze-game").html(html);

		console.log(this.MazeGrid[0]);
	}
	
	private getClassesFromCell (cell: Cell) {
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
		if (this.MazeGrid[cell.Z][cell.Y][cell.X] == this.EndCell)
			classes += " end ";
		return classes;
	}

	private getNameFromLayer (layer: number) {
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