/*
	Use the Character class to move completely randomly through the maze
	from the given starting point to the given ending point.

	It's given a generated maze grid with starting and ending points
	It will keep going any random direction until it finds the end.
	Like any other character, it can't move through walls
	Another posibility - make it a little smarter, have it navigate the way
	that the maze generating algorithm works: keep moving until you can't,
	then back up until you get to where you want to go.

*/

class MazeNavigator {

	private Utilities: Utils;
	private Character: Character;
	private MazeGrid: Cell[][][];

	constructor(mazeGrid: Cell[][][], endLocation: any) {
		this.Character = new Character("navigator", new Cell(0, 0, 0), mazeGrid, endLocation);
		this.Utilities = new Utils();
		this.MazeGrid = mazeGrid;
	}

	public navigator() {
		this.Utilities.getRandomDirections();

	}

}