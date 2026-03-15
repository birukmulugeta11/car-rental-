import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("drive_select.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    pricePerDay INTEGER NOT NULL,
    image TEXT NOT NULL,
    transmission TEXT NOT NULL,
    fuel TEXT NOT NULL,
    seats INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carId TEXT NOT NULL,
    userId TEXT NOT NULL,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    totalPrice INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carId) REFERENCES cars(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Cars if empty
const carCount = db.prepare("SELECT COUNT(*) as count FROM cars").get() as { count: number };
if (carCount.count === 0) {
  const insertCar = db.prepare("INSERT INTO cars (id, name, type, pricePerDay, image, transmission, fuel, seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  
  const initialCars = [
    {
      id: '1',
      name: 'Tesla Model S Plaid',
      type: 'Electric',
      pricePerDay: 150,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
      transmission: 'Automatic',
      fuel: 'Electric',
      seats: 5
    },
    {
      id: '2',
      name: 'Porsche 911 Carrera',
      type: 'Sport',
      pricePerDay: 250,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000',
      transmission: 'PDK',
      fuel: 'Petrol',
      seats: 2
    },
    {
      id: '3',
      name: 'Range Rover Sport',
      type: 'SUV',
      pricePerDay: 180,
      image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=1000',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: 7
    },
    {
      id: '4',
      name: 'Mercedes-Benz S-Class',
      type: 'Luxury',
      pricePerDay: 200,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000',
      transmission: 'Automatic',
      fuel: 'Petrol',
      seats: 5
    }
  ];

  for (const car of initialCars) {
    insertCar.run(car.id, car.name, car.type, car.pricePerDay, car.image, car.transmission, car.fuel, car.seats);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/cars", (req, res) => {
    const cars = db.prepare("SELECT * FROM cars").all();
    res.json(cars);
  });

  app.post("/api/bookings", (req, res) => {
    const { carId, userId, customerName, customerEmail, startDate, endDate, totalPrice } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO bookings (carId, userId, customerName, customerEmail, startDate, endDate, totalPrice)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(carId, userId, customerName, customerEmail, startDate, endDate, totalPrice);
      res.json({ id: info.lastInsertRowid, status: "success" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.post("/api/messages", (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(name, email, subject, message);
      res.json({ id: info.lastInsertRowid, status: "success" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
