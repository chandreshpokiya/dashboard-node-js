import express from 'express';
import { errorPage } from '../controllers/dashboardController.js';
import adminRoutes from './admin.js'
const routes = express.Router();

routes.use('/admin', adminRoutes)
routes.get('*', errorPage)

export default routes