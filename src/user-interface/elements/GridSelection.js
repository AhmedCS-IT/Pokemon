import { context, input, sounds } from '../../globals.js';
import Input from '../../../lib/Input.js';
import Colour from '../../enums/Colour.js';
import Panel from './Panel.js';
import SoundName from '../../enums/SoundName.js';
import UserInterfaceElement from '../UserInterfaceElement.js';

export default class GridSelection extends Panel {
    /**
     * A 2x2 grid selection component for selecting moves.
     * Extends Panel to get the styled background.
     * Always displays 4 slots regardless of how many items are provided.
     *
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Total width of the grid
     * @param {number} height - Total height of the grid
     * @param {Array} items - Array of up to 4 items, each with { text, onSelect }
     * @param {object} options - Panel options
     */
    constructor(x, y, width, height, items = [], options = {}) {
        super(x, y, width, height, options);
        
        // Always show 4 slots, fill empty ones with "-"
        this.items = [];
        for (let i = 0; i < 4; i++) {
            if (i < items.length && items[i]) {
                this.items.push(items[i]);
            } else {
                this.items.push({ text: '-', onSelect: null });
            }
        }
        
        this.currentSelection = 0;
        
        // Grid layout: 2x2
        this.columns = 2;
        this.rows = 2;
        
        this.fontSize = UserInterfaceElement.FONT_SIZE;
        this.fontFamily = UserInterfaceElement.FONT_FAMILY;
    }

    update() {        
        // Navigate with arrow keys - using correct key names from Input.KEYS
        if (input.isKeyPressed(Input.KEYS.ARROW_RIGHT)) {
            if (this.currentSelection % this.columns < this.columns - 1) {
                this.currentSelection++;
                sounds.play(SoundName.SelectionMove);
            }
        } else if (input.isKeyPressed(Input.KEYS.ARROW_LEFT)) {
            if (this.currentSelection % this.columns > 0) {
                this.currentSelection--;
                sounds.play(SoundName.SelectionMove);
            }
        } else if (input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
            if (this.currentSelection < this.columns) {
                this.currentSelection += this.columns;
                sounds.play(SoundName.SelectionMove);
            }
        } else if (input.isKeyPressed(Input.KEYS.ARROW_UP)) {
            if (this.currentSelection >= this.columns) {
                this.currentSelection -= this.columns;
                sounds.play(SoundName.SelectionMove);
            }
        } else if (input.isKeyPressed(Input.KEYS.ENTER)) {
            this.select();
        }
        
    }

    select() {
        const selectedItem = this.items[this.currentSelection];
        // Only allow selection if there's an actual move (not empty slot with "-")
        if (selectedItem && selectedItem.onSelect && selectedItem.text !== '-') {
            selectedItem.onSelect();
        } 
    }

    render() {
        
        // Render panel background first (calls super.render())
        super.render();
        
        // Then render grid items on top
        this.renderGridItems();
        
    }

    renderGridItems() {
        const cellWidth = (this.dimensions.x - this.padding * 2) / this.columns;
        const cellHeight = (this.dimensions.y - this.padding * 2) / this.rows;
        
        const startX = this.position.x + this.padding;
        const startY = this.position.y + this.padding;
        context.save();
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.textBaseline = 'top';

        for (let i = 0; i < this.items.length; i++) {
            const row = Math.floor(i / this.columns);
            const col = i % this.columns;
            
            const cellX = startX + (col * cellWidth);
            const cellY = startY + (row * cellHeight);
            
            
            const item = this.items[i];
            
            if (i === this.currentSelection) {
                context.fillStyle = Colour.Black;
                context.font = `12px ${this.fontFamily}`; 
                context.fillText('▶', cellX, cellY + 2); 
            }
            
            // Draw text
            context.font = `${this.fontSize}px ${this.fontFamily}`; 
            context.fillStyle = item.text === '-' ? 'rgb(150, 150, 150)' : Colour.Black;
            context.fillText(
                item.text,
                cellX + 15,
                cellY
            );
        }

        context.restore();
    }
}