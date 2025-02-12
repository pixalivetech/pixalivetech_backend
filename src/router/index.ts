import { Router } from 'express';
const router: Router = Router();

import  Admin  from "./adminPanel.routes"
import Login from "./login.routes"
import Contact from "./contactus.routes"

router.use('/admin',Admin )
router.use('/login', Login)
router.use('/contactus',Contact)

export default router