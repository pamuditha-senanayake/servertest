import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import Redis from "ioredis";
import { RedisStore } from 'connect-redis';
import cors from 'cors';
import db from './db.js';
import userManagementController from "./controllers/userManagement.js";
import crudController from "./controllers/crudcontrollers.js";
import ErrorHandler from "./middlewares/ErrorHandler.js";
import employeeRoutes from './controllers/employee.controller.js';
import UserH from './controllers/userhandling.js';
import beautyServicesRoutes from './controllers/beautyService.controller.js';
import professionalRoutes from './controllers/professional.controller.js';
import professionalSRoutes from './controllers/professional.controller.js';
import appointmentRoutes from './controllers/appointment.controller.js';
import appointmentDetailsRoutes from './controllers/appointment.controller.js';
import appointmentStatusRoutes from './controllers/appointment.controller.js';
import appointmentConfirmedRoutes from './controllers/appointment.controller.js';
import appointmentRejectedRoutes from './controllers/appointment.controller.js';
import appointmentDeleteRoutes from './controllers/appointment.controller.js';
import appointmentDoneRoutes from './controllers/appointment.controller.js';
import myAllAppointmentsRoutes from './controllers/appointment.controller.js';
//ishan
import addService from './controllers/AddService.js';
import testimonialRoutes from './controllers/testimonial.controller.js';

import productsController from './controllers/productsController.js';
import cartController from './controllers/cartController.js';
import checkoutRoutes from './controllers/checkoutController.js';
//Anuththara
import productsRoutes from './controllers/products.controller.js';

//dasun
import addcard2 from './controllers/Addcard.js';


dotenv.config();

const app = express();
const port = 3002;

app.use(cors({
    origin: ['https://pamoo.netlify.app', 'https://servertest-r1xa.onrender.com'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.set("trust proxy", 1); //change #04- newly added
app.options('*', cors());  // This handles preflight requests for all routes


const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {
        rejectUnauthorized: false,
    },  // Disable SSL/TLS
});


export { redisClient };

const isProduction = process.env.RENDER || process.env.NODE_ENV === "production";

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 100, // 100 minutes
        httpOnly: true,
        secure: isProduction,  // Secure only in production
        sameSite: isProduction ? "none" : "lax" // Adjust sameSite based on env
    },
    name: 'diamond'
}));

// app.use(session({
//     store: new RedisStore({ client: redisClient }), // Use Redis store for sessions
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 100, // 100 minutes
//         httpOnly: true,
//         secure: true,
//         sameSite: "none"
//
//     },
//     name: 'diamond' // The cookie name
// }));

redisClient.on('error', (err) => {
    console.log('Redis connection error:', err);
});

// Testing Redis connection (Optional)
await redisClient.set('foo', 'bar');
console.log('Set foo to bar');

// Middleware
app.use(bodyParser.json());
app.use('/api/employees', employeeRoutes);
app.use('/api/beautyservices', beautyServicesRoutes);
app.use('/api/selectprofessional', professionalRoutes);
app.use('/api/selectprofessionalservice', professionalSRoutes);
app.use('/api/appointmentservice', appointmentRoutes);
app.use('/api/appointmentdetails', appointmentDetailsRoutes);
app.use('/api/appointmentstatus', appointmentStatusRoutes);
app.use('/api/appointmentconfirmed', appointmentConfirmedRoutes);
app.use('/api/appointmentrejected', appointmentRejectedRoutes);
app.use('/api/appointmentdelete', appointmentDeleteRoutes)
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/appointmentdone', appointmentDoneRoutes);
app.use('/api/myappointment', myAllAppointmentsRoutes);



app.use(express.json());


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));

app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/employees", employeeRoutes);
app.use("/", userManagementController);
app.use('/api/crud', crudController);
app.use('/api/user', UserH);
app.use('/service', addService);


// app.use("/api/ai", aiController); // Updated route for AiManagement
app.use('/api/cart', cartController);
app.use('/products', productsController);
app.use('/api/checkout', checkoutRoutes);

//Anuththara
app.use('/api/products', productsRoutes)
app.use('/uploads', express.static('uploads'));


app.use('/card', addcard2);


app.get("/", (req, res) => {
    res.redirect("https://pamoo.netlify.app/home");
});


db.query("SELECT 1")
    .then(() => {
        console.log('DB connection succeeded.');
    })
    .catch(err => console.log('DB connection failed.\n' + err));


app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(ErrorHandler);