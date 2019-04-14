class Pokemon
{
    statsArray = [];
    gender = "Genderless";
    nature = "Unknown Nature";

    constructor(statsArray, gender, nature)
    {
        if (arguments.length === 1)
        {
            Object.assign(this, statsArray);
        }
        else
        {
            for (var i = 0; i < 6; i++)
            {
                if (statsArray.includes(i + 1))
                {
                    this.statsArray.push(i + 1);
                }
                else
                {
                    this.statsArray.push(0);
                }
            }
    
            this.gender = gender || this.gender;
            this.nature = nature || this.nature;
        }
    }

    get rank()
    {
        return this.statsArray.filter(stat => stat > 0).length - 1;
    }

    equals(pokemon)
    {
        let statsEqual = true;
        for (let i = 0; i < this.statsArray.length; i++)
        {
            if (this.statsArray[i] != pokemon.statsArray[i])
            {
                statsEqual = false;
                break;
            }
        }

        if (statsEqual)
        {
            if (this.gender === pokemon.gender && this.nature === pokemon.nature)
                return true;

            return false;
        }

        return false;
    }
}

export { Pokemon };