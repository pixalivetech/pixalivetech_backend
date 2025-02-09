import {Router} from 'express';
import {saveshareAds,updateShareAds,getAllShareAds,getSingleShareAds,deleteShareAds,getFilterShareAds,
    countShareAds, getAdvertiserPostedShareAds,earnShareAds} from '../controller/shareAds.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // save ahare ads posted
    basicAuthUser,
    checkSession,
    saveshareAds
);

router.put('/', // update shareAds
    basicAuthUser,
    checkRequestBodyParams('_id'),
    checkSession,
    updateShareAds
);

router.get('/', // get all shareAds
    basicAuthUser,  
    checkSession,
    getAllShareAds
);


router.get('/', // get single shareAds
    basicAuthUser, 
    checkSession,
    checkQuery('_id'),
    getSingleShareAds
);

router.delete('/', //delete single shareAds
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteShareAds
);

router.get('/filter', //get filter shareAds
    basicAuthUser,
    checkSession,    
    getFilterShareAds
);

router.get('/countShareAds', //count shareAds
basicAuthUser,
checkSession,
checkQuery('advertiserId'),
countShareAds    
)

router.get('/advertiserPostedShareAds', //get advertiser posted shareAds
    basicAuthUser,
    checkSession,
    checkQuery('advertiserId'),
    getAdvertiserPostedShareAds);

router.put('/earnings', //earning user on share ads
    basicAuthUser,
    //checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('userId'),
    earnShareAds);
    
export default router;