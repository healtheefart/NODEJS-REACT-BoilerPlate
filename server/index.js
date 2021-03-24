const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const {User} = require('./models/User')
const config = require('./config/key')
const cookieParser = require('cookie-parser')
const {auth} = require('./middleware/auth')

mongoose.connect('mongodb+srv://leehajeong:1234@boiler-plate.xvjai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

// const bodyParser = require('body-parser')
// application/x-www-form-urlencoded
// express 4.16.0 버전에서는 bodyParser가 express generator에 내장되어 있어
// 따로 설치하지 않아도 되어bodyParser 대신 express라고 씀
app.use(express.urlencoded({extended:true}))
app.use(express.json()) // application/json
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 여러분')
})
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해왔다는 건 Authentication=true라는 말
  res.status(200).json({
    id: user._id,
    isAdmin: req.user.role === 0 ? false : true,  //role=0이면 일반유저, 0아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.lastname,
    image: req.user.image,

  })
})
 
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },  { token: "" }, (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})


app.post('/api/users/register', (req, res) => {
  
  const user = new User(req.body) // 회원가입 정보들을 client에서 가져오면 db에 넣어줌
  
  user.save((err, userInfo) => {  // save(): mongodb 메서드
  
    if(err) return res.json({ success: false, err })
    return res.status(200).json({success: true})

  })

})
app.post('/api/users/login', (req, res) => {

  User.findOne({email:req.body.email}, (err, user) => { // 요청된 이메일이 db에 있는지 확인/findOne():몽고db메서드
    
    if(!user) {
      return res.json({ 
        loginSuccess:false,
        message:"제공된 이메일에 해당하는 유저가 없습니다."})}
    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
    })
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})