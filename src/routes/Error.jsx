import { useRouteError } from "react-router-dom";
import Navbar from '../componentes/Navbar';

export default function Error() {
  const error = useRouteError();

  return (
      
        <div id="error">
            <Navbar/>
            <div className="error-contenido">
                <h1>Error 404</h1>
                <label>No se ha encontrado esta página</label>
                    <p>
                        <i>{error.statusText || error.message}</i>
                    </p>
            </div>
            
        </div>
    
  );
}