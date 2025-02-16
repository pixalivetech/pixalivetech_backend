import {Router} from "express";
const router:Router = Router();
import { saveOpenings,getOpenings ,getSingleOpenings,updateOpenings,deleteOpenings} from "../controller/jobOpenings.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";


router.post('/', 
    basicAuthUser,
    saveOpenings
)

router.get('/',   
    basicAuthUser,
    getOpenings
);

router.get('/getSingleJobOpening',   
    basicAuthUser,
    // checkSession,
    checkQuery('_id'),
    getSingleOpenings
);

router.put('/',  
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateOpenings
);

router.delete ('/', 
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteOpenings
);

export default router;