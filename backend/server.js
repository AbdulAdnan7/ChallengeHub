const express = require('express')
const app = express()

app.use(express.json())

const PORT = 5000;

const throttleMap = new Map()

app.get('/throttle', (req, res) => {
    //identifies the user with ip address
    const user = req.ip

    //current time in milliseconds
    const now = Date.now()

    //Get the last time the user called this API?
    //if USER never called before, default = 0
    const lastCall = throttleMap.get(user) || 0

    //check if user is calling too quickly
    if(now - lastCall < 5000) {
        //if less than 5 seconds passed -> blocks requests
        return res.status(429).json({
            message: 'Too many requests. try again later'
        })
    }

    //update last request time
    throttleMap.set(user, now)

    //allow requests
    res.json({
        message: "REqueest successful (throttle endpoint)"
    })
})

/*
------------------------------------
DEBOUNCING SECTION
------------------------------------

Idea: If a user sends multiple requests quickly
only the LAST request will be processed


*/

//Store timers for each user
const debounceTimers = new Map();

app.get('/debounce', (req, res) => {
    const user = req.ip;

    //If a timer already exists for this user
    //cancel it (because a new request came)
    if(debounceTimers.has(user)) {
        clearTimeout(debounceTimers.get(user))
    }

    const timer = setTimeout(() => {
        console.log('FInal debounced request executed for: ', user)

    }, 3000)

    //Save this timer in the map
    debounceTimers.set(user, timer)

    //send immediate response
    res.json({
        message: "Request received. Waiting to see if more requests come....",
        note: "If you send another request within 3 seconds, the previous one is cancelled"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
