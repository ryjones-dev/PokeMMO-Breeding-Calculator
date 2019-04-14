import { Pokemon } from "./Pokemon.js";
import { BreedingNode } from "./BreedingNode.js";

class BreedingTreeFinder
{
    desiredPokemon = null;
    startingPokemon = [];

    trees = [];
    bestTree = null;

    constructor(desiredPokemon, startingPokemon)
    {
        this.desiredPokemon = desiredPokemon;
        this.startingPokemon = startingPokemon;

        if (this.desiredPokemon.statsArray.filter(stat => stat > 0).length === 0)
        {
            alert("No desired perfect IVs, select at least one perfect IV.");
            return;
        }

        let pokemonIndex = this.desiredPokemon.findPokemonInStartingPool(this.startingPokemon);
        if(pokemonIndex > -1)
        {
            alert("You already have the desired Pokemon!");
            return;
        }

        let desiredNode = new BreedingNode(this.desiredPokemon, null, null, null);
        this.trees = this.decomposePokemon(desiredNode, true);
    }

    // Breaks down a desired pokemon recursively into all possible trees.
    // Only use a copy on the root node so that the trees don't share nodes, but the nodes within the same tree are connected properly.
    decomposePokemon(pokemonNode, useCopy)
    {
        // Creates the array of output and sets the length to the rank of the pokemon.
        let combinationOutput = [];
        let combinationLength = Math.max(pokemonNode.pokemon.rank, 0);

        if (combinationLength == 0)
        {
            return [];
        }

        // Calculate all combinations of the calculated length of the pokemon's stats array.
        calcCombinations(pokemonNode.pokemon.statsArray.filter(stat => stat > 0), combinationLength, 0, combinationOutput);

        // Once all the combinations are calculated, find all pairwise combinations from the results.
        // This will give all possible combinations of pokemon stats that would result in this pokemon.
        let innerCombinationOutput = [];
        calcCombinations(combinationOutput, 2, 0, innerCombinationOutput);

        let nodeArray = [];

        for (var i = 0; i < innerCombinationOutput.length; i++)
        {
            // The left and right nodes for every node can be either male/female or female/male.
            // Therefore, create two nodes, one for each case.
            let breedingNodeMale = undefined;
            let breedingNodeFemale = undefined;

            if (useCopy)
            {
                breedingNodeMale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);

                // Genderless pokemon only need one breeding node.
                if (pokemonNode.pokemon.gender != "Genderless")
                {
                    breedingNodeFemale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);
                }
            }
            else
            {
                if (pokemonNode.pokemon.gender === "Male")
                {
                    breedingNodeMale = pokemonNode;
                    breedingNodeFemale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);
                }
                else if (pokemonNode.pokemon.gender === "Female")
                {
                    breedingNodeMale = new BreedingNode(pokemonNode.pokemon, pokemonNode.parent, null, null);
                    breedingNodeFemale = pokemonNode;
                }
                else
                {
                    // Assume genderless pokemon, so only one breeding node needs to be created.
                    breedingNodeMale = pokemonNode;
                }                
            }

            // Assigns two new pokemon from the combination output.
            if (breedingNodeFemale)
            {
                let leftPokemon = new Pokemon(innerCombinationOutput[i][0], "Male", null);
                let rightPokemon = new Pokemon(innerCombinationOutput[i][1], "Female", null);

                breedingNodeMale.left = new BreedingNode(leftPokemon, breedingNodeMale, null, null);
                breedingNodeMale.right = new BreedingNode(rightPokemon, breedingNodeMale, null, null);

                nodeArray.push(breedingNodeMale);

                // Recursively decompose the left and right breeding nodes.
                this.decomposePokemon(breedingNodeMale.left, false);
                this.decomposePokemon(breedingNodeMale.right, false);

                leftPokemon = new Pokemon(innerCombinationOutput[i][0], "Female", null);
                rightPokemon = new Pokemon(innerCombinationOutput[i][1], "Male", null);

                breedingNodeFemale.left = new BreedingNode(leftPokemon, breedingNodeFemale, null, null);
                breedingNodeFemale.right = new BreedingNode(rightPokemon, breedingNodeFemale, null, null);

                nodeArray.push(breedingNodeFemale);

                this.decomposePokemon(breedingNodeFemale.left, false);
                this.decomposePokemon(breedingNodeFemale.right, false);
            }
            else
            {
                let leftPokemon = new Pokemon(innerCombinationOutput[i][0], "Genderless", null);
                let rightPokemon = new Pokemon(innerCombinationOutput[i][1], "Genderless", null);

                breedingNodeMale.left = new BreedingNode(leftPokemon, breedingNodeMale, null, null);
                breedingNodeMale.right = new BreedingNode(rightPokemon, breedingNodeMale, null, null);

                nodeArray.push(breedingNodeMale);

                this.decomposePokemon(breedingNodeMale.left, false);
                this.decomposePokemon(breedingNodeMale.right, false);
            }
        }

        return nodeArray;
    }

    calculateLowestCost()
    {
        let lowestCost = Infinity;
        let lowestCostIndex = -1;

        for(let i = 0; i < this.trees.length; i++)
        {
            let startingPokemon = this.startingPokemon.slice();
            let treeCost = this.trees[i].calculateNodeCost(startingPokemon);

            if (treeCost < lowestCost)
            {
                lowestCost = treeCost;
                lowestCostIndex = i;
            }
        }

        console.log("Lowest cost tree index: " + lowestCostIndex);

        return lowestCost;
    }
}

// Returns all combinations of a given length from a supplied set of data.
function calcCombinations(input, len, start, output, startLen, result)
{
    if (startLen === undefined) startLen = len;
    if (result === undefined)
    {
        result = [];
        result.length = startLen;
    }

    if (len === 0)
    {
        output.push(result.slice());
        return;
    }

    for (var i = start; i <= input.length - len; i++)
    {
        result[result.length - len] = input[i];
        calcCombinations(input, len - 1, i + 1, output, startLen, result);
    }
}

export { BreedingTreeFinder };