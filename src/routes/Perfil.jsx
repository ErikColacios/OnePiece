import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../componentes/Navbar";
import { Button, Modal, Box, Typography, Icon } from '@mui/material';
import ImgCamara from "../appimgs/icono-camara.png";

export default function Perfil() {

    const navigate = useNavigate();

    // Modals (ventanas emergentes) de Eliminar cuenta y de seleccion de banner
    const [openModal, setOpenModal] = useState(false);
    const [openModalBanner, setOpenModalBanner] = useState(false);


    // Datos del usuario que tiene la SESION. Se usa para rellenar el form con los DATOS QUE YA ESTAN en la base de datos
    const [datosUsuario, setDatosUsuario] = useState([])

    // Nuevos datos que se han actualizado del usuario. Se usará para insertar los DATOS NUEVOS en la base de datos
    const [perfilActualizado, setPerfilActualizado] = useState([])


    /**
     * Reemplaza los datos del usuario por los que se acaban de escribir en cada campo (setPerfilActualizado).
     * En caso de que se haya cambiado la imagen del banner o de avatar, hace un substring de el nombre de la imagen y no de la ruta de la imagen.
     */
    const handleInputActualizarPerfil = (e) => {
        if(e.target.name == "avatar_usuario") {
            // Si se ha modificado el "input hidden" para cambiar el avatar de usuario
            const rutaImagen = e.target.value;
            const longitudImagen = rutaImagen.length;
            const posicionBarra = rutaImagen.lastIndexOf("\\") + 1;
            const nombreImagen = rutaImagen.substring(posicionBarra, longitudImagen);

            setPerfilActualizado(prev => ({...prev,[e.target.name]: nombreImagen }))

        }else if(e.target.name == "banner_usuario") {
            // Si hemos pulsado el boton de "Aceptar" en la seleccion de banner
            const longitudImagen = imagenSeleccionada.length;
            const posicionBarra = imagenSeleccionada.lastIndexOf("/") + 1;
            const nombreImagen = imagenSeleccionada.substring(posicionBarra, longitudImagen)

            setPerfilActualizado(prev => ({...prev,[e.target.name]: nombreImagen }))

            // Y cerramos la ventana de Seleccion de banner
            setOpenModalBanner(false);


        }else {
            // Si se ha modificado cualquier otro campo del formulario
            setPerfilActualizado(prev => ({...prev,[e.target.name]: [e.target.value]}))
        }
    }


    /**
     * Hace un UPDATE del usuario con los datos actualizados (perfilActualizado)
     */
    const actualizarPerfil = (e) => {
        e.preventDefault()

        console.log(perfilActualizado)
        axios.put("http://localhost:8081/actualizarPerfil", perfilActualizado)
        .then(res => 
            {
                console.log(res)
                window.location.reload(false);
                navigate("/perfil")
            })
        .catch(err => console.log(err));
    }


    /**
     * Hace un DELETE del usuario con los datos actualizados (perfilActualizado)
     */
    const eliminarPerfil = (e) => {
        axios.delete("http://localhost:8081/eliminarPerfil", {data: perfilActualizado})
        .then(res => 
            {
                console.log(res)
                navigate("/")
            })
        .catch(err => console.log(err));
    }

    const [iconoCamara, setIconoCamara] = useState(false);
    const mostrarIconoCamara = (e) => {
        setIconoCamara(true);
    }
    const ocultarIconoCamara = (e) => {
        setIconoCamara(false);
    }


    const [textoBanner, setTextoBaner] = useState(false);
    const mostrarTextoBanner = (e) => {
        setTextoBaner(true);
    }
    const ocultarTextoBanner = (e) => {
        setTextoBaner(false);
    } 

    /**
     * Abre el explorador de archivos al clicar a la foto de perfil o a la foto de banner.
     */
    const buscarArchivo = (e) => {
        if(e.target.name=="perfil-banner"){
            document.getElementById("banner_usuario").click();
        }
        else if(e.target.name=="perfil-avatar" || e.target.id=="perfil-avatar"){
            document.getElementById("avatar_usuario").click();
        }

    }

    const [imagenes, setImagenes] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState();
    const cambiarImagen = (e) => {
        setImagenSeleccionada(e.target.src)
    }

    // Hace una select de las imagenes que hay en la tabla de Imagenes
    useEffect(()=> {
        axios.get("http://localhost:8081/imagenes", {withCredentials: true})
        .then(res => {
            setImagenes(res.data)
        })
        .catch(err => console.log(err))
    }, [])



    // Hace una select * de los datos del usuario que tiene la SESION y lo copia en "setUsuarios" y "setPerfilActualizado"
    useEffect(()=> {
        axios.get("http://localhost:8081/perfil", {withCredentials: true})
        .then(res => {
            setDatosUsuario(res.data)
            setPerfilActualizado(res.data["0"])
            setImagenSeleccionada(`/imgs/bannerimgs/` + res.data["0"].banner_usuario)
        })
        .catch(err => console.log(err))
    }, [])


    return (
        <div className="perfil">
            <Navbar/>
            {datosUsuario.map((datos, id) => (

                <div key={id}>

                    {/* BANNER - AVATAR DE USUARIO - NOMBRE */}
                    {/* ---- BANNER ----*/}
                    <div className="perfil-banner" onMouseOver={mostrarTextoBanner} onMouseOut={ocultarTextoBanner} name="perfil-banner" >
                    <button className="botonInvisible" onClick={()=> setOpenModalBanner(true)}></button>
                        <Modal
                            open={openModalBanner}
                            onClose={()=> setOpenModalBanner(false)}
                            aria-labelledby="modal-banner-select"
                            aria-describedby="modal-banner-select"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {/* ---- BANNER SELECT ---- */}
                                <Box className="bannerSelect">
                                        <img src={imagenSeleccionada} className="bannerActual"/>
                                        <div className="bannerSelect-titulo p-8 md:flex">
                                            <div className="w-full">
                                                <h2 className="text-2xl font-bold mb-3">Selección de banner</h2>
                                                <p className="font-sm mb-3">Escoge el banner de cabecera que más te guste</p>
                                            </div>
                                            <div className="bannerSelect-btns w-full">
                                                <button onClick={handleInputActualizarPerfil} name="banner_usuario" className="font-sm w-64 h-8 lg:text-lg">ACEPTAR</button>
                                            </div>
                                        </div>
                                        <div className="bannerSelect-gallery">
                                            {imagenes.map((imgs, id) => (
                                                    <div key={id} >
                                                        <img src={`/imgs/bannerimgs/`+imgs.imagen} onClick={cambiarImagen}/>
                                                        <label>{imgs.nombre_imagen}</label>
                                                    </div>
                                            ))}
                                        </div>
                                </Box>
                        </Modal>
                        <span className={textoBanner ? "textoBanner" : "textoBannerHidden"} name="perfil-banner">Actualizar banner</span>
                        <img src={imagenSeleccionada} className="perfil-banner-img" name="banner_usuario" />
                    </div>
                    {/* ---- AVATAR ---- */}
                    <div className="perfil-info-avatar md:ml-16 lg:ml-32 xl:ml-64 2xl:ml-96">
                        <div className="perfil-avatar" onClick={buscarArchivo}>
                            <img src={`/imgs/userimgs/` + datos.avatar_usuario} className="perfil-avatar-img" name="perfil-avatar"/>
                            <div className="avatar-content" onMouseOver={mostrarIconoCamara} onMouseOut={ocultarIconoCamara} id="perfil-avatar">
                                <img src={ImgCamara} className={iconoCamara ? "iconoCamara" : "iconoCamaraHidden"} name="perfil-avatar"/>
                            </div>
                        </div>
                        {/* NOMBRE USUARIO */}
                        <label>{datos.nombre_usuario}</label>
                    </div>

                    {/* CONTENIDO PERFIL USUARIO */}
                    <div className="perfil-contenido pt-10">
                        <div className="perfil-contenido-bloque p-16 w-96 sm:w-[30em] md:w-[35em] lg:w-[40em]">
                            <h2 className="font-bold text-3xl mb-8">Perfil de usuario</h2>
                            <form method="POST" onSubmit={actualizarPerfil}>
                                <div>
                                    <h3>Teléfono</h3>
                                    <input type="number" name="telefono_usuario" defaultValue={datos.telefono_usuario} onChange={handleInputActualizarPerfil}/>
                                </div>
                                <div>
                                    <h3>Correo electrónico</h3>
                                    <input type="email" name="correo_usuario" defaultValue={datos.correo_usuario} onChange={handleInputActualizarPerfil}/>
                                </div>
                                <div>
                                    <h3>Género</h3>
                                    <select name="genero_usuario" defaultValue={datos.genero_usuario} onChange={handleInputActualizarPerfil}>
                                        <option value="Hombre">Hombre</option>
                                        <option value="Mujer">Mujer</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </div>
                                <div>
                                    <h3>Descripción</h3>
                                    <textarea rows="2" name="descripcion_usuario" maxLength="150" defaultValue={datos.descripcion_usuario} onChange={handleInputActualizarPerfil}></textarea>
                                </div>
                                <input type="file" name="avatar_usuario" id="avatar_usuario" style={{display: 'none'}} onChange={handleInputActualizarPerfil}/>
                                <input type="file" name="banner_usuario" id="banner_usuario" style={{display: 'none'}} onChange={handleInputActualizarPerfil}/>

                                <button type="submit" className="btnActualizarPerfil">Actualizar</button>
                            </form>
                            
                            {/* Ventana MODAL para ELIMINAR CUENTA */}
                            <button className="btnEliminarPerfil" onClick={()=> setOpenModal(true)} >Eliminar cuenta</button>
                                <Modal
                                    open={openModal}
                                    onClose={()=> setOpenModal(false)}
                                    aria-labelledby="modal-eliminar-usuario"
                                    aria-describedby="modal-eliminar-usuario"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    >
                                        <Box className="ventanaEliminar p-12 md:p-32">
                                            <h3 className="font-bold text-2xl md:text-3xl">¿Estas seguro de que quieres eliminar este usuario?</h3>
                                            <p className="text-lg mt-5">Todas tus personalizaciones se perderán definitivamente</p>
                                            <button className="btnEliminarPerfil" onClick={eliminarPerfil}>Eliminar cuenta</button>
                                            <button className="btnNoEliminarPerfil sm:ml-8" onClick={()=> setOpenModal(false)}>No lo tengo claro</button>
                                        </Box>
                                </Modal>   
                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}