"use strict";

import { Pokemon } from "./Pokemon";
import { BreedingNode, Nullable } from "./BreedingNode";

interface BestTree {
    tree: BreedingNode;
    cost: number;
}

class BreedingTreeFinder {
    private trees: BreedingNode[] = [];
    private bestTree: Nullable<BestTree>;

    constructor() {
        this.bestTree = null;
    }

    static copy(treeFinder: BreedingTreeFinder): BreedingTreeFinder {
        const treeFinderCopy = new BreedingTreeFinder();
        treeFinderCopy.trees = treeFinder.trees;
        treeFinderCopy.bestTree = treeFinder.bestTree;

        return treeFinderCopy;
    }

    // Breaks down a desired pokemon recursively into all possible trees.
    // Only use a copy on the root node so that the trees don't share nodes, but the nodes within the same tree are connected properly.
    decomposePokemon(pokemonNode: BreedingNode, useCopy: boolean): void {
        // Creates the array of output and sets the length to the rank of the pokemon.
        const combinationOutput: number[][] = [];
        const combinationLength = Math.max(pokemonNode.pokemon.rank, 0);

        if (combinationLength == 0) {
            return;
        }

        // Calculate all combinations of the calculated length of the pokemon's stats array.
        calcCombinations(pokemonNode.pokemon.stats.filter(stat => stat > 0), combinationLength, 0, combinationOutput);

        // Once all the combinations are calculated, find all pairwise combinations from the results.
        // This will give all possible combinations of pokemon stats that would result in this pokemon.
        const innerCombinationOutput: any = [];
        calcCombinations(combinationOutput, 2, 0, innerCombinationOutput);

        const trees: BreedingNode[] = [];

        for (var i = 0; i < innerCombinationOutput.length; i++) {
            // The left and right nodes for every node can be either male/female or female/male.
            // Therefore, create two nodes, one for each case.
            let breedingNodeMale: Nullable<BreedingNode> = undefined;
            let breedingNodeFemale: Nullable<BreedingNode> = undefined;

            if (useCopy) {
                breedingNodeMale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);

                // Genderless pokemon only need one breeding node.
                if (pokemonNode.pokemon.gender != "Genderless") {
                    breedingNodeFemale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);
                }
            }
            else {
                if (pokemonNode.pokemon.gender === "Male") {
                    breedingNodeMale = pokemonNode;
                    breedingNodeFemale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);
                }
                else if (pokemonNode.pokemon.gender === "Female") {
                    breedingNodeMale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);
                    breedingNodeFemale = pokemonNode;
                }
                else {
                    // Assume genderless pokemon, so only one breeding node needs to be created.
                    breedingNodeMale = pokemonNode;
                }
            }

            // Assigns two new pokemon from the combination output.
            if (breedingNodeFemale) {
                let leftPokemon = new Pokemon(innerCombinationOutput[i][0], "Male");
                let rightPokemon = new Pokemon(innerCombinationOutput[i][1], "Female");

                breedingNodeMale.left = new BreedingNode(leftPokemon, breedingNodeMale, null, null);
                breedingNodeMale.right = new BreedingNode(rightPokemon, breedingNodeMale, null, null);

                trees.push(breedingNodeMale);

                // Recursively decompose the left and right breeding nodes.
                this.decomposePokemon(breedingNodeMale.left, false);
                this.decomposePokemon(breedingNodeMale.right, false);

                leftPokemon = new Pokemon(innerCombinationOutput[i][0], "Female");
                rightPokemon = new Pokemon(innerCombinationOutput[i][1], "Male");

                breedingNodeFemale.left = new BreedingNode(leftPokemon, breedingNodeFemale, null, null);
                breedingNodeFemale.right = new BreedingNode(rightPokemon, breedingNodeFemale, null, null);

                trees.push(breedingNodeFemale);

                this.decomposePokemon(breedingNodeFemale.left, false);
                this.decomposePokemon(breedingNodeFemale.right, false);
            }
            else {
                let leftPokemon = new Pokemon(innerCombinationOutput[i][0], "Genderless");
                let rightPokemon = new Pokemon(innerCombinationOutput[i][1], "Genderless");

                breedingNodeMale.left = new BreedingNode(leftPokemon, breedingNodeMale, null, null);
                breedingNodeMale.right = new BreedingNode(rightPokemon, breedingNodeMale, null, null);

                trees.push(breedingNodeMale);

                this.decomposePokemon(breedingNodeMale.left, false);
                this.decomposePokemon(breedingNodeMale.right, false);
            }
        }

        this.trees = trees;
    }

    calculateBestTree(startingPokemonPool: Pokemon[]): BestTree {
        let lowestCost: number = Infinity;
        let lowestCostIndex: number = -1;

        for (let i = 0; i < this.trees.length; i++) {
            const startingPokemonPoolCopy = startingPokemonPool.slice();
            let treeCost = this.trees[i].calculateNodeCost(startingPokemonPoolCopy);

            if (treeCost < lowestCost) {
                lowestCost = treeCost;
                lowestCostIndex = i;
            }
        }

        console.log("Lowest cost tree index: " + lowestCostIndex);

        this.bestTree = {
            "tree": this.trees[lowestCostIndex],
            "cost": lowestCost
        }

        return this.bestTree;
    }

    getTree(index: number): BreedingNode {
        return this.trees[index];
    }
}

// Returns all combinations of a given length from a supplied set of data.
function calcCombinations(input: any, len: number, start: number, output: any, startLen?: number, result?: number[]): void {
    if (startLen === undefined)
        startLen = len;

    if (result === undefined) {
        result = [];
        result.length = startLen;
    }

    if (len === 0) {
        output.push(result.slice());
        return;
    }

    for (let i = start; i <= input.length - len; i++) {
        result[result.length - len] = input[i];
        calcCombinations(input, len - 1, i + 1, output, startLen, result);
    }
}

export { BreedingTreeFinder, BestTree };