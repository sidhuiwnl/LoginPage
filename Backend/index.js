import express from "express"
import cors from "cors"
import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  try {
    await db.execute(sql, [name, email, password]);
    return res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Database error", error: err });
  }
});



app.post("/signin", async(req, res) => {
  const { email, password } = req.body;

   if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try{
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  const [ rows ] = await db.execute(sql,[email,password])

  if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
  }

  const user = rows[0];
  return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
  });
  }catch(err){
    console.error("Signin Error:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
  

});


app.listen(3000,() => {
  console.log("Server running on http://localhost:3000");
});