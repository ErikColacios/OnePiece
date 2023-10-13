import { useState, useEffect } from "react";
import axios from "axios"; 


export default function Poderes ({id_personaje, categoria_personaje}) {
    
    const [poderes, setPoderes] = useState([]);

    // Busca los poderes del personaje a parti de su id y su categoria
    useEffect(()=> {
        axios.get(`http://localhost:8081/${categoria_personaje}/poderes/${id_personaje}`, {params: {id_personaje: id_personaje}}, {withCredentials: true})
        .then(res => {
            if(res.data.length == 0 ){
                setPoderes([{nombre_poder: "No se han encontrado poderes", descripcion_poder: "", video_poder: ""}]);
            }else {
                setPoderes(res.data);
            }
        })
        .catch(err => console.log(err))
    }, [id_personaje])


    return (
        <div className="poderes  sm:m-8 xl:h-[50rem] ">

            <h2 className="text-3xl sm:text-2xl md:text-4xl font-bold py-4">PODERES</h2>
            {poderes.map((poder, ident) =>  (
                <div key={ident} className="text-sm">
                    <h3 className="text-xl sm:text-xl md:text-2xl font-bold">{poder.nombre_poder}</h3>
                    <p>{poder.descripcion_poder}</p>
                    <img src={`/imgs/personajesvids/${poder.video_poder}`} className="w-full mt-4 mb-12"/>
                </div>
                
            ))}
        </div>
    )
}