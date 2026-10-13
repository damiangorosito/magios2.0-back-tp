import express from "express";
import dotenv from "dotenv";
import profesionalesRouter from "./routes/profesionales.route.js";
import clientesRouter from "./routes/clientes.route.js";
import turnosRouter from "./routes/turnos.routes.js";
import disponibilidadRouter from "./routes/disponibilidad.route.js";
import cancelacionesRouter from "./routes/cancelaciones.route.js";
import connectDB from "./mongo/client.js";
import handleErrors from "./middlewares/handleErrors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug')
app.set('views', './views')

// Middleware para parsear JSON y formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (CSS + JS del front)
app.use(express.static("public"));

// Ruta básica
app.get('/', (req, res) => {
  res.render('home')
})

// rutas

app.use('/profesionales', profesionalesRouter)
app.use('/clientes', clientesRouter)
app.use('/cancelaciones', cancelacionesRouter)
app.use('/turnos', turnosRouter)
app.use('/disponibilidades', disponibilidadRouter)

app.use(handleErrors);

// Conectamos a Mongo antes de levantar el servidor
await connectDB();

// Puerto de escucha
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})
