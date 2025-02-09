import { Router} from "express";
const router:Router =Router();
import { saveImage,getAllImage,getAdvertiserPosteImage,deleteImage,likeImage,unLikeImage,commentImageAds,
    deleteImageCommentsAds,updateImageAds,countImageAds,getSingleImageAds,showImageComments} from "../controller/imageAds.controller";
import { basicAuthUser, } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
import { checkQuery,checkRequestBodyParams } from "../middleware/Validators";


router.post('/', //save Image Ads
basicAuthUser,
checkSession,
saveImage);

router.get('/', //get all Image Ads
basicAuthUser,
checkSession,
getAllImage);

router.put('/updateImage', //update Image Ads
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
updateImageAds);

router.delete('/', //delete single  Image Ads
basicAuthUser,
checkSession,
checkQuery('_id'), //post Id
deleteImage);

router.get('/imageAds', //get advertiser posted Image Ads
basicAuthUser,
 checkSession,
checkQuery('_id'),
getAdvertiserPosteImage);

router.put('/likeImage', //like Image Ads
basicAuthUser,
checkSession,
checkRequestBodyParams('_id'),
checkRequestBodyParams('userId'),
likeImage);

    router.put('/unLikeImage', //unlike Image Ads
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('userId'),
    unLikeImage);

router.put('/commentImage', //comment Image Ads
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('comment'),
    checkRequestBodyParams('userId'),
    commentImageAds);

    router.get('/showImageComments', //show Image comments on user 
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    showImageComments   
    );

router.put('/deleteCommentImage', //delete comment Image Ads
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('commentId'),    
    deleteImageCommentsAds);

router.get('/countImageAds', //count Image Ads
    basicAuthUser,
    checkSession,
    checkQuery('advertiserId'),
    countImageAds
    );

router.get('/getSingleImageAds', //get single Image Ads
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleImageAds)


export default router;