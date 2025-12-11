import Panel from "../elements/Panel.js";
import Colour from "../../enums/Colour.js";
import { context, timer } from "../../globals.js";
import Pokemon from "../../entities/Pokemon.js";
import UserInterfaceElement from "../UserInterfaceElement.js";
import ProgressBar from "../elements/ProgressBar.js";
import Easing from "../../../lib/Easing.js";

export default class BattleOpponentPanel extends Panel {
    /**
     * The Panel displayed beside the opponent's Pokemon
     * during battle that displays their name and health.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Pokemon} pokemon
     * @param {object} options Options for the super Panel.
     */
    constructor(x, y, width, height, pokemon, options = {}) {
        super(x, y, width, height, options);
        this.pokemon = pokemon;
        
        // Track the display value for smooth tweening
        this.displayHealth = pokemon.currentHealth;
        this.lastKnownHealth = pokemon.currentHealth;
        
        // Create health bar 
        this.healthBar = new ProgressBar(
            this.position.x + 65, 
            this.position.y + this.dimensions.y - 22, 
            130,  
            8,    
            this.displayHealth,
            pokemon.health
        );
        
        this.isTakingDamage = false;
    }

    update() {
    }

    /**
     * Force the health bar to tween to current health value
     * Call this immediately after dealing damage
     */
    forceTweenHealth() {
        this.isTakingDamage = false;
        this.lastKnownHealth = this.pokemon.currentHealth;
        this.tweenHealth();
    }

    /**
     * Tween the health bar when damage is taken
     */
    tweenHealth() {
        if (this.isTakingDamage) return;
        
        this.isTakingDamage = true;
        const startHealth = this.displayHealth;
        const targetHealth = this.pokemon.currentHealth;
        const healthDiff = targetHealth - startHealth;
        
        
        const duration = 0.5;
        const interval = 0.016; 
        let elapsed = 0;
        
        const updateTask = timer.addTask(() => {
            elapsed += interval;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear interpolation
            this.displayHealth = startHealth + (healthDiff * progress);
            this.healthBar.setValue(this.displayHealth);
            
            if (progress >= 1) {
                // Animation complete
                this.displayHealth = targetHealth;
                this.healthBar.setValue(this.displayHealth);
                this.isTakingDamage = false;
                updateTask.clear();
            }
        }, interval);
    }

    render() {
        super.render();
        this.renderStatistics();
    }

    /**
     * All the magic number offsets here are to
     * arrange all the pieces nicely in the space.
     */
    renderStatistics() {
        context.save();
        context.textBaseline = 'top';
        context.fillStyle = Colour.Black;
        context.font = `${UserInterfaceElement.FONT_SIZE}px ${UserInterfaceElement.FONT_FAMILY}`;
        
        // Pokemon name
        context.fillText(this.pokemon.name.toUpperCase(), this.position.x + 15, this.position.y + 12);
        
        // Level
        context.textAlign = 'right';
        context.fillText(`Lv${this.pokemon.level}`, this.position.x + this.dimensions.x - 10, this.position.y + 12);
        
        // HP label 
        context.textAlign = 'left';
        context.fillText('HP:', this.position.x + 30, this.position.y + this.dimensions.y - 25);
        
        // Render health bar
        this.healthBar.render();
        
        context.restore();
    }
}