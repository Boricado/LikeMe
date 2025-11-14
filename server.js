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

// Ruta GET Parte 1
app.get("/posts", async (req, res) => {
  const result = await pool.query("SELECT * FROM posts ORDER BY id ASC");
  res.json(result.rows);
})


// Ruta POST Parte 1
app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body; // recibe url desde el frontend
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [titulo, url, descripcion] // inserta 'url' en la columna 'img'
    );
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error en POST /posts:", error)
    res.status(500).send("Error del post")
  }
})


// Ruta PUT Parte 2 
app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    )
    res.json(result.rows[0])
  } catch (error) {
    console.error("Error en PUT /posts/like/:id:", error)
    res.status(500).send("Error al dar like POST")
  }
})

// Ruta DELETE Parte 2
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params
    await pool.query("DELETE FROM posts WHERE id = $1", [id])
    res.sendStatus(200)
  } catch (error) {
    console.error("Error en DELETE /posts/:id:", error)
    res.status(500).send("Error al eliminar post")
  }
})


app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"))
