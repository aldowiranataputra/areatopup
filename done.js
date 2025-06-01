// === BACKEND: server.js ===
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const SECRET = "secretjwt";

// Fake Database
let games = [
  { id: 1, name: "Diamond Mobile Legends", game: "MLBB", price: 10000 },
  { id: 2, name: "UC PUBG", game: "PUBG Mobile", price: 15000 },
  { id: 3, name: "Genesis Crystal", game: "Genshin Impact", price: 20000 },
  { id: 4, name: "Valorant Point", game: "Valorant", price: 25000 },
];

let orders = [];
const admin = { email: "admin@areatopup.com", password: "admin123" };

// === API ===
app.get("/api/harga", (req, res) => {
  res.json(games);
});

app.post("/api/checkout", (req, res) => {
  const { nama, metode, items } = req.body;
  const total = items.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
  const order = { nama, metode, total, created_at: new Date() };
  orders.push(order);
  res.json({ message: "Pesanan berhasil", total });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === admin.email && password === admin.password) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Email atau password salah" });
});

app.get("/api/admin/pesanan", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json(orders);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// === FRONTEND: React App (responsive & mobile ready) ===
// Pastikan TailwindCSS responsive utility digunakan secara konsisten:
// - Gunakan "sm:", "md:", "lg:", "xl:" untuk mengatur layout sesuai ukuran layar
// - Gunakan "w-full", "max-w-screen-sm", "flex-wrap" dll untuk adaptasi tampilan

// Salin dari dokumen "Frontend-areatopup" dan pastikan komponen seperti:
// - Header/menu menggunakan flex & wrap
// - Grid produk: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
// - Keranjang dan login form memiliki padding dan lebar maksimum mobile: "max-w-md w-full"

// Untuk produksi:
// - Tambahkan viewport di index.html: <meta name="viewport" content="width=device-width, initial-scale=1.0">
// - Uji di berbagai perangkat (Chrome dev tools / responsively.app)

// Tailwind membantu otomatis membuat desain responsif jika digunakan dengan benar. Frontend sudah siap tampil rapi di perangkat mobile!
