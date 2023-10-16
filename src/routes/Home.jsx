import React from 'react';
import { Form, Link, Outlet } from "react-router-dom";
import Navbar from '../componentes/Navbar';
import Sidebar from '../componentes/Sidebar';

export default function Home({categoria}) {
    
    return (
        <div className='home'>
            <Navbar/>
            <div className='home-content sm:flex'>
                <Sidebar categoria={categoria} />
                <div id="detalles">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
