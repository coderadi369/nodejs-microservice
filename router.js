const router =module.exports=require('express').Router()
const {IsAuthenticated}=require(`${__base}/utils/user`)

router.post('/login',(req,res)=>{
	res.status(200).json({'message':'route for checking login route'})
})

router.post('/path',IsAuthenticated,(req,res)=>{
	res.status(200).json({'message':'router for JSON patch'})
})

router.post('/thumbnail',IsAuthenticated,(req,res)=>{
	res.status(200).json({'message':'router'})
})