class Utils	 {

	public readonly North: string;
	public readonly East: string;
	public readonly South: string;
	public readonly West: string;
	public readonly Up: string;
	public readonly Down: string;
	public readonly Directions: string[];

	public readonly Back: string;
	// public self: Utils;

	constructor() {
		this.North = "N";
		this.East = "E";
		this.South = "S";
		this.West = "W";
		this.Up = "U";
		this.Down = "D";
		this.Directions = [
			this.North,
			this.South,
			this.West,
			this.East,
			this.Up,
			this.Down,
		];
		this.Back = "B";
		// this.self = new Utils();
	}

	public getRandomIntInclusive(min: number, max: number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
		// The maximum is inclusive and the minimum is inclusive
	}

	public getRandomDirections() {
		return this.shuffle(this.Directions);
	}

	/**
	 * Given a decompressed template, return a path, start, and end
	 * @param template the decompressed template to break apart
	 */
	public uncompressTemplate(template: string) {
		return JSON.parse(LZString.decompressFromEncodedURIComponent(template));
	}

	public compressTemplate(myMaze: Maze) {
		const template = {
			MazePath: myMaze.MazePath,
			Start: JSON.stringify(myMaze.StartLocation),
			End: JSON.stringify(myMaze.EndLocation),
			BestPath: myMaze.BestPath,
			Difficulty: myMaze.MazeDifficulty,
		};
		return LZString.compressToEncodedURIComponent(JSON.stringify(template));
	}

	/**
	 * Shuffles array in place.
	 * @param {Array} array items An array containing the items.
	 */
	private shuffle(array: any) {
		let j;
		let x;
		let i;
		for (i = array.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = array[i];
			array[i] = array[j];
			array[j] = x;
		}
		return array;
	}
}
