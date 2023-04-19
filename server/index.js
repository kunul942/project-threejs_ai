
const express = require('express')
const cors = require('cors')

const dalleRoutes = require('./routes/dalle.routes')

require('dotenv').config()



const app = express()

app.use( cors() )
app.use( express.json({ limit: '50mb' }) )

app.use('/api/v1/dalle', dalleRoutes )

app.get('/', ( req, res ) =>{
    res.status( 200 ).json({ message: 'Hello From DAll.E' })
})

app.listen( 8080, ()=> console.log('server has started on port 8080') )