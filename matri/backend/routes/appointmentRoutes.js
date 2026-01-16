import express from "express";
import auth from "../middleware/auth.js";
import { bookAppointment, getAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

// POST: Book appointment
router.post("/book", auth, bookAppointment);

// GET: Get appointments for logged user
router.get("/", auth, getAppointments);

export default router;
