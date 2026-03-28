import { useEffect } from "react"
import { useState } from "react";
import { Link } from "react-router-dom";    

type Variable = {
    ID: number;
    Name: string;
    Description: string;
    GroupName: string;
};

export default function Variables () {
    const [allVariables, setAllVariables] = useState<Variable[]>([]);
    
    useEffect(() => {
        async function getVariables () {
            const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json');
            const data = await response.json();
            setAllVariables(data.Results);
        }
        getVariables();
    }, [])

return (
    <div className="container">
        {allVariables.map(variables => (
            <Link key={variables.ID} to={`/variables/${variables.ID}`}>
                <div className="variable-card">
                    <h3>{variables.Name}</h3>
                    <span>{variables.GroupName}</span>
                    <p dangerouslySetInnerHTML={{ __html: variables.Description}} />
                </div>
            </Link>
        ))}
    </div>
    )
}