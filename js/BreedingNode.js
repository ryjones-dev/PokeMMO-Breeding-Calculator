class BreedingNode
{
    pokemon = null;
    parent = null;
    left = null;
    right = null;
    defineGender = false;
    cost = 0;

    constructor(pokemon, parent, left, right)
    {
        if (arguments.length === 1)
        {
            Object.assign(this, pokemon);
        }
        else
        {
            this.pokemon = pokemon;
            this.parent = parent;
            this.left = left;
            this.right = right;
        }
    }

    get isRoot()
    {
        return this.parent == null;
    }

    copy()
    {
        let copy = new BreedingNode(this.pokemon, this.parent, this.left, this.right);
        copy.defineGender = this.defineGender;
        copy.cost = this.cost;

        return copy;
    }

    calculateNodeCost()
    {
        // Recursive end check
        if (this.left === null || this.right === null)
        {
            return 0;
        }

        // Check if this is a valid breed
        if (this.left.pokemon.gender === this.right.pokemon.gender && this.left.pokemon.gender != "Genderless")
        {
            console.log("Error calculating cost: invalid pokemon combination " + this.left + " and " + this.right + " for pokemon " + this.pokemon);
            return null;
        }

        // If this node is not the root note, then check the sibling node to determine cost.
        if (!this.isRoot)
        {
            // Get a reference to this breed's sibling breed
            let sibling = this.parent.left === this ? this.parent.right : this.parent.left;

                // If the sibling doesn't have a defined gender, require this one to have a defined gender.
            if (!sibling.defineGender)
                this.defineGender = true;
        }

        let cost = 20000;
        if (this.defineGender)
            cost += 5000;

        let leftCost = this.left.calculateNodeCost();
        let rightCost = this.right.calculateNodeCost();

        return cost + leftCost + rightCost;
    }
}

export { BreedingNode };
