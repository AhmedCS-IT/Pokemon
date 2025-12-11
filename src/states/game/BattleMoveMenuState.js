import State from "../../../lib/State.js";
import { stateStack, sounds } from "../../globals.js";
import GridSelection from "../../user-interface/elements/GridSelection.js";
import BattleTurnState from "./BattleTurnState.js";
import SoundName from "../../enums/SoundName.js";
import Panel from "../../user-interface/elements/Panel.js";

export default class BattleMoveMenuState extends State {
    /**
     * State that displays the player's Pokemon's moves in a 2x2 grid
     * and allows them to select which move to use.
     *
     * @param {BattleState} battleState
     */
    constructor(battleState) {
        super();
        
        this.battleState = battleState;
        this.playerPokemon = battleState.playerPokemon;
    
        // Create grid items from Pokemon's moves
        const items = this.playerPokemon.moves.map(move => ({
            text: move.name,
            onSelect: () => this.selectMove(move)
        }));
        
        
        // Use Panel.BATTLE_MOVES dimensions
        const movesPanelDef = Panel.BATTLE_MOVES;
        
        
        // Create 2x2 grid for move selection
        this.moveGrid = new GridSelection(
            movesPanelDef.x,
            movesPanelDef.y, 
            movesPanelDef.width,
            movesPanelDef.height,
            items
        );
        
    }

    enter() {
        sounds.play(SoundName.MenuOpen);
    }

    update() {
        this.moveGrid.update();
    }

    render() {
        // Render battle state underneath
        this.battleState.render();
        
        
        // Render move selection grid on top
        this.moveGrid.render();
    }

    /**
     * When a move is selected, start the battle turn with that move
     * @param {Move} move - The selected move
     */
    selectMove(move) {
        sounds.play(SoundName.SelectionChoice);
        stateStack.pop(); 
        stateStack.push(new BattleTurnState(this.battleState, move));
    }
}