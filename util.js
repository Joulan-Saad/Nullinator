const fs = require('node:fs');

module.exports = {
    cleanEntries: function(entry) 
    {
        var entrys = entry[0];
        for (var i = 1;i<entry.length;i++)
        {
            if(entry[i].type=="list") 
            {
                entrys = entrys.concat("\n",entrys);
                for (var a = 0;a<entry[i].items.length;a++)
                {entrys = entrys.concat("\n - ",entry[i].items[a]);}
            }
            else {entrys = entrys.concat("\n\n",entry[i]);}
            //console.log('loop1');
        }
        while (entrys != entrys.replace("@damage ", ""))
        {
            entrys = entrys.replace("@damage ", "");
            //console.log('loop2');
        }
        while (entrys != entrys.replace("@dice ", ""))
        {
            entrys = entrys.replace("@dice ", "");
            //console.log('loop3');
        }
        while (entrys != entrys.replace("@condition ", ""))
        {
            entrys = entrys.replace("@condition ", "");
            //console.log('loop3');
        }
        while (entrys != entrys.replace("@scaledamage ", ""))
        {
            entrys = entrys.replace("@scaledamage ", "");
            //console.log('loop3');
        }
        if(entrys.length>1024)
        {
            
            return "Longer than the character limit";
        }
        return entrys;
    },
    getRandomInteger: function(lower, upper)
    {
        //Returns a random integer within the upper and lower limit provided by the variables lower and upper
        
        //R = parseInt(rnd * (upper - (lower-1)) + lower)
        var multiplier = upper - (lower - 1);
        var rnd = parseInt(Math.random() * multiplier) + lower;
        console.log(rnd);
        return rnd;
    },

    cleanRange: function(range)
    {
        switch(range.type)
        {
            case "point":
                if(range.distance["type"]=='self'){return "Self"}
                return `${range.distance["amount"]} ${range.distance["type"]}`;
                break;
            
            default:
                return "Error";
        }
    },

    cleanComponents: function(comp)
    {
        var total = "";
        var bool = false;
        if(comp.v){total = total+"V";bool=true;}
        if(comp.s){if(comp.v){total=total+",";}total = total+" S";bool=true;}
        if(comp.m!=null){total = total+", M ("+ comp.m + ")";bool=true;}
        if(!bool){total = "None";}
        return total;
    },

    cleanHigherLevels: function(res)
    {
        if(res==null){return '';}

        return `\n\n**At Higher Levels:**\n${cleanEntries(res[0].entries)}`;
    },
    cleanFeatPrereqs: function(req)
    {
        var reqs = ""; 
        if (req[0].other!=undefined)
        {
            reqs += req[0].other;
        }
        if (req[0].level!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `Level: ${req[0].level}`;
        }
        if (req[0].feat!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `Feat: ${req[0].feat}`;
        }
        if (req[0].race!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs+='Race: '
            for (var a=0;a<req[0].race.length;a++)
            {
                if(a>0){reqs+=', ';}
                reqs += `${req[0].race[a].name}`;
                if(req[0].race[a].subrace!=undefined){reqs+=`(${req[0].race[a].subrace})`}
            }
        }
        if (req[0].ability!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `Abilty score: ${JSON.stringify(req[0].ability[0])}`;
        }
        if (req[0].spellcasting2020!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `Spellcasting or Pact Magic feature`;
        }
        if (req[0].spellcasting!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `The ability to cast at least one spell`;
        }
        if (req[0].proficiency!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `${JSON.stringify(req[0].proficiency[0])}`;
        }
        if (req[0].psionics!=undefined)
        {
            if(reqs!=""){reqs+="\n";}
            reqs += `Psionic Talent feature or Wild Talent feat`;
        }
        if(reqs==""){reqs+="Error";}
        return reqs;
    },
    addBalance: async function(id,amount,currency)
    {
        const user = currency.get(id);

        if (user) {
            user.balance += Number(amount);
            return user.save();
        }

        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);

        return newUser;
    },
    getBalance: function(id,currency)
    {
        const user = currency.get(id);
	    return user ? user.balance : 50;
    },
    addEntryToJsonFile: async function(jsonFilePath, newName, newValue) 
    {
        //NOT WORKING PROPERLY
        await fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
        data = JSON.parse(data);

        let newSpell = {"name": newName, "value": newValue}
      
        data.names.push(newSpell)

        await fs.writeFile(jsonFilePath,JSON.stringify(data),err => {if(err) throw err; console.log("Done writing")})
    });
  }
}
