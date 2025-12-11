import State from "../../../lib/State.js";
import Menu from "../../user-interface/elements/Menu.js";
import BattleMessageState from "./BattleMessageState.js";
import BattleState from "./BattleState.js";
import BattleMoveMenuState from "./BattleMoveMenuState.js";
import { stateStack, sounds } from "../../globals.js";
import SoundName from "../../enums/SoundName.js";
export default class BattleMenuState extends State {
	static MENU_OPTIONS = {
		Fight: "FIGHT",
		Status: "STATUS",
		Run: "RUN"
	}

	/**
	 * Represents the menu during the battle that the Player can choose an action from.
	 *
	 * @param {BattleState} battleState
	 */
	constructor(battleState) {
		super();

		this.battleState = battleState;

		const items = [
			{ text: BattleMenuState.MENU_OPTIONS.Fight, onSelect: () => this.fight() },
			{ text: BattleMenuState.MENU_OPTIONS.Status, onSelect: () => this.status() },
			{ text: BattleMenuState.MENU_OPTIONS.Run, onSelect: () => this.run()}
		];

		this.battleMenu = new Menu(
			Menu.BATTLE_MENU.x,
			Menu.BATTLE_MENU.y,
			Menu.BATTLE_MENU.width,
			Menu.BATTLE_MENU.height,
			items,
		);
	}

	update() {
		this.battleMenu.update();
		this.battleState.update();
	}

	render() {
		this.battleMenu.render();
	}

	fight() {
    	stateStack.pop();
    	stateStack.push(new BattleMoveMenuState(this.battleState));
	}

	status() {
		stateStack.push(new BattleMessageState(`You're doing great!`, 2));
	}
	
	run(){
		sounds.stop(SoundName.BattleLoop);
		sounds.play(SoundName.Route);
		stateStack.pop();
		stateStack.pop();
		stateStack.push(new BattleMessageState(`You fled successfully!`, 2));

	}
}
