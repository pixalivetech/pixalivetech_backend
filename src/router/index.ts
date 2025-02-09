import {Router} from 'express';
const router : Router = Router();
import Admin from './admin.routes';
import Login from './login.routes';

router.use('/admin', Admin );
router.use('/login', Login );

export default router ;