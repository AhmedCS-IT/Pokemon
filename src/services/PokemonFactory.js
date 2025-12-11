import Pokemon from "../entities/Pokemon.js";
import PokemonName from "../enums/PokemonName.js";
import { movesData } from "../globals.js";

export default class PokemonFactory {
    constructor(context) {
        this.context = context;
        this.pokemon = {};
        this.movesData = movesData;
    }

    load(pokemonDefinitions) {
        this.pokemon = pokemonDefinitions;
        Object.keys(pokemonDefinitions).forEach((name) => {
            PokemonName[name] = name;
        });
    }

    get(name) {
        return this.pokemon[name];
    }

    createInstance(name, level = 1) {
        const pokemon = new Pokemon(name, this.pokemon[name], level);
        
        // Load moves for this pokemon
        const pokemonData = this.pokemon[name];
        if (pokemonData && pokemonData.starterMoves) {
            pokemon.loadMoves(pokemonData.starterMoves, this.movesData);
        }
        
        return pokemon;
    }
}