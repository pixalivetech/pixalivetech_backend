import { Router } from 'express';
import { saveEmployee, getAllVideoAds, getSingleVideoAds, updateVideoAds, getAllShareAds, 
         getSingleShareAds, updateShareAds, getAllInstallAds, getSingleInstallAds, updateInstallAds,
         getAllTickets, getSingleTickets, updateTickets, getAllAdvertiser, getSingleAdvertiser,
         getAllEmployee, getSingleEmployee} from '../controller/masterPanel.controller';
import { checkParam, checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/addNewEmployee',      // create Master
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('email'),
    saveEmployee)

router.get('/getAllVideoAds',      // get all VideoAds
    basicAuthUser,
    //checkSession,
    getAllVideoAds)

router.get('/getSingleVideoAds',   // get single VideoAds
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getSingleVideoAds)

router.put('/updateVideoAds',      // update VideoAds
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('_id'),
    updateVideoAds)

router.get('/getAllShareAds',      // get all ShareAds
    basicAuthUser,
    //checkSession,
    getAllShareAds)

router.get('/getSingleShareAds',   // get single ShareAds
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getSingleShareAds)

router.put('/updateShareAds',      // update ShareAds
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('_id'),
    updateShareAds)

router.get('/getAllInstallAds',   // get all InstallAds
    basicAuthUser,
    //checkSession,
    getAllInstallAds)

router.get('/getSingleInstallAds',   // get single InstallAds
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getSingleInstallAds)

router.put('/updateInstallAds',    // update InstallAds
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('_id'),
    updateInstallAds)

router.get('/getAllSupportTickets',    // get all tickets
    basicAuthUser,
    //checkSession,
    getAllTickets)

router.get('/getSingleSupportTickets',    // get single support tickets
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getSingleTickets)

router.put('/updateSupportTickets',    // update support tickets
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('_id'),
    updateTickets)

router.get('/getAllAdvertiser',   // get all Advertiser
    basicAuthUser,
    //checkSession,
    getAllAdvertiser)

router.get('/getSingleAdvertiser',    // get single Advertiser
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getSingleAdvertiser)

router.get('/getAllEmployee',   // get all Employee
    basicAuthUser,
    //checkSession,
    getAllEmployee)

router.get('/getSingleEmployee',    // get single Employee
    basicAuthUser,
    //checkSession,
    checkQuery('_id'),
    getSingleEmployee)

export default router;