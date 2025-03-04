import { Router } from 'express';
const router: Router = Router();
import Admin from './admin.routes';
import Login from './login.routes';
import ContactUs from './contactUs.routes';
import OurClients from './ourClients.routes';
import LaptopRental from './laptopRental.routes';
import Services from './services.routes';
import WorkingSpace from './coworkingSpace.routes'
import Jobopenings  from './jobOpenings.routes';
import HireDevelopers from './hireDevelopers.routes';
import Apply from './apply.routes';
router.use('/admin', Admin);
router.use('/login', Login);
router.use('/contactUs',ContactUs)
router.use('/ourClients',OurClients)
router.use('/laptopRental',LaptopRental)
router.use('/services',Services)
router.use('/workingSpace',WorkingSpace)
router.use('/jobOpening',Jobopenings)
router.use('/hireDevelopers',HireDevelopers)
router.use('/apply',Apply)

export default router
