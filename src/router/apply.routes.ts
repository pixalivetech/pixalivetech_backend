import {Router} from "express";
const router:Router = Router();
import { saveApply,getAllApply,getSingleApply,deletedApply,getFilterApply } from "../controller/apply.controller";
import {basicAuthUser} from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";

router.post('/', //save contact  // without checking session
    basicAuthUser,
    saveApply
)

router.get('/', //get all contact   
    basicAuthUser,
    checkSession,
    getAllApply
);  

router.get('/getSingleApply',  //get single user   
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleApply
);

router.delete ('/',  //delete Apply',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletedApply
);

router.put('/getFilterContact',  //get filter for Apply',
   basicAuthUser,
  checkSession,
  checkRequestBodyParams('_id'),
  getFilterApply 
);


export default router;
