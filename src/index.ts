"use strict";

import Worker from "./worker/index";
import { Pokemon, Gender } from "./Pokemon";
import { BreedingNode, Nullable } from "./BreedingNode";
import { BreedingTreeFinder, BestTree } from "./BreedingTreeFinder";

interface TreeFinderData {
    treeFinder: BreedingTreeFinder;
    bestTree: BestTree;
}

async function createPokemon(): Promise<void> {
    const hp: boolean = (document.getElementById("hp") as HTMLInputElement).checked;
    const att: boolean = (document.getElementById("att") as HTMLInputElement).checked;
    const def: boolean = (document.getElementById("def") as HTMLInputElement).checked;
    const spAtt: boolean = (document.getElementById("spAtt") as HTMLInputElement).checked;
    const spDef: boolean = (document.getElementById("spDef") as HTMLInputElement).checked;
    const spd: boolean = (document.getElementById("spd") as HTMLInputElement).checked;
    const gender: Gender = (document.getElementById("gender") as HTMLInputElement).value as Gender;

    const startingPokemonDiv = document.getElementById("startingPokemonDiv");
    if (startingPokemonDiv) {
        const startingPokemonPool: Pokemon[] = [];
        let startingPokemonGender: Gender = "Genderless";
        for (let i = 0; i < startingPokemonDiv.childNodes.length; i++) {
            const currentPokemonData = startingPokemonDiv.childNodes[i];
            const startingPokemonStats = [];
            for (let j = 0; j < currentPokemonData.childNodes.length - 1; j++) {
                const currentStatData = (currentPokemonData.childNodes[j] as HTMLElement).querySelector("input") || (currentPokemonData.childNodes[j] as HTMLElement).querySelector("select");
                if (currentStatData) {
                    if (currentStatData instanceof HTMLInputElement) {
                        startingPokemonStats.push(currentStatData.checked);
                    }
                    else {
                        startingPokemonGender = currentStatData.value as Gender;
                    }
                }
            }

            // Convert the inputted data into a Pokemon class
            const statArray = startingPokemonStats.map((currentValue: boolean, index: number) => {
                if (currentValue)
                    return index + 1;
                else
                    return 0;
            });

            const pokemon = new Pokemon(statArray, startingPokemonGender);
            startingPokemonPool.push(pokemon);
        }

        const desired = new Pokemon([hp ? 1 : 0, att ? 2 : 0, def ? 3 : 0,
        spAtt ? 4 : 0, spDef ? 5 : 0, spd ? 6 : 0], gender);

        const treeFinderData = await findBestBreedingTree(desired, startingPokemonPool);
        if (treeFinderData) {
            console.log("Tree finder results: ");
            console.log(treeFinderData);

            const treeSubmit = document.getElementById("treeSubmit");
            if (treeSubmit) {
                treeSubmit.onclick = () => {
                    const treeID = Number.parseInt((document.getElementById("treeID") as HTMLInputElement).value);
                    console.log(treeFinderData.treeFinder.getTree(treeID));
                };
            }

            const costSubmit = document.getElementById("costSubmit");
            if (costSubmit) {
                costSubmit.onclick = () => {
                    console.log("Lowest Cost: " + treeFinderData.treeFinder.calculateBestTree(startingPokemonPool).cost);
                };
            }
        }
    }
}

async function findBestBreedingTree(desiredPokemon: Pokemon, startingPokemonPool: Pokemon[]): Promise<Nullable<TreeFinderData>> {
    const startTime = Date.now();

    if (desiredPokemon.rank === -1) {
        alert("No desired perfect IVs, select at least one perfect IV.");
        return;
    }

    const pokemonIndex = desiredPokemon.findPokemonInStartingPool(startingPokemonPool);
    if (pokemonIndex > -1) {
        alert("You already have the desired Pokemon!");
        return;
    }

    const treeFinder = new BreedingTreeFinder();

    return new Promise((resolve) => {
        if (typeof (Worker) !== "undefined") {
            const worker = new Worker();
            worker.postMessage({ treeFinder, desiredPokemon, startingPokemonPool });
            worker.onmessage = (e: MessageEvent) => {
                const treeFinderData: TreeFinderData = e.data;
    
                const endTime = Date.now();
                console.log(endTime - startTime + "ms");
    
                worker.terminate();
    
                resolve({
                    treeFinder: treeFinderData.treeFinder,
                    bestTree: treeFinderData.bestTree
                });
            };
        }
        else {
            console.log("Web workers not supported. Webpage may freeze when calculating breeding trees. Consider upgrading your browser to prevent freezing.");
    
            const desiredNode = new BreedingNode(desiredPokemon, null, null, null);
    
            treeFinder.decomposePokemon(desiredNode, true);
            const bestTree = treeFinder.calculateBestTree(startingPokemonPool);
    
            resolve({
                treeFinder: treeFinder,
                bestTree: bestTree
            });
        }
    });
}

function createStartingPokemonControls(): void {
    const startingPokemonDiv = document.getElementById("startingPokemonDiv");
    if (startingPokemonDiv) {
        const pokemonDataDiv = document.createElement("div");
        pokemonDataDiv.id = "pokemonData";
        startingPokemonDiv.appendChild(pokemonDataDiv);

        const hpLabel = document.createElement("label");
        hpLabel.innerHTML = "HP IV: ";
        const hpIVCheckbox = document.createElement("input");
        hpIVCheckbox.type = "checkbox";
        hpLabel.appendChild(hpIVCheckbox);
        pokemonDataDiv.appendChild(hpLabel);

        const attLabel = document.createElement("label");
        attLabel.innerHTML = "ATT IV: ";
        const attIVCheckbox = document.createElement("input");
        attIVCheckbox.type = "checkbox";
        attLabel.appendChild(attIVCheckbox);
        pokemonDataDiv.appendChild(attLabel);

        const defLabel = document.createElement("label");
        defLabel.innerHTML = "DEF IV: ";
        const defIVCheckbox = document.createElement("input");
        defIVCheckbox.type = "checkbox";
        defLabel.appendChild(defIVCheckbox);
        pokemonDataDiv.appendChild(defLabel);

        const spAttLabel = document.createElement("label");
        spAttLabel.innerHTML = "SPATT IV: ";
        const spAttIVCheckbox = document.createElement("input");
        spAttIVCheckbox.type = "checkbox";
        spAttLabel.appendChild(spAttIVCheckbox);
        pokemonDataDiv.appendChild(spAttLabel);

        const spDefLabel = document.createElement("label");
        spDefLabel.innerHTML = "SPDEF IV: ";
        const spDefIVCheckbox = document.createElement("input");
        spDefIVCheckbox.type = "checkbox";
        spDefLabel.appendChild(spDefIVCheckbox);
        pokemonDataDiv.appendChild(spDefLabel);

        const speedLabel = document.createElement("label");
        speedLabel.innerHTML = "SPEED IV: ";
        const speedIVCheckbox = document.createElement("input");
        speedIVCheckbox.type = "checkbox";
        speedLabel.appendChild(speedIVCheckbox);
        pokemonDataDiv.appendChild(speedLabel);

        const genderLabel = document.createElement("label");
        genderLabel.innerHTML = "GENDER: ";
        const genderDropdown = document.createElement("select");
        const genderlessOption = document.createElement("option");
        genderlessOption.value = genderlessOption.innerHTML = "Genderless";
        const genderMaleOption = document.createElement("option");
        genderMaleOption.value = genderMaleOption.innerHTML = "Male";
        const genderFemaleOption = document.createElement("option");
        genderFemaleOption.value = genderFemaleOption.innerHTML = "Female";

        genderDropdown.appendChild(genderlessOption);
        genderDropdown.appendChild(genderMaleOption);
        genderDropdown.appendChild(genderFemaleOption);
        genderLabel.appendChild(genderDropdown);
        pokemonDataDiv.appendChild(genderLabel);

        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.onclick = () => {
            pokemonDataDiv.remove();
        };
        pokemonDataDiv.appendChild(removeButton);
    }
}

window.onload = function () {
    const submit = document.getElementById("submit");
    if (submit)
        submit.onclick = createPokemon;

    const addStartingPokemon = document.getElementById("addStartingPokemon");
    if (addStartingPokemon)
        addStartingPokemon.onclick = createStartingPokemonControls;
}
