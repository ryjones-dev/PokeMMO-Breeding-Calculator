"use strict";

import { Pokemon } from "./Pokemon";

type Nullable<T> = T | null | undefined;

class BreedingNode {
    readonly pokemon: Pokemon;
    readonly parent: Nullable<BreedingNode>;
    left: Nullable<BreedingNode>;
    right: Nullable<BreedingNode>;
    private defineGender: boolean = false;

    constructor(pokemon: Pokemon, parent?: Nullable<BreedingNode>, left?: Nullable<BreedingNode>, right?: Nullable<BreedingNode>) {
        this.pokemon = pokemon;
        this.parent = parent;
        this.left = left;
        this.right = right;
    }

    static copy(breedingNode: BreedingNode): BreedingNode {
        const copy = new BreedingNode(breedingNode.pokemon, breedingNode.parent, breedingNode.left, breedingNode.right);
        copy.defineGender = breedingNode.defineGender;

        return copy;
    }

    calculateNodeCost(startingPokemonPool: Pokemon[]): number {
        // Recursive end check
        if (!this.left || !this.right) {
            return 0;
        }

        // Check if this is a valid breed
        if (this.left.pokemon.gender === this.right.pokemon.gender && this.left.pokemon.gender != "Genderless") {
            console.log("Error calculating cost: invalid pokemon combination " + this.left + " and " + this.right + " for pokemon " + this.pokemon);
            return 0;
        }

        const pokemonIndex = this.pokemon.findPokemonInStartingPool(startingPokemonPool);
        if (pokemonIndex > -1) {
            console.log("Saved money by using the following pokemon from starting pool.");
            console.log(startingPokemonPool[pokemonIndex]);
            startingPokemonPool.splice(pokemonIndex, 1);
            return 0;
        }

        // If this node is not the root note (aka if it has a parent), then check the sibling node to determine cost.
        if (this.parent) {
            // Get a reference to this breed's sibling breed
            const sibling = this.parent.left === this ? this.parent.right : this.parent.left;

            // If the sibling doesn't have a defined gender, require this one to have a defined gender.
            if (sibling && !sibling.defineGender)
                this.defineGender = true;
        }

        let cost = 20000;
        if (this.defineGender)
            cost += 5000;

        const leftCost = this.left.calculateNodeCost(startingPokemonPool);
        const rightCost = this.right.calculateNodeCost(startingPokemonPool);

        return cost + leftCost + rightCost;
    }
}

export { BreedingNode, Nullable };
