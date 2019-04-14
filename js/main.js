"use strict";

import { Pokemon } from "./Pokemon.js";
import { BreedingTreeFinder } from "./BreedingTreeFinder.js";

function createPokemon()
{
    let hp = document.getElementById("hp").checked;
    let att = document.getElementById("att").checked;
    let def = document.getElementById("def").checked;
    let spAtt = document.getElementById("spAtt").checked;
    let spDef = document.getElementById("spDef").checked;
    let spd = document.getElementById("spd").checked;
    let gender = document.getElementById("gender").value;

    let startingPokemonDiv = document.getElementById("startingPokemonDiv");

    let startingPokemon = [];
    for (let i = 0; i < startingPokemonDiv.childNodes.length; i++)
    {
        let currentPokemonData = startingPokemonDiv.childNodes[i];
        let startingPokemonData = [];
        for (let j = 0; j < currentPokemonData.childNodes.length - 1; j++)
        {
            let currentStatData = currentPokemonData.childNodes[j];
            currentStatData = currentStatData.querySelector("input") || currentPokemonData.querySelector("select");

            if (currentStatData.checked != undefined)
            {
                startingPokemonData.push(currentStatData.checked);
            }
            else
            {
                startingPokemonData.push(currentStatData.value);
            }
        }

        // Convert the inputted data into a Pokemon class
        let statArray = [startingPokemonData[0] ? 1 : 0, startingPokemonData[1] ? 2 : 0, startingPokemonData[2] ? 3 : 0,
        startingPokemonData[3] ? 4 : 0, startingPokemonData[4] ? 5 : 0, startingPokemonData[5] ? 6 : 0];
        let pokemon = new Pokemon(statArray, startingPokemonData[6]);

        startingPokemon.push(pokemon);
    }

    let desired = new Pokemon([hp ? 1 : 0, att ? 2 : 0, def ? 3 : 0,
                            spAtt ? 4 : 0, spDef ? 5 : 0, spd ? 6 : 0], gender);
    let treeFinder = new BreedingTreeFinder(desired, startingPokemon);

    document.getElementById("treeSubmit").onclick = () =>
    {
        let treeID = document.getElementById("treeID").value;
        console.log(treeFinder.trees[treeID]);
    };

    document.getElementById("costSubmit").onclick = () =>
    {
        console.log("Lowest Cost: " + treeFinder.calculateLowestCost());
    };
}

function createStartingPokemonControls()
{
    let startingPokemonDiv = document.getElementById("startingPokemonDiv");

    let pokemonDataDiv = document.createElement("div");
    pokemonDataDiv.id = "pokemonData";
    startingPokemonDiv.appendChild(pokemonDataDiv);

    let hpLabel = document.createElement("label");
    hpLabel.innerHTML = "HP IV: ";
    let hpIVCheckbox = document.createElement("input");
    hpIVCheckbox.type = "checkbox";
    hpLabel.appendChild(hpIVCheckbox);
    pokemonDataDiv.appendChild(hpLabel);

    let attLabel = document.createElement("label");
    attLabel.innerHTML = "ATT IV: ";
    let attIVCheckbox = document.createElement("input");
    attIVCheckbox.type = "checkbox";
    attLabel.appendChild(attIVCheckbox);
    pokemonDataDiv.appendChild(attLabel);

    let defLabel = document.createElement("label");
    defLabel.innerHTML = "DEF IV: ";
    let defIVCheckbox = document.createElement("input");
    defIVCheckbox.type = "checkbox";
    defLabel.appendChild(defIVCheckbox);
    pokemonDataDiv.appendChild(defLabel);

    let spAttLabel = document.createElement("label");
    spAttLabel.innerHTML = "SPATT IV: ";
    let spAttIVCheckbox = document.createElement("input");
    spAttIVCheckbox.type = "checkbox";
    spAttLabel.appendChild(spAttIVCheckbox);
    pokemonDataDiv.appendChild(spAttLabel);

    let spDefLabel = document.createElement("label");
    spDefLabel.innerHTML = "SPDEF IV: ";
    let spDefIVCheckbox = document.createElement("input");
    spDefIVCheckbox.type = "checkbox";
    spDefLabel.appendChild(spDefIVCheckbox);
    pokemonDataDiv.appendChild(spDefLabel);

    let speedLabel = document.createElement("label");
    speedLabel.innerHTML = "SPEED IV: ";
    let speedIVCheckbox = document.createElement("input");
    speedIVCheckbox.type = "checkbox";
    speedLabel.appendChild(speedIVCheckbox);
    pokemonDataDiv.appendChild(speedLabel);

    let genderLabel = document.createElement("label");
    genderLabel.innerHTML = "GENDER: ";
    let genderDropdown = document.createElement("select");
    let genderlessOption = document.createElement("option");
    genderlessOption.value = genderlessOption.innerHTML = "Genderless";
    let genderMaleOption = document.createElement("option");
    genderMaleOption.value = genderMaleOption.innerHTML = "Male";
    let genderFemaleOption = document.createElement("option");
    genderFemaleOption.value = genderFemaleOption.innerHTML = "Female";

    genderDropdown.appendChild(genderlessOption);
    genderDropdown.appendChild(genderMaleOption);
    genderDropdown.appendChild(genderFemaleOption);
    genderLabel.appendChild(genderDropdown);
    pokemonDataDiv.appendChild(genderLabel);

    let removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove";
    removeButton.onclick = () =>
    {
        pokemonDataDiv.remove();
    };
    pokemonDataDiv.appendChild(removeButton);
}

window.onload = function()
{
    document.getElementById("submit").onclick = createPokemon;
    document.getElementById("addStartingPokemon").onclick = createStartingPokemonControls;
}
