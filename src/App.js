import './App.css';
import React from 'react';

import {
  createBrowserRouter, 
  RouterProvider,
  Route,
  createRoutesFromElements
} from "react-router-dom";

import Home from './routes/Home';
import Index from './routes/Index';
import Personaje from './routes/Personaje';
import Login from './routes/Login';
import Perfil from './routes/Perfil';
import Error from './routes/Error';


const router = createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route path='/' element={<Home categoria={"null"}/>} errorElement={<Error />}>
              <Route index={true} element={<Index/>} />
          </Route>
          <Route path='/heroes' element={<Home categoria={"Heroe"}/>} errorElement={<Error />}>
              <Route path='/heroes/:id' element={<Personaje categoria={"Heroe"}/>}/>
          </Route>
          <Route path='/villanos' element={<Home categoria={"Villano"}/>} errorElement={<Error />}>
              <Route path='/villanos/:id' element={<Personaje categoria={"Villano"}/>}/>
          </Route>
          <Route path='/leyendas' element={<Home categoria={"Leyenda"}/>} errorElement={<Error />}>
              <Route path='/leyendas/:id' element={<Personaje categoria={"Leyenda"}/>}/>
          </Route>
          <Route path='/marines' element={<Home categoria={"Marine"}/>} errorElement={<Error />}>
              <Route path='/marines/:id' element={<Personaje categoria={"Marine"}/>}/>
          </Route>
          <Route path='/login' element={<Login />}/>
          <Route path='/perfil' element={<Perfil />} errorElement={<Error />}/>
        </>
      )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
