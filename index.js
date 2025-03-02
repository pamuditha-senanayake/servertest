import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import db from "./db.js";
import userManagementController from "./controllers/userManagement.js";
import crudController from "./controllers/crudcontrollers.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import employeeRoutes from "./controllers/employee.controller.js";
import UserH from "./controllers/userhandling.js";
import beautyServicesRoutes from "./controllers/beautyService.controller.js";
import professionalRoutes from "./controllers/professional.controller.js";
import appointmentRoutes from "./controllers/appointment.controller.js";
import addService from "./controllers/AddService.js";
import testimonialRoutes from "./controllers/testimonial.controller.js";
import productsController from "./controllers/productsController.js";
import cartController from "./controllers/cartController.js";
import checkoutRoutes from "./controllers/checkoutController.js";
import productsRoutes from "./controllers/products.controller.js";
import addcard2 from "./controllers/Addcard.js";

dotenv.config();
const app = express();
const port = 3001;

// CORS Configuration
app.use(cors({
    origin: ["https://pamoo.netlify.app", "https://servertest-isos.onrender.com"],
    credentials: true
}));

// Session Middleware (Must be before passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 100, // 100 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None"
    },
    name: "diamond"
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/beautyservices", beautyServicesRoutes);
app.use("/api/selectprofessional", professionalRoutes);
app.use("/api/appointmentservice", appointmentRoutes);
app.use("/api/appointmentdetails", appointmentRoutes);
app.use("/api/appointmentstatus", appointmentRoutes);
app.use("/api/appointmentconfirmed", appointmentRoutes);
app.use("/api/appointmentrejected", appointmentRoutes);
app.use("/api/appointmentdelete", appointmentRoutes);
app.use("/api/appointmentdone", appointmentRoutes);
app.use("/api/myappointment", appointmentRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/crud", crudController);
app.use("/api/user", UserH);
app.use("/service", addService);
app.use("/api/cart", cartController);
app.use("/products", productsController);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/products", productsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/card", addcard2);

// Redirect root request
app.get("/", (req, res) => {
    res.redirect("https://pamoo.netlify.app/home");
});

// Database Connection Check
db.query("SELECT 1")
    .then(() => console.log("DB connection succeeded."))
    .catch(err => {
        console.error("DB connection failed:", err);
        process.exit(1); // Exit process if DB connection fails
    });

// Middleware to set user in response locals
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Error Handling Middleware
app.use(ErrorHandler);

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
