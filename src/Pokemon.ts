"use strict";

type Gender = "Genderless" | "Male" | "Female";
type Nature = "Unknown Nature"; // TODO: Fill in all natures

class Pokemon {
    readonly gender: Gender = "Genderless";
    readonly nature: Nature = "Unknown Nature";
    readonly stats: number[] = [0, 0, 0, 0, 0, 0];

    constructor(stats: number[], gender?: Gender, nature?: Nature) {
        this.stats = stats;
        this.gender = gender || this.gender;
        this.nature = nature || this.nature;
    }

    static copy(pokemon: Pokemon): Pokemon {
        return new Pokemon(pokemon.stats, pokemon.gender, pokemon.nature);
    }

    get rank(): number {
        return this.stats.filter(stat => stat > 0).length - 1;
    }

    equals(pokemon: Pokemon): boolean {
        const thisStatsFiltered: number[] = this.stats.filter(stat => stat > 0);
        const otherStatsFiltered: number[] = pokemon.stats.filter(stat => stat > 0);

        let statsEqual: boolean = true;
        if (thisStatsFiltered.length === otherStatsFiltered.length) {
            for (let i = 0; i < this.stats.length; i++) {
                if (thisStatsFiltered[i] != otherStatsFiltered[i]) {
                    statsEqual = false;
                    break;
                }
            }

            if (statsEqual) {
                if (this.gender === pokemon.gender && this.nature === pokemon.nature)
                    return true;

                return false;
            }
        }

        return false;
    }

    // Finds an identical pokemon from the given pool. Returns the index of the pokemon in the pool or null if none is found.
    findPokemonInStartingPool(pokemonPool: Pokemon[]): number {
        for (let i = 0; i < pokemonPool.length; i++) {
            if (this.equals(pokemonPool[i])) {
                return i;
            }
        }

        return -1;
    }
}

export { Pokemon, Gender, Nature };