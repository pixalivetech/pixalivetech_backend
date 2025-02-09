import { Router } from 'express';
const router: Router = Router();
import Admin from './admin.routes';
import Login from './login.routes';
import ContactUs from './contactUs.routes';
router.use('/admin', Admin);
router.use('/login', Login);
router.use('/contactUs',ContactUs)

export default router
