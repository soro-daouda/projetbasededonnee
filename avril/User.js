let db;
module.exports = (_db)=>{
    db = _db
    return User
}
let User =  class {
    static setUser(element){
        return new Promise((next)=>{
            db.query('INSERT INTO utilisateurs (nom,prenoms,telephone,email,password) VALUES(?,?,?,?,?)',[element.nom,element.prenom,element.phone,element.email,element.passwordC])
            .then((result)=>{
                if(result)
                {
                    next(result)
                }
                else
                {
                    next(new Error('il y a eu une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }


    static updateUser(element){
        return new Promise((next)=>{
            db.query('UPDATE utilisateurs SET nom=?,prenoms=?,telephone=?,email=?, password=? WHERE id=?',[element.nom,element.prenom,element.phone,element.email,element.password, element.idUser])
            .then((result)=>{
                if(result[0])
                {
                    next(result[0])
                }
                else
                {
                    next(new Error('il y a eu une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getUser(id){
        return new Promise((next)=>{
            db.query('SELECT * FROM utilisateurs WHERE id=?',[id])
            .then((result)=>{
                if(result[0])
                {
                    next(result[0])
                }
                else
                {
                    next(new Error('il y a eu une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getproduitL(id){
        return new Promise((next)=>{
            db.query('SELECT * FROM produit_location WHERE id=?',[id])
            .then((result)=>{
                if(result[0])
                {
                    next(result[0])
                }
                else
                {
                    next(new Error('il y a eu une erreur'));
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getproduitV(id){
        return new Promise((next)=>{
            db.query('SELECT * FROM produit_vente WHERE id=?',[id])
            .then((result)=>{
                if(result[0])
                {
                    next(result[0])
                }
                else
                {
                    next(new Error('il y a eu une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getproduitlocation(){
        return new Promise((next)=>{
            db.query('SELECT * FROM produit_location')
            .then((result)=>{
                if(result){
                    next(result)
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getproduitvente(){
        return new Promise((next)=>{
            db.query('SELECT * FROM produit_vente')
            .then((result)=>{
                if(result){
                    next(result)
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

// commande location

static setCommandeLocation(element){
    return new Promise((next)=>{
        db.query('INSERT INTO commandelocation (quantité,prix_total,id_user,id_produit_location,datecommande) VALUES(?,?,?,?,NOW())',[element.quantite,element.prix_total,element.id_user,element.id_produit_location])
        .then((result)=>{
            if(result)
            {
                next(result)
            }
            else
            {
                next(new Error('il y a eu une erreur'))
            }
        })
        .catch((error)=>{
            next(error)
        })
    })
}


// achat

static setCommandeVente(element){
    return new Promise((next)=>{
        db.query('INSERT INTO commandevente (quantité,prix_total,id_user,id_produit_vente,datecommande) VALUES(?,?,?,?,NOW())',[element.quantite,element.prix_total,element.id_user,element.id_produit_vente])
        .then((result)=>{
            if(result)
            {
                next(result)
            }
            else
            {
                next(new Error('il y a eu une erreur'))
            }
        })
        .catch((error)=>{
            next(error)
        })
    })
}

    static connexion(email,password){
        return new Promise((next) => {
            db.query('select * from utilisateurs where email = ? and password = ?', [email, password])
            .then((result) => {
                if(result[0] !== undefined){
                    return next(result[0])
                } else {
                    return next(new error('les données ne sont pas dans notre base de donnée'))
                }
            }).catch((error) => {
                next(error)
            })
        })
    }
/*
    static getRestaurants(id_commune){
        return new Promise((next)=>{
            db.query('SELECT *FROM restaurants WHERE id_communes = ?',[id_commune])
            .then((result)=>{
                if(result){
                    next(result)
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }

    static getCommuneName(id_commune){
        return new Promise((next)=>{
            db.query('SELECT nom_communes FROM communes WHERE id_commmunes = ?',[id_commune])
            .then((result)=>{
                if(result[0]){
                    next(result[0])
                }
                else{
                    next(new Error('il ya une erreur'))
                }
            })
            .catch((error)=>{
                next(error)
            })
        })
    }
*/
}