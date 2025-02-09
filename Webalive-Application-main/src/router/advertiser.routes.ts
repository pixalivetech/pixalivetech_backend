import {Router} from 'express';
import { saveAdvertiser, updateAdvertiser, getAllAdvertiser, getSingleAdvertiser,advertiserGetNotify,getReferredPersonDetails,
    deletedAdvertiser,getAdvertiserReferralCode,shareReferralCode,getTrendingReferAdvertiser,getReferredAdvertiser} from '../controller/advertiser.controller';
    
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();

router.post('/', // create advertiser
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('mobileNumber'),
    checkRequestBodyParams('confirmPassword'),
    saveAdvertiser
);

router.put('/', // update advertiser
    basicAuthUser,
    checkSession,
    updateAdvertiser
);

router.get('/', // get all advertiser
    basicAuthUser,
    checkSession,
    getAllAdvertiser
);

router.get('/getSingleAdvertiser',//get single advertiser
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleAdvertiser
);

router.delete('/', //delete advertiser
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletedAdvertiser
);

router.get('/getAdvertiserReferralCode', //get advertiser referral code
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getAdvertiserReferralCode);

router.post('/shareReferralCode', //share referral code
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('email'),
    checkRequestBodyParams('referredOn'),
    shareReferralCode);

router.get('/getReferredDetails', //get referred person details
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getReferredPersonDetails);

router.get('/getNotify', //get notify
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    advertiserGetNotify);


    router.get('//getTrendingReferer', // get all advertiser
    basicAuthUser,
    checkSession,
    getTrendingReferAdvertiser
);

router.get('/referredUser', // get all advertiser
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getReferredAdvertiser
);

export default router;