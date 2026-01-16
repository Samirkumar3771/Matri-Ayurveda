import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message } = req.body;

    const appointment = new Appointment({
      userId: req.userId,
      name,
      email,
      phone,
      service,
      date,
      time,
      message
    });

    await appointment.save();
    res.status(201).json({ msg: "Appointment booked successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const data = await Appointment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
