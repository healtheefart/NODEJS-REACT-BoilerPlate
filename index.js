const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const {User} = require('./models/User')
const config = require('./config/key')
// const bodyParser = require('body-parser')

// application/x-www-form-urlencoded
// express 4.16.0 버전에서는 bodyParser가 express generator에 내장되어 있어
// 따로 설치하지 않아도 되어bodyParser 대신 express라고 씀
app.use(express.urlencoded({extended:true}))
// application/json
app.use(express.json())

mongoose.connect('mongodb+srv://leehajeong:1234@boiler-plate.xvjai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 여러분')
})

app.post('/register', (req, res) => {
  // 회원가입 정보들을 client에서 가져오면 db에 넣어줌
  const user = new User(req.body)
  // mongodb 메서드
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})