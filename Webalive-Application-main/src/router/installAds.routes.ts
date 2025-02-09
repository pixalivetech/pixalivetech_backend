import { Router } from "express";
const router:Router=Router();
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession, } from "../utils/tokenManager";
import { saveInstallAds,getAdvertiserPosteAds,getAllInstallAds,deleteInstallAds,getSingleInstallAds,searchInstallAds,updateInstallAds,countInstallAds } from "../controller/installAds.controller";

router.post('/', //save InstallAds
basicAuthUser,
checkSession,
saveInstallAds);

router.get('/', //get all InstallAds for flutter
basicAuthUser,
checkSession,
getAllInstallAds);

router.put('/', //update InstallAds
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
updateInstallAds);

router.delete('/', //delete single InstallAds
basicAuthUser,
checkSession,
checkQuery('_id'), //post Id
deleteInstallAds);

router.get('/', //get advertiser posted Install Ads
basicAuthUser,
checkSession,
checkQuery('_id'),
getAdvertiserPosteAds);

router.get('/getSingleInstallAds', //get single InstallAds for admin 
basicAuthUser,
checkSession,
checkQuery('_id'),
getSingleInstallAds);

router.get('/searchInstallAds', //search InstallAds by word
basicAuthUser,
checkSession,
checkRequestBodyParams('word'),
searchInstallAds);

router.put('/updateInstallAds', //update InstallAds
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
updateInstallAds);

router.get('/countInstallAds', //count Install Ads
    basicAuthUser,
    checkSession,
    checkQuery('advertiserId'),
    countInstallAds
    )


export default router