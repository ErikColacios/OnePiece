const express = require("express");
const mysql = require("mysql");
const {Pool} = require("pg")
require('dotenv').config()

const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const uuid = require("react-uuid");

const pool = new Pool({
  connectionString: "postgres://default:uCmxVWyI06RX@ep-summer-lake-14260184-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",
})

//Constantes
const HEROE = "'Heroe'";
const VILLANO = "'Villano'";
const LEYENDA = "'Leyenda'";
const MARINE = "'Marine'";

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret", // clave secreta para encriptar la cookie de la sesion
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    }, // aplicar las propiedades de las cookies en la sesion
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "onepiece",
});


// Select del usuario que tiene la sesion 
app.get("/", (req, res) => {
  if (req.session.username) {
    const username = req.session.username;
    const sql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";
    db.query(sql, username, (err, data) => {
      if (err) return res.json(err);
      return res.json({ valid: true, datosusuario: data });
    })
  } else {
    return res.json({ valid: false });
  }
});


// Select de todos los personajes HEROES
app.get("/Heroe", (req, res) => {
  const sql = `SELECT * FROM personajes WHERE categoria_personaje=${HEROE}`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// Select de un personaje en concreto en funcion de la CATEGORIA y el ID
app.get("/:categoria/:id", (req, res) => {
  const id = req.params.id;
  const categoria = req.params.categoria;

  const values= [
    id,
    categoria
  ];
  
  const sql = `SELECT * FROM personajes WHERE id_personaje=? AND categoria_personaje=?`;
  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Message: "No se ha encontrado el personaje"});
    return res.json(result);
  });
});


// Select de todos los personajes VILLANOS
app.get("/Villano", (req, res) => {
  const sql = `SELECT * FROM personajes WHERE categoria_personaje=${VILLANO}`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// Select de todos los personajes LEYENDAS
app.get("/Leyenda", (req, res) => {
  const sql = `SELECT * FROM personajes WHERE categoria_personaje=${LEYENDA}`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Select de todos los personajes MARINES
app.get("/Marine", (req, res) => {
  const sql = `SELECT * FROM personajes WHERE categoria_personaje=${MARINE}`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// Select de la tabla IMAGENES
app.get("/imagenes", (req, res) => {
  const sql = `SELECT * FROM imagenes`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// Select de los poderes de un personaje en concreto
app.get("/:categoria/poderes/:id", (req,res) => {
  const id_personaje = req.params.id;
  const sql = `SELECT * FROM poderes WHERE id_personaje=`+id_personaje;
  
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});


// Insert de un nuevo usuario al REGISTRARSE
app.post("/registro", (req, res) => {
  const id = uuid();
  const avatar_dummy = "luffyface.jpg";
  const banner_dummy = "thousandsunny.jpg";
  const sql = "INSERT INTO usuarios (`id_usuario`, `nombre_usuario`, `password_usuario`, `telefono_usuario`, `correo_usuario`, `genero_usuario`, `avatar_usuario`, `banner_usuario`) VALUES (?)";

  const values = [
    id,
    req.body.nombre_usuario,
    req.body.password_usuario,
    req.body.telefono_usuario,
    req.body.correo_usuario,
    req.body.genero_usuario,
    avatar_dummy,
    banner_dummy
  ];
  
  console.log(values);
  console.log(sql);

  db.query(sql, [values], (err, result) => {
    if (err) return res.json({ Message: "Error in Node" });
    return res.json(result);
  });
});



// Select del usuario que se ha escrito para hacer LOGIN
app.post("/login", (req, res) => {
  const sql =
    "SELECT * FROM usuarios WHERE nombre_usuario= ? AND password_usuario = ?";
  db.query(
    sql,
    [req.body.nombre_usuario, req.body.password_usuario],
    (err, result) => {
      if (err) return res.json({ Message: "Error en el servidor" });

      if (result.length > 0) {
              req.session.id_usuario = result[0].id_usuario;
              req.session.username = result[0].nombre_usuario;
              return res.json({ Login: true });

      } else {
        return res.json({ Login: false });
      }
    }
  );
});



// Select del usuario con la sesion creada
app.get("/perfil", (req, res) => {

  const sql = `SELECT * FROM usuarios WHERE id_usuario = ? AND nombre_usuario = ?`;

  const values = [
    req.session.id_usuario,
    req.session.username
  ]

  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
})


// UPDATE del usuario de la sesion creada con nuevos datos (telefono_usuario, correo_usuario, genero_usuario, descripcion_usuario)
app.put("/actualizarPerfil", (req, res) => {

  values = [
    req.body.telefono_usuario,
    req.body.correo_usuario,
    req.body.genero_usuario,
    req.body.descripcion_usuario,
    req.body.avatar_usuario,
    req.body.banner_usuario,
    req.body.id_usuario,
    req.body.nombre_usuario,
  ]

  console.log(values)

  let sql = "UPDATE usuarios SET telefono_usuario= ? , correo_usuario = ? , genero_usuario = ? , descripcion_usuario = ?,  avatar_usuario = ? , banner_usuario = ? WHERE id_usuario = ? AND nombre_usuario = ?";

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.json({ Message: "Error al actualizar perfil" });
    }
    return res.json(result);
  });
})


app.delete("/eliminarPerfil",(req,res)=> {
  const values = [
    req.body.id_usuario,
    req.body.nombre_usuario
  ]

  let sql = "DELETE FROM usuarios WHERE id_usuario= ? AND nombre_usuario = ?";

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.json({ Message: "Error al eliminar perfil" });
    }
    console.log(values)
    console.log(sql)
    return res.json(result);
  });
})


app.listen(8081, () => {
  console.log("El servidor esta encendido");
});
