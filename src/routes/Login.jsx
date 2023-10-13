import { useState } from "react";
import Navbar from "../componentes/Navbar";
import { Button, Modal, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Login(){

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [mensajeErrorLogin, setMensajeErrorLogin] = useState(false);

    // Setea el mensaje de fallo login a true
    const loginFalla = () => {
        setMensajeErrorLogin(true);
    }

// ------------------------------- Register -------------------
    const [valuesRegister, setValuesRegister] = useState({
        nombre_usuario: "",
        password_usuario: "",
        telefono_usuario: "",
        correo_usuario: ""
    })

    const handleInputRegister = (e) => {
        setValuesRegister(prev => ({...prev,[e.target.name]: [e.target.value]}))
    }

    const handleSubmitRegister = async(e) => {
        e.preventDefault()
        console.log(valuesRegister)
        axios.post("http://localhost:8081/registro", valuesRegister)
        .then(res => 
            {
                console.log(res)
                navigate("/")
            })
        .catch(err => console.log(err));
    }

    // --------------------------- Login --------------------

    const [valuesLogin, setValuesLogin] = useState({
        nombre_usuario: "",
        password_usuario: "",
    })

    const handleInputLogin = (e) => {
        setValuesLogin(prev => ({...prev,[e.target.name]: [e.target.value]}))
    }

    axios.defaults.withCredentials = true;
    const handleSubmitLogin= async(e) => {
        e.preventDefault()
        axios.post("http://localhost:8081/login", valuesLogin)
        .then(res => {
            if(res.data.Login) {
                // Si se logea con exito redirige al inicio
                navigate("/")
                console.log("¡Bienvenido!")
            } else {
                // Si al logearse falla muestra un mensaje de fallo al logearse 
                loginFalla(true);
                console.log("¡No existe el usuario!")
            }
        })
        .catch(err => console.log(err));
    }
    

    return (
        <div className="login">
            <Navbar/>
            <div className="login-container">
                <div className="login-formulario lg:flex">
                    <div className="mitad-imagen w-full h-1/2  lg:w-1/2 lg:h-full ">
                    </div>
                    <div className="mitad-datos w-full h-1/2  lg:w-1/2 lg:h-full ">
                        <form method="POST" onSubmit={handleSubmitLogin}>
                            <h2 className="font-bold mb-3">Iniciar sesión</h2>
                            {mensajeErrorLogin && (
                                <div className="login-falla">
                                    <label>Nombre de usuario o contraseña incorrectos</label>
                                </div>
                            )}

                            <input type="text" name="nombre_usuario" id="usuario" placeholder="Usuario" onChange={handleInputLogin}/><br/>
                            <input type="password" name="password_usuario" id="password" placeholder="Password" onChange={handleInputLogin}/><br/>
                            <button className="btnLogin" type="submit">Iniciar sesión</button><br/>
                        </form>
                        <button className="btnRegistro" onClick={()=> setOpen(true)} >¡Regístrate!</button>
                            <Modal 
                                open={open}
                                onClose={()=> setOpen(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                >
                                    {/* ------- REGISTRO ------- */}
                                    <Box className="registro">
                                            <h2 className="mb-6">Registro</h2>
                                            <form method="POST" className="registro-datos" onSubmit={handleSubmitRegister}>
                                                <label>Nombre de usuario</label>
                                                <input type="text" name="nombre_usuario" required placeholder="Usuario" onChange={handleInputRegister}/><br/>
                                                <label>Contraseña</label>
                                                <input type="password" name="password_usuario" required placeholder="Password" onChange={handleInputRegister}/><br/>
                                                <label>Teléfono</label>
                                                <input type="number" name="telefono_usuario" required placeholder="Telefono" onChange={handleInputRegister}/><br/>
                                                <label>Correo</label>
                                                <input type="email" name="correo_usuario" required placeholder="Correo" onChange={handleInputRegister}/><br/>
                                                <label>Género</label>
                                                <select name="genero_usuario" required onChange={handleInputRegister}>
                                                    <option value="Hombre">Hombre</option>
                                                    <option value="Mujer">Mujer</option>
                                                    <option value="Otros">Otros</option>
                                                </select><br/>
                                                <button type="submit" className="btnRegistro2">¡Regístrate!</button>
                                            </form>
                                    </Box>
                                </Modal>
                    </div>
                </div>
            </div>
        </div>

    )
}