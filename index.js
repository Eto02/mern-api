const express = require('express');
const app = express()

app.use(()=>{
    console.log('hellow server')
})
app.listen(4000)