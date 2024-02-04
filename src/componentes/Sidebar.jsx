import { useState, useEffect } from "react";
import { Form, Link } from "react-router-dom";
import axios from "axios";


export default function Sidebar({categoria}){
    
    // Personajes cargados de la Base de datos
    const [personajesBBDD, setPersonajesBBDD] =  useState([])

    // Funcion para comparar si dentro del objeto personajes hay algo que ha escrito el usuario con el BUSCADOR
    const filtrarPersonajes = (nombres, personajesBBDD) => {
        if(!nombres){
            return personajesBBDD;
        }
        return personajesBBDD.filter((pers) => pers.nombre_personaje.toLowerCase().includes(nombres));
    }

    // useState que guarda lo que escribe el usuario en el buscador
    const [nombres, setNombres] = useState("");


    // Esta variable llama a la funcion filtrarPersonajes y sirve para mostrar los personajes filtrados
    let personajesFiltrados = filtrarPersonajes(nombres, personajesBBDD)

    
    // Funcion para ocultar el buscador al entrar a Home
    const isHome = () => {
        return categoria === "null";
    }


    useEffect(()=> {
        if(categoria == "null"){
            setPersonajesBBDD([""])
        } else {
            //axios.get(`http://localhost:8081/${categoria}`, {withCredentials: true})
            axios.get(`https://one-piece-opal.vercel.app/${categoria}`, {withCredentials: true})
            .then(res => {
                setPersonajesBBDD(res.data)
            })
            .catch(err => console.log(err))
        }
}, [categoria])



    return (
        <div id="sidebar" className="w-96 sm:p-8 sm:w-48 sm:h-full md:w-80 lg:w-96 max-sm:flex max-sm:w-full">
                <img src={`/imgs/onepiece_logo.png`} className='sm:w-80 md:w-64 lg:w-48 xl:w-64 max-sm:hidden'/>
                    <Form id="search-form" role="search" >
                        <input
                        id="buscador"
                        type="search"
                        placeholder="Buscar"
                        name="q"
                        className={isHome() ? "isHome" : "sm:w-32 sm:text-xs md:w-48 lg:w-64 max-sm:hidden"}
                        onChange={(e) => setNombres(e.target.value.toLowerCase())}
                        />
                    </Form>
                <nav className="max-sm:w-full sm:w-64 sm:mt-8">
                    <ul className="max-sm:flex max-sm:pt-0 flex-row">
                        {personajesFiltrados.map((pers, id) =>(
                            <li key={id} className="my-2 max-sm:text-xs text-lg lg:text-lg md:text-base sm:text-sm">
                                <Link to={`${pers.id_personaje}`}>
                                        {pers.nombre_personaje}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
    )
}