import { Router } from 'express';
import { saveUrl,getAllUrl,deletedUrl,updateUrl,likeUrl,unLikeUrl,commentUrl,deleteCommentUrl,getTrendingUrl,
         category,urlCount,reporturl,showReportedUrl,getPostedUrl,searchUrl,categoryCount,urlClickCount,
         userViewCount,getSingleUserPostedUrl,showUrlComments,getTrendingCategory,userLikeCount,getAllLikedUsers,
         advertiserPostDetails,getUrlClickCountBased,userGetLikeCount} from '../controller/url.controller';

import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';

const router:Router=Router();


router.post('/', // save url for flutter
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('advertiserId'),
    checkRequestBodyParams('url'),
    saveUrl);

router.put('/', // update url for flutter
    basicAuthUser,
    checkRequestBodyParams('_id'),
    checkSession,
    updateUrl);

router.get('/', // get all url for flutter
    basicAuthUser,  
    //checkSession,
    checkQuery('_id'),
    getAllUrl);

router.delete('/', //delete url for advertiser panel
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('advertiserId'),
    deletedUrl);

router.put('/likeUrl', //like url for flutter
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('userId'),
    checkRequestBodyParams('_id'),
    likeUrl);

router.put('/unlikeUrl', //like url for flutter
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('userId'),
    checkRequestBodyParams('_id'),
    unLikeUrl);    

router.put('/commentUrl', //comment url for flutter  and user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('comment'),
    checkRequestBodyParams('userId'),
    commentUrl);

router.get('/showUrlComments', //show Url comments on user both user and advertiser
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    showUrlComments);

router.put('/deleteCommentUrl', //unComment url for flutter
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('commentId'),    
    deleteCommentUrl);

router.get('/getTrendingUrl', //get trending url for flutter
    basicAuthUser,
    checkSession,
    getTrendingUrl);

router.get('/getTrendingCategory', //get trending category for flutter
    basicAuthUser,
    checkSession,
    getTrendingCategory);

router.get('/category',// get post by category for flutter
    basicAuthUser,
    checkSession,
    checkQuery('category'),
    category);

router.get('/urlCount',   //get url count
    basicAuthUser,
    checkSession,
    urlCount);

router.put('/reporturl', //report url for flutter
    basicAuthUser,
    checkSession, 
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('reason'),
    reporturl);

router.get('/showReportedUrl', //show reported url
    basicAuthUser,
    checkSession,
    showReportedUrl);

router.get('/getPostedUrl', //get posted url
    basicAuthUser,
    checkSession,
    checkQuery('url'),
    getPostedUrl);


router.get('/search', //get url individual
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('word'),
    searchUrl);

router.get('/categoryCount',
    basicAuthUser,
    checkSession,
    checkQuery('category'),
    checkRequestBodyParams('category'),
    categoryCount);


router.put('/urlClickCount', //get url click count
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('userId'),       //url id
    urlClickCount
    );

router.put('/userViewCount', //get user view count
    basicAuthUser,
    checkSession,
    checkQuery('_id'),       //user id
    userViewCount
    );

router.get('/getUserLikeCount', //get user like count
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    userLikeCount
    );

router.get('/getSingleAdvertiserPostedUrl', //get url individual user posted
    basicAuthUser,
    checkSession,
    checkQuery('advertiserId'),
    getSingleUserPostedUrl
    );

router.get('/getAllLikedUsers', //get all liked users
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getAllLikedUsers
    );

router.get('/getUrlClickCount', //get url click count on suggession
    basicAuthUser,
    checkSession,
    getUrlClickCountBased
    );

router.get('/advertiserPostDetails', //get advertiser post details
    basicAuthUser,
    checkSession,
    checkQuery('advertiserId'),
    advertiserPostDetails
    );
router.get('/getUserLikeCount',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    userGetLikeCount
   );


export default router;