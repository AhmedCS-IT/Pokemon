export default class TypeEffectiveness {
    /**
     * Service class that handles type effectiveness calculations
     * based on Pokemon type matchups.
     */
    constructor() {
        // Type effectiveness chart
        // Key: moveType, Value: object with defenderType as key and multiplier as value
        this.chart = {
            'Fire': {
                'Fire': 1,
                'Water': 0.5,
                'Grass': 2,
                'Normal': 1
            },
            'Water': {
                'Fire': 2,
                'Water': 1,
                'Grass': 0.5,
                'Normal': 1
            },
            'Grass': {
                'Fire': 0.5,
                'Water': 2,
                'Grass': 1,
                'Normal': 1
            },
            'Normal': {
                'Fire': 1,
                'Water': 1,
                'Grass': 1,
                'Normal': 1
            }
        };
    }

    /**
     * Get the damage multiplier based on move type and defender type
     * @param {string} moveType - The type of the move being used
     * @param {string} defenderType - The type of the defending Pokemon
     * @returns {number} The damage multiplier (0.5, 1, or 2)
     */
    getMultiplier(moveType, defenderType) {
        if (!this.chart[moveType]) {
            return 1;
        }
        
        if (!this.chart[moveType][defenderType]) {
            return 1;
        }
        
        return this.chart[moveType][defenderType];
    }

    /**
     * Get the effectiveness message based on the multiplier
     * @param {number} multiplier - The damage multiplier
     * @returns {string|null} The message to display, or null if normal effectiveness
     */
    getEffectivenessMessage(multiplier) {
    if (multiplier >= 2) {
        return "It's super effective!";
    } else if (multiplier === 0) {
        return "It doesn't affect the enemy...";
    } else if (multiplier < 1) {
        return "It's not very effective...";
    }
    return null; // Normal effectiveness (1.0), no message
}


    /**
     * Get the sound name based on the multiplier
     * @param {number} multiplier - The damage multiplier
     * @returns {string} The sound name to play
     */
    getEffectivenessSound(multiplier) {
    if (multiplier >= 2) {
        return 'hit-super-effective';
    } else if (multiplier === 0) {
        return 'hit-not-effective';
    } else if (multiplier < 1) {
        return 'hit-not-effective';
    } else {
        return 'hit-regular'; 
    }
}
}