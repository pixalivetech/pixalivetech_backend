import {Router}  from "express";
const router:Router = Router();
import { saveVideo,getAllVideo,getAdvertiserPosteVideo,deleteVideo,likeVideo,unLikeVideo,commentVideo,deleteCommentVideo,updateVideoAds,countVideoAds,getSingleVideoAds,showVideoComments} from "../controller/videoAds.controller";
import { basicAuthUser, } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";


router.post('/', //save Video Ads for advertiser panel
basicAuthUser,
checkSession,
saveVideo);

router.get('/', //get all Video Ads for flutter
basicAuthUser,
checkSession,
getAllVideo);

router.put('/updateVideo', //update Video Ads for advertiser panel
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
updateVideoAds);

router.get('/showVideoComments', //show video comments on user 
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    showVideoComments);

router.delete('/', //delete single Video Ads for advertiser panel
basicAuthUser,
checkSession,
checkQuery('_id'), //post Id
deleteVideo);

router.get('/getSingleVideo', //get advertiser posted Video Ads for advertiser panel
basicAuthUser,
checkSession,
checkQuery('_id'),
getAdvertiserPosteVideo);

router.put('/likeVideo', //like Video Ads for flutter
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
checkRequestBodyParams('_userId'),
likeVideo);

router.put('/unLikeVideo', //unlike Video Ads for fluttter
basicAuthUser,
//checkSession,
checkRequestBodyParams('_id'),
checkRequestBodyParams('userId'),
unLikeVideo);

router.put('/commentVideo', //comment Video Ads for flutter 
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
checkRequestBodyParams('userId'),
checkRequestBodyParams('comment'),
commentVideo);

router.put('/deleteCommentVideo', //delete comment Video Ads for flutter
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
checkRequestBodyParams('commentId'),    
deleteCommentVideo);

router.get('/countVideoAds', //count Video Ads for advertiser panel
    basicAuthUser,
    checkSession,
    checkQuery('advertiserId'),
    countVideoAds
    );

router.get('/getSingleVideoAds', //get single Video Ads for advertiser panel
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleVideoAds);




export default router;