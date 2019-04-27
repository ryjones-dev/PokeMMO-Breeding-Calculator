"use strict";

const ctx: Worker = self as any;

import { Pokemon } from "../Pokemon";
import { BreedingNode } from "../BreedingNode";
import { BreedingTreeFinder, BestTree } from "../BreedingTreeFinder";

function rebuildObjects(treeFinder: BreedingTreeFinder, desiredPokemon: Pokemon, startingPokemonPool: Pokemon[]) {
    const treeFinderCopy = BreedingTreeFinder.copy(treeFinder);
    const desiredPokemonCopy = Pokemon.copy(desiredPokemon);
    const startingPokemonPoolCopy = [];
    for (let i = 0; i < startingPokemonPool.length; i++) {
        const pokemon = startingPokemonPool[i];
        const pokemonCopy = Pokemon.copy(pokemon);
        startingPokemonPoolCopy.push(pokemonCopy);        
    }

    return {
        treeFinder: treeFinderCopy,
        desiredPokemon: desiredPokemonCopy,
        startingPokemonPool: startingPokemonPoolCopy
    };
}

function findBestBreedingTree(treeFinder: BreedingTreeFinder, desiredPokemon: Pokemon, startingPokemonPool: Pokemon[]): void {
    const rebuitObjects = rebuildObjects(treeFinder, desiredPokemon, startingPokemonPool);
    
    const desiredNode = new BreedingNode(rebuitObjects.desiredPokemon, null, null, null);

    rebuitObjects.treeFinder.decomposePokemon(desiredNode, true);
    const bestTree: BestTree = rebuitObjects.treeFinder.calculateBestTree(rebuitObjects.startingPokemonPool);

    ctx.postMessage({ treeFinder: rebuitObjects.treeFinder, bestTree: bestTree });
}

ctx.onmessage = (e: MessageEvent) => {
    findBestBreedingTree(e.data.treeFinder, e.data.desiredPokemon, e.data.startingPokemonPool);
};