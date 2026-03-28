import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

type Variable = {
    Id: number;
    Name: string;
}

export default function VariableDetail () {
    const [variable, setVariable] = useState<Variable[]>([]);

    const { id } = useParams()

        useEffect(() => {
            async function dynamicId () {
                const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/${id}?format=json`)
                const data = await response.json()
                setVariable(data.Results)   
            }
            dynamicId();
        }, [id]);

        if (variable.length === 0) {
            return <div className="container"><p>Нема данных</p></div>
        }

    return (
            <div className="container">
                <ul className="variable-list">
                {variable.map(item => (
                    <li key={item.Id}>
                        <h3>{item.Name}</h3>
                    </li>
                ))}
                </ul> 
            </div>
    )
}

