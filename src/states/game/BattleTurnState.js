import State from '../../../lib/State.js';
import SoundName from '../../enums/SoundName.js';
import { CANVAS_HEIGHT, DEBUG, sounds, stateStack, timer } from '../../globals.js';
import Pokemon from '../../entities/Pokemon.js';
import BattleMenuState from './BattleMenuState.js';
import BattleMessageState from './BattleMessageState.js';
import BattleState from './BattleState.js';
import { oneInXChance } from '../../../lib/Random.js';
import Easing from '../../../lib/Easing.js';
import DialogueState from './DialogueState.js';
import TypeEffectiveness from '../../services/TypeEffectiveness.js';
import Panel from '../../user-interface/elements/Panel.js';
export default class BattleTurnState extends State {
	/**
	 * When Pokemon attack each other, this state takes
	 * care of lowering their health and reflecting the
	 * changes in the UI. If the Player is victorious,
	 * the Pokemon is awarded with experience based on the
	 * opponent Pokemon's stats.
	 *
	 * @param {BattleState} battleState
	 */
	constructor(battleState, selectedMove = null) {
		super();
		this.typeEffectiveness = new TypeEffectiveness();
		this.battleState = battleState;
		this.playerPokemon = battleState.playerPokemon;
		this.opponentPokemon = battleState.opponentPokemon;
		this.selectedMove = selectedMove;
		// Determine the order of attack based on the Pokemons' speed.
		if (this.playerPokemon.speed > this.opponentPokemon.speed) {
			this.firstPokemon = this.playerPokemon;
			this.secondPokemon = this.opponentPokemon;
		} else if (this.playerPokemon.speed < this.opponentPokemon.speed) {
			this.firstPokemon = this.opponentPokemon;
			this.secondPokemon = this.playerPokemon;
		} else if (oneInXChance(2)) {
			this.firstPokemon = this.playerPokemon;
			this.secondPokemon = this.opponentPokemon;
		} else {
			this.firstPokemon = this.opponentPokemon;
			this.secondPokemon = this.playerPokemon;
		}
	}

	enter() {
		this.attack(this.firstPokemon, this.secondPokemon, () => {
			if (this.checkBattleEnded()) {
				stateStack.pop();
				return;
			}

			this.attack(this.secondPokemon, this.firstPokemon, () => {
				if (this.checkBattleEnded()) {
					stateStack.pop();
					return;
				}

				stateStack.pop();
				stateStack.push(new BattleMenuState(this.battleState));
			});
		});
	}

	update() {
    this.battleState.update();
    this.battleState.playerPanel.update();
    this.battleState.opponentPanel.update();
}

/**
 * Animate the attacking Pokemon and deal damage to the defending Pokemon.
 * Move the attacker forward and back quickly to indicate an attack motion.
 *
 * @param {Pokemon} attacker
 * @param {Pokemon} defender
 * @param {function} callback
 */
attack(attacker, defender, callback) {
    // Create attack message
    let attackMessage = `${attacker.name} attacked ${defender.name}!`;
    let selectedMove = null;
    
    if (attacker === this.playerPokemon && this.selectedMove) {
        // Player is attacking with a selected move
        attackMessage = `${attacker.name} used ${this.selectedMove.name}!`;
        selectedMove = this.selectedMove;
    } else if (attacker === this.opponentPokemon) {
        // Opponent is attacking - pick a random move
        selectedMove = attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
        attackMessage = `${attacker.name} used ${selectedMove.name}!`;
    }
    
    stateStack.push(
        new BattleMessageState(
            attackMessage,
            0.5,
            () => {
                timer.tween(
                    attacker.position,
                    { x: attacker.attackPosition.x, y: attacker.attackPosition.y },
                    0.1,
                    Easing.linear,
                    () => {
                        timer.tween(
                            attacker.position,
                            { x: attacker.battlePosition.x, y: attacker.battlePosition.y },
                            0.1,
                            Easing.linear,
                            () =>
                                this.inflictDamage(
                                    attacker,
                                    defender,
                                    selectedMove,  // Pass the move here
                                    callback
                                )
                        );
                    }
                );
            }
        )
    );
}
	/**
	 * Flash the defender to indicate they were attacked.
	 * When finished, decrease the defender's health bar.
	 */
inflictDamage(attacker, defender, selectedMove, callback) {
    sounds.play(SoundName.BattleDamage);

    const action = () => {
        defender.alpha = defender.alpha === 1 ? 0.5 : 1;
    };
    const interval = 0.05;
    const duration = 0.5;

    timer.addTask(action, interval, duration, () => {
        defender.alpha = 1;

        let damage = 0;
        let effectiveness = 1;
        let effectivenessMessage = null;
        let effectivenessSound = SoundName.HitRegular;

        // Deal damage using the move (works for both player and opponent)
        if (selectedMove) {
            // Calculate type effectiveness
            effectiveness = this.typeEffectiveness.getMultiplier(
                selectedMove.type,
                defender.type
            );
            
            // Use damage formula
            const baseDamage = Math.floor(selectedMove.getDamage() / 8);
            damage = Math.max(1, Math.floor(baseDamage * effectiveness));
            
            
            // Get effectiveness message and sound
            effectivenessMessage = this.typeEffectiveness.getEffectivenessMessage(effectiveness);
            effectivenessSound = this.typeEffectiveness.getEffectivenessSound(effectiveness);
            
            
            // Apply damage
            defender.currentHealth = Math.max(0, defender.currentHealth - damage);
        } else {
            attacker.inflictDamage(defender);
        }

        // Play effectiveness sound
        if (effectivenessSound && sounds.get(effectivenessSound)) {
            sounds.play(effectivenessSound);
        } else {
            sounds.play(SoundName.BattleDamage);
        }

        timer.wait(0.05, () => {
            if (defender === this.playerPokemon) {
                this.battleState.playerPanel.forceTweenHealth();
            } else if (defender === this.opponentPokemon) {
                this.battleState.opponentPanel.forceTweenHealth();
            }
        });

        // Show effectiveness message if applicable, then continue
        if (effectivenessMessage) {
            stateStack.push(
                new BattleMessageState(effectivenessMessage, 1.0, callback)
            );
        } else {
            callback();
        }
    });
}
	checkBattleEnded() {
		if (this.playerPokemon.currentHealth <= 0) {
			this.processDefeat();
			return true;
		} else if (this.opponentPokemon.currentHealth <= 0) {
			this.processVictory();
			return true;
		}

		return false;
	}

	/**
	 * Tween the Player Pokemon off the bottom of the screen.
	 * Fade out and transition back to the PlayState.
	 */
	processDefeat() {
		sounds.play(SoundName.PokemonFaint);
		timer.tween(
			this.playerPokemon.position,
			{ y: CANVAS_HEIGHT },
			0.2,
			Easing.linear,
			() => {
				stateStack.push(
					new BattleMessageState(
						`${this.playerPokemon.name} fainted!`,
						0,
						() => this.battleState.exitBattle()
					)
				);
			}
		);
	}

	/**
	 * Tween the Opponent Pokemon off the bottom of the screen.
	 * Process experience gained by the Player Pokemon.
	 */
	processVictory() {
		sounds.play(SoundName.PokemonFaint);
		timer.tween(
			this.opponentPokemon.position,
			{ y: CANVAS_HEIGHT },
			0.4,
			Easing.linear,
			() => {
				sounds.stop(SoundName.BattleLoop);
				sounds.play(SoundName.BattleVictory);
				stateStack.push(
					new BattleMessageState('You won!', 0, () =>
						this.processExperience()
					)
				);
			}
		);
	}

	processExperience() {
    const experience = this.playerPokemon.calculateExperienceToAward(
        this.opponentPokemon
    );
    const message = `${this.playerPokemon.name} earned ${experience} experience points!`;

    stateStack.push(
        new BattleMessageState(message, 0, () => {
            // Use the panel's gainExperience method with tweening
            this.battleState.playerPanel.gainExperience(
                experience,
                () => this.processLevelUp(experience)
            );
        })
    );
}

processLevelUp(experience) {
    if (
        this.playerPokemon.currentExperience <
        this.playerPokemon.targetExperience
    ) {
        this.battleState.exitBattle();
        return;
    }

    sounds.play(SoundName.ExperienceFull);

    const oldStats = {
        health: this.playerPokemon.health,
        attack: this.playerPokemon.attack,
        defense: this.playerPokemon.defense,
        speed: this.playerPokemon.speed
    };

    this.playerPokemon.levelUp();

    const newStats = {
        health: this.playerPokemon.health,
        attack: this.playerPokemon.attack,
        defense: this.playerPokemon.defense,
        speed: this.playerPokemon.speed
    };

    stateStack.push(
        new BattleMessageState(
            `${this.playerPokemon.name} grew to LV. ${this.playerPokemon.level}!`,
            0,
            () => {
                const statMessage = 
                    `Health: ${oldStats.health} > ${newStats.health}\n` +
                    `Attack: ${oldStats.attack} > ${newStats.attack}\n` +
                    `Defense: ${oldStats.defense} > ${newStats.defense}\n` +
                    `Speed: ${oldStats.speed} > ${newStats.speed}`;
                
                // Use DialogueState with Panel.POKEMON_STATS
                stateStack.push(
                    new DialogueState(
                        statMessage,
                        Panel.POKEMON_STATS,
                        () => this.battleState.exitBattle()
                    )
                );
            }
        )
    );
}
}
