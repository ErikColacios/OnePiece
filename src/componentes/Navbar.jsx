import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import iconoSombrero from "../appimgs/icono-sombrero.png";
import iconoCraneo from "../appimgs/icono-craneo.png";
import iconoCorona from "../appimgs/icono-corona.png";
import iconoMarine from "../appimgs/icono-marine.png";


export default function Navbar(){

    const [datosUsuario, setDatosUsuario] = useState([])
    const [botonPerfil, setBotonPerfil] = useState(false)
    
    useEffect(()=> {
        const fetchData = async () => {
            
            try {
                //const res = await axios.get("http://localhost:8081", {withCredentials: true})
                const res = await axios.get("https://one-piece-opal.vercel.app", {withCredentials: true})
                    if(res.data.valid){
                        setBotonPerfil(true)
                        setDatosUsuario(res.data.datosusuario)
                    }
            } catch(err) {
                console.log(err)
            }
        }
        fetchData();
    }, [])

    return (
        <div id="navbar" className="h-16">
            <div className="navbar-logo md:m-8">
                <Link to={`/`}><img src="/imgs/icono_onepiece.png" className="w-8 sm:w-12 md:w-12 lg:w-16 " alt="Logo"/></Link>
            </div>
            <div className="navbar-links text-xs md:text-xs lg:text-sm xl:text-base pt-6 pb-6 2xl:pl-64">
                <ul>
                    <li className="flex">
                        <Link to={`/heroes`} className="max-sm:hidden">HEROES</Link>
                        <Link to={`/heroes`} ><img src={iconoSombrero} className="w-6 ml-5 mb-4 sm:hidden"/></Link>
                    </li>
                    <li>
                        <Link to={`/villanos`} className="max-sm:hidden">VILLANOS</Link>
                        <Link to={`/villanos`} ><img src={iconoCraneo} className="w-6 ml-5 sm:hidden"/></Link>
                    </li>
                    <li>
                        <Link to={`/leyendas`} id="btnLeyendas" className="max-sm:hidden">LEYENDAS</Link>
                        <Link to={`/leyendas`} ><img src={iconoCorona} className="w-6 ml-5 sm:hidden"/></Link>
                    </li>
                    <li>
                        <Link to={`/marines`} id="btnMarines" className="max-sm:hidden">MARINES</Link>
                        <Link to={`/marines`} ><img src={iconoMarine} className="w-6 ml-5 sm:hidden"/></Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-btn mr-6">
                <Link to={`/login`} ><button className="btnEntrar text-xs">ENTRAR</button></Link>
            </div>
            {botonPerfil && (
                <>
                    {datosUsuario.map((datos,id)=> (
                        <Link to={`/perfil`} className="btn-perfil sm:mr-8" key={id}>
                                <span className="text-xs xl:text-base">{datos.nombre_usuario}</span>
                                <div className="img-perfil w-8 h-8">
                                    <img src={`/imgs/userimgs/` + datos.avatar_usuario} alt="Avatar usuario"/>
                                </div>
                        </Link>
                    ))}
                </>
            )}   
        </div>
    )
}