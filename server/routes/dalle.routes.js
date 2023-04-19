const { Router } = require('express')

const { Configuration, OpenAIApi } = require('openai')

require('dotenv').config()

const router = Router()

//config dalle
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openAI = new OpenAIApi( config ) 

router.route('/').get(( req, res )=>{
    res.status(200).json({ message: 'Hello World DALL.E ROUTES' })
})

router.route('/').post( async( req, res ) =>{
    try {
        const { prompt } = req.body

        const resp = await openAI.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        })

        const image = resp.data.data[ 0 ].b64_json
        
        res.status( 200 ).json({ photo: image })

    } catch (error) {
        console.log({ error })
        res.status(500).json({ message: 'Something went wrong' })
    }
})


module.exports = router 