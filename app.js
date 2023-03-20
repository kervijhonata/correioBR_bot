const express = require("express")
const dotenv = require("dotenv")
const TelegramBot = require("telebot")
const path = require("path")
const bodyParser = require("body-parser")
const hbs = require("express-hbs")
const Axios = require("axios")


// Configs
    const app = express()

    // DotEnv
    dotenv.config()

    // View engine
    app.engine("hbs", hbs.express4({
        layoutsDir: path.join(__dirname, "./views/layouts"),
        defaultLayout: path.join(__dirname, "./views/layouts/main"),
        partialsDir: path.join(__dirname, "./views/partials")
    }))
    app.set("view engine", "hbs")
    app.set("views", path.join(__dirname, "./views"))

    // BodyParser
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    // Static files
    app.use(express.static(path.join(__dirname, "./public")))
    
    const {TELEGRAM_BOT_TOKEN, SERVER_URL} = process.env
    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`
    const URI = `/webhook/${TELEGRAM_BOT_TOKEN}`
    const WEBHOOK_URL = SERVER_URL + URI

    // Telebot
    const telebot = new TelegramBot({
        token: TELEGRAM_BOT_TOKEN,
        polling: true
    })

    telebot.start()

    const init = async () => {
        const res = await Axios.get(`${TELEGRAM_API}/setWebHook?url=${WEBHOOK_URL}`)
        console.log(res.data)
    }

    
// Routes
app.get("/", (req, res, next) => {
    res.render("index")
})

app.get("/send-messages", (req, res, next) => {
    res.render("send-messages")
})

app.post(URI, async () => {
    const res = await Axios.get(`${TELEGRAM_API}/setWebhook?url${WEBHOOK_URL}`)
    console.log(res.data)
})

app.post("/send-messages", (req, res, next) => {

    res.render("send-messages")

    telebot.getMe()
    .then((me) => {
        console.log(me)
        telebot.sendMessage(me.id, req.body.message)
        .then(()=>{
            console.log("mensagem enviada com sucesso")
        })
        .catch((err) => {
            console.log("Não foi possível enviar sua mensagem")
        })
    })
    .catch((err) => {
        console.log(err)
    })
    
})

/*telebot.on(/getme/, (msg)=>{
    telebot.getMe()
    .then((me) => {
        let meInfo = JSON.stringify(me)
        msg.reply.text(meInfo)
        console.log(meInfo)
    })
    .catch((err) => {
        console.log(err)
    })
})*/

telebot.on(/hi/, (res) => {
    telebot.sendMessage(res.from.id, "Olá!")
})

// Listening
app.listen(process.env.SERVER_PORT, async () => {
    console.log("Server running on port " + process.env.SERVER_PORT)
    // await init()
})