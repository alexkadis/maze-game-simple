declare class Utils {
    readonly North: string;
    readonly East: string;
    readonly South: string;
    readonly West: string;
    readonly Up: string;
    readonly Down: string;
    readonly Directions: string[];
    readonly Back: string;
    constructor();
    getRandomIntInclusive(min: number, max: number): number;
    getRandomDirections(): any;
    /**
     * Given a decompressed template, return a path, start, and end
     * @param template the decompressed template to break apart
     */
    getLocationsFromTemplate(template: string): {
        Path: string[];
        Start: string;
        End: string;
    };
    /**
     * Shuffles array in place.
     * @param {Array} array items An array containing the items.
     */
    private shuffle;
}
declare var LZString: {
    compressToEncodedURIComponent: (input: string) => any;
    decompressFromEncodedURIComponent: (input: string) => string;
    compress: (uncompressed: string) => any;
    _compress: (uncompressed: string, bitsPerChar: number, getCharFromInt: any) => any;
    decompress: (compressed: string) => string | null;
    _decompress: (length: number, resetValue: number, getNextValue: any) => string | null;
};
interface ICell {
    North: boolean;
    East: boolean;
    South: boolean;
    West: boolean;
    Up: boolean;
    Down: boolean;
    Z: number;
    Y: number;
    X: number;
    [direction: string]: any;
}
declare class Cell implements ICell {
    North: boolean;
    East: boolean;
    South: boolean;
    West: boolean;
    Up: boolean;
    Down: boolean;
    Z: number;
    Y: number;
    X: number;
    [direction: string]: any;
    constructor(z: number, y: number, x: number);
}
declare class Character {
    Name: string;
    CurrentLocation: any;
    PreviousLocation: any;
    MyMaze: Maze;
    private Utilities;
    constructor(name: string, myMaze: Maze);
    /**
     * If the direction parameter is valid, change the current location to that cell
     * @param direction Direction to move the character
     */
    move(direction: string): boolean;
    SetExactLocation(z: number | null, y: number | null, x: number | null): void;
    SetRelativeLocation(z: number, y: number, x: number): void;
    CanMoveDirection(direction: string): boolean | undefined;
}
interface ICharacterView {
    MyCharacter: Character;
    CharacterIcon: string;
    SolvedCharacterIcon: string;
    CurrentCharacterIcon: string;
    EndIcon: string;
    SolvedEndIcon: string;
    CurrentEndIcon: string;
    move(): any;
}
declare class HTMLCharacterView implements ICharacterView {
    MyCharacter: Character;
    CharacterIcon: string;
    SolvedCharacterIcon: string;
    EndIcon: string;
    SolvedEndIcon: string;
    CurrentCharacterIcon: string;
    CurrentEndIcon: string;
    constructor(myCharacter: Character, characterIcon: string, solvedCharacterEndIcon: string, mazeEndIcon: string, solvedMazeEndIcon: string);
    move(): void;
    private IsSolved;
}
declare class Maze {
    gridLayers: number;
    gridWidth: number;
    gridHeight: number;
    mazeTemplateCompressed?: string | undefined;
    startLocation?: any;
    endLocation?: any;
    StartLocation: any;
    EndLocation: any;
    GridLayers: number;
    GridWidth: number;
    GridHeight: number;
    MazeGrid: Cell[][][];
    MazePath: string;
    MazeTemplateCompressed: string;
    private Utilities;
    private MazeSolved;
    constructor(gridLayers: number, gridWidth: number, gridHeight: number, mazeTemplateCompressed?: string | undefined, startLocation?: any, endLocation?: any);
    SetMazeSolvedToFalse(): void;
    IsMazeSolved(currentLocation: any): boolean;
    generateGrid(): any[];
    /**
     * Given a decompressed path, returns a maze path for a procedural maze
     * @param mazeTemplateCompressed given decompressed string of directions (a path)
     */
    protected fillMazeProcedural(mazeTemplateCompressed: string): string;
    /**
     * Returns a maze path for a random maze
     */
    protected fillMazeRandom(): string;
    protected carvePathBetweenCells(currentCell: Cell, nextCell: Cell, direction: string): {
        current: Cell;
        next: Cell;
    };
    protected isEmptyCell(z: number, y: number, x: number): boolean;
    private directionModifier;
}
declare class MazeView {
    myMaze: Maze;
    private MyMaze;
    constructor(myMaze: Maze);
    displayMaze(): void;
    private getClassesFromCell;
    private getNameFromLayer;
}
declare let currentLayer: number;
declare let GridLayers: number;
declare let GridHeight: number;
declare let GridWidth: number;
declare let MyCharacter: Character;
declare let MyCharacterView: ICharacterView;
declare let Utilities: Utils;
declare let MyMaze: Maze;
declare function main(): void;
declare function showLayerHideOthers(layerChoice: number): void;
declare function goNorth(): void;
declare function goEast(): void;
declare function goSouth(): void;
declare function goWest(): void;
declare function goUp(): void;
declare function goDown(): void;
declare class MazeNavigator {
    attempts: number;
    path: string;
    private Utilities;
    private Character;
    private MyMaze;
    constructor(myMaze: Maze);
    Navigate(): void;
}
//# sourceMappingURL=maze.d.ts.map