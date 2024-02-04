import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; 
import Poderes from "../componentes/Poderes";


export default function Personaje({categoria}) {

    const { id } = useParams();
    const [personajeEncontrado, setPersonajeEncontrado] = useState([]);
    const [mostrarPoderes, setMostrarPoderes] = useState(false);


    useEffect(()=> {
        if(categoria === "null"){
            setPersonajeEncontrado([])
        } else {
            //axios.get(`http://localhost:8081/${categoria}/${id}`,{params: {categoria: categoria, id: id}} ,{withCredentials: true})
            axios.get(`https://one-piece-opal.vercel.app/db/${categoria}/${id}`,{params: {categoria: categoria, id: id}} ,{withCredentials: true})
            .then(res => {
                console.log(res.data)
                setPersonajeEncontrado(res.data);
            })
            .catch(err => console.log(err))
        }
    }, [id])

    if(!personajeEncontrado){
        return <p>No se ha encontrado el personaje</p>
    }

    return (

        <>
            {personajeEncontrado.map((pers,ident) => (
                <div key={ident} className="xl:flex h-96">

                    <div className="sm:m-8 xl:mr-0 xl:w-96  xl:h-[50rem]  2xl:w-[40rem]" id="personaje">
                        <div className="personaje-contenido text-sm lg:text-base">
                            <h2 className="text-2xl sm:text-4xl md:text-4xl font-bold py-4">{pers.nombre_personaje}</h2>
                            <p className="mb-4">{pers.descripcion_personaje}</p>
                            <p><b>Poder: </b>{pers.poder_personaje}</p>
                            <p><b>Recompensa: </b>{pers.recompensa_personaje}</p>
                            <p><b>Categoria: </b>{pers.categoria_personaje}</p>
                            <img className="imgPersonaje"  src={`/imgs/personajesimgs/${pers.imagen_personaje}`} />
                            <button className="btnPoderes" onClick={()=> setMostrarPoderes(!mostrarPoderes)}>PODERES</button>
                        </div>
                    </div>
                    <div className="xl:w-1/2">
                        {
                            mostrarPoderes && (
                                <Poderes id_personaje={id} categoria_personaje={pers.categoria_personaje}/>
                            )
                        }
                    </div>

                </div>
            ))}
        </>
    )
}