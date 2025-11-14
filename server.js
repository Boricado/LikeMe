import express from "express"
import cors from "cors"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()
const { Pool } = pg
const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

// Ruta GET
app.get("/posts", async (req, res) => {
  const result = await pool.query("SELECT * FROM posts");
  res.json(result.rows)
})

// Ruta POST
app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body; // recibe url desde el frontend
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [titulo, url, descripcion] // inserta 'url' en la columna 'img'
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en POST /posts:", error);
    res.status(500).send("Error del post");
  }
});



app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"))
