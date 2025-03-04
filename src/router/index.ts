import { Router } from 'express';
const router: Router = Router();


import User from './user.routes'
import Login from "./login.routes"

router.use('/user',User)
router.use('/login', Login)

export default router