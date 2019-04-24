const express = require('express')
const twig = require('twig')
const mysql = require('promise-mysql')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const crypto = require('crypto');
// const User = require('./User')
const expressValidator = require('express-validator')
// connexion à la base de donée

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bdconstruction'
}).then((db)=>{
    console.log('connexion effectuer avec succès')
    let app = express()
    app.use(session({
        secret: "keyboard Cat",
        resave: false,
        saveUninitialized: false
    }))
        app.use(expressValidator())
        app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    const User = require('./User')(db)
    app.set('view engine', 'twig')
    app.use(express.static(`${__dirname}/views`))
    app.get('/location',async(req,res)=>{
        let getProduit = await User.getproduitlocation()
        if(req.session.connect){
            let connecter = true;
            res.render('location', {user: req.session.connect, connecter:connecter,produits:getProduit})
        }
        else{
            let connecter = false;
            res.render('location', {connecter:connecter, produits:getProduit})
        }
    })
    app.get('/',(req,res)=>{
        if(req.session.connect){
            let connecter = true;
            res.render('index1', {user: req.session.connect, connecter:connecter})
        }
        else{
            let connecter = false;
            res.render('index1', {connecter:connecter})
        }
    })
    app.get('/connexion',(req,res)=>{
        if(req.session.connect){
            let connecter = true;
            res.render('connexion1', {user: req.session.connect, connecter:connecter})
        }
        else{
            let connecter = false;
            res.render('connexion1', {connecter:connecter})
        }
    })   
    app.get('/vente',async(req,res)=>{
        if(req.session.connect){
            let connecter = true;
            let getVente = await User.getproduitvente()
            res.render('vente', {user: req.session.connect, connecter:connecter,ventes:getVente})
        }
        else{
            let connecter = false;
            let getVente = await User.getproduitvente()
            res.render('vente', {connecter:connecter, ventes:getVente})
        }
    })



    // deconnexion

    app.get('/deconnexion', (req, res) => {
        delete req.session.connect
        res.redirect('/')
    })

    app.get('/contact',(req,res)=>{
        if(req.session.connect){
            let connecter = true;
            res.render('contact', {user: req.session.connect, connecter:connecter})
        }
        else{
            let connecter = false;
            res.render('contact', {connecter:connecter})
        }
    })

    app.post('/', async (req, res) => {
        if(req.body.type == "modiform"){
            let element = req.body
            let recup = await User.getUser(req.body.idUser)
            console.log(recup)
            if(recup.id){
                req.session.connect = recup
            res.redirect('/')
            }
            // let updateUser = await User.updateUser(element)
            // console.log(updateUser)
            // if(updateUser){
            //     let recup = await User.getUser(req.body.idUser)
            //     console.log(recup)
            //     req.session.connect = recup
            //     res.redirect('/')
            // }
        }
        else{
            req.check('nom', 'le nom ne peut etre vide et doit contenir que des caractères.').notEmpty().isString()
            req.check('prenom', 'le prenom ne peut etre vide et doit contenir que des caractères.').notEmpty().isString()
            req.check('phone', 'le numero ne peut etre vide et doit contenir que des chiffres.').notEmpty().isString()
            req.check('email', 'l\'email ne peut etre vide et doit contenir que de type E-mail.').notEmpty().isEmail()
            req.check('password', 'le mot de passe ne peut etre vide et doit etre fort.').notEmpty()
            req.check('passwordC', 'vous devez renseigner les memes mots de passe.').notEmpty()
            let erreur = req.validationErrors()
            
            if(erreur){
                res.render('index1', {erreurs:erreur})
            } else if(req.body.password != req.body.passwordC){
                let conform = 'Veillez bien renseigner les champs';
                let modal = true;
                res.render('index1', {conform:conform,showmodal:modal})
            } else {
                let recup = req.body
                console.log(recup)
                let inscript = await User.setUser(recup)
                if(inscript){
                    console.log(inscript)
                    res.render('connexion1')
                } else {
                    res.redirect('index1')
                }
            }
            
        }

    })

//location

app.post('/location', async (req,res) => {
    if(req.body.typeform = 'valideLocation'){
        let getInfo = await User.getproduitL(req.body.id)
        console.log(getInfo)
        res.render('validationl', {infos:getInfo,user:req.session.connect})
    }
    else if(req.body.typeForm == "validationlocation")
    {
        console.log(req.body)
        let insert = await User.setCommandeLocation(req.body)
        if(insert){
            res.render('validationl',{reussite:true})
        } else {
            let getInfo = await User.getproduitL(req.body.id_produit_location)
            res.render('validationl',{infos:getInfo})
        }
    }
})

// vente

app.post('/vente', async (req,res) => {
    if(req.body.typeform = 'valideVente'){
        let getInfo = await User.getproduitV(req.body.id)
        res.render('validationa', {infos:getInfo,user:req.session.connect})
    }
})
app.get('/validationl',(req,res)=>{
    res.render('validationl');
})
//connexion

app.post('/connexion', async (req, res) => {
    req.check('email', 'l\'email ne peut etre vide et doit de type email.').notEmpty().isEmail()
    req.check('password', 'le mot de passe ne peut etre vide.').notEmpty()
    let error = req.validationErrors();
    if(error){
        res.render('connexion1',{erreurs:error})
    } else {
        let info = req.body
        const connect = await User.connexion(info.email, info.password)
        if(connect.id){
            req.session.connect = connect
            res.redirect('/')
        } else {
            let faux = true
            res.render('connexion1',{noInscrit:faux})
        }
    }
})

// commande location

app.post('validationl', async (req,res) => {
    console.log(req.body)
    let insert = await User.setCommandeLocation(req.body)
    if(insert){
        res.render('validationl',{reussite:true})
    } else {
        let getInfo = await User.getproduitL(req.body.id_produit_location)
        res.render('validationl',{infos:getInfo})
    }
})

// commande vente

app.post('validationa', async (req,res) => {
    let insert = await User.setCommandeVente(req.body)
    if(insert){
        res.render('validationa',{reussite:true})
    } else {
        let getInfo = await User.getproduitV(req.body.id_produit_location)
        res.render('validationa',{infos:getInfo})
    }
})

app.listen(8090,console.log("j'écoute sur le port 8090"))
})
.catch((error)=>{
    console.log("connexion échoué")
})