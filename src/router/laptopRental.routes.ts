import {Router} from "express";
const router:Router = Router();
import { saveLaptopRental,getLaptopRental ,getSingleLaptopRental,updateLaptopRental,deleteLaptopRental} from "../controller/laptopRental.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";


router.post('/', //save contact  // without checking session
    basicAuthUser,
    saveLaptopRental
)

router.get('/', //get all contact   
    basicAuthUser,
    getLaptopRental
);

router.get('/getSingleRental',  //get single user   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleLaptopRental
);

router.put('/',  //update user   
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateLaptopRental
);

router.delete ('/',  //delete users',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteLaptopRental
);

export default router;