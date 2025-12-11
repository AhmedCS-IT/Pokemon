import { context } from '../../globals.js';

export default class ProgressBar {
    /**
     * A progress bar that displays a current value relative to a maximum value.
     * The bar can change colors based on percentage thresholds.
     *
     * @param {number} x - X position of the bar
     * @param {number} y - Y position of the bar
     * @param {number} width - Total width of the bar
     * @param {number} height - Height of the bar
     * @param {number} currentValue - Current value (e.g., current health)
     * @param {number} maxValue - Maximum value (e.g., max health)
     * @param {object} options - Optional settings for colors
     */
    constructor(x, y, width, height, currentValue, maxValue, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.currentValue = currentValue;
        this.maxValue = maxValue;
        
        // Color options with defaults
        this.backgroundColor = options.backgroundColor || 'rgb(200, 200, 200)';
        this.borderColor = options.borderColor || 'rgb(100, 100, 100)';
        this.highColor = options.highColor || 'rgb(0, 200, 0)'; // Green (> 50%)
        this.mediumColor = options.mediumColor || 'rgb(255, 255, 0)'; // Yellow (25-50%)
        this.lowColor = options.lowColor || 'rgb(255, 0, 0)'; // Red (<= 25%)
        
        // For experience bars, we can use a single color
        this.singleColor = options.singleColor || null;
    }

    /**
     * Update the current value of the progress bar
     * @param {number} value - New current value
     */
    setValue(value) {
        this.currentValue = Math.max(0, Math.min(value, this.maxValue));
    }

    /**
     * Get the current percentage of the bar (0-1)
     */
    getPercentage() {
        return this.maxValue > 0 ? this.currentValue / this.maxValue : 0;
    }

    /**
     * Get the appropriate color based on the current percentage
     */
    getBarColor() {
        if (this.singleColor) {
            return this.singleColor;
        }

        const percentage = this.getPercentage();
        
        if (percentage > 0.5) {
            return this.highColor; // Green
        } else if (percentage > 0.25) {
            return this.mediumColor; // Yellow
        } else {
            return this.lowColor; // Red
        }
    }

    /**
     * Render the progress bar
     */
    render() {
        const percentage = this.getPercentage();
        const fillWidth = this.width * percentage;

        context.save();

        // Draw background (empty portion)
        context.fillStyle = this.backgroundColor;
        context.fillRect(this.x, this.y, this.width, this.height);

        // Draw filled portion with smooth rendering
        if (fillWidth > 0) {
            context.fillStyle = this.getBarColor();
            context.fillRect(this.x, this.y, fillWidth, this.height);
        }

        // Draw border on top
        context.strokeStyle = this.borderColor;
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.restore();
    }
}