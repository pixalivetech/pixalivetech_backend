import {  Router} from "express";
const router :Router = Router();
import { basicAuthUser } from "../middleware/checkAuth";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { checkSession } from "../utils/tokenManager";
import { saveAdvertiserTask,getAllAdvertiserTask,updateAdvertiserTask,getSingleAdvertiserTask,deleteAdvertiserTask,updateTaskOnUser } from "../controller/advertiserTask.controller";


router.post('/', //post advertiser task
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('advertiserId'),
    saveAdvertiserTask
    );

router.get('/', //get advertiser task
    basicAuthUser,
    checkSession,
    getAllAdvertiserTask
    );

router.put('/', //update advertiser task
    basicAuthUser,
    checkSession,
    updateAdvertiserTask
    );

router.get('/getSingleAdvertiserTask', //get single advertiser task
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAdvertiserTask    
    );

router.delete('/', //delete advertiser task
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteAdvertiserTask
    );    
    
router.put('/uploadTask', //delete advertiser task
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateTaskOnUser
    );    
    

export default router;   

