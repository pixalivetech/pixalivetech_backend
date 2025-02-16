import { Router } from 'express';
const router: Router = Router();
import Admin from './admin.routes';
import Login from './login.routes';
import ContactUs from './contactUs.routes';
import OurClients from './ourClients.routes';
import LaptopRental from './laptopRental.routes';
import Services from './services.routes';
import WorkingSpace from './coworkingSpace.routes'
router.use('/admin', Admin);
router.use('/login', Login);
router.use('/contactUs',ContactUs)
router.use('/ourClients',OurClients)
router.use('/laptopRental',LaptopRental)
router.use('/services',Services)
router.use('/workingSpace',WorkingSpace)

export default router
