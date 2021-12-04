var mongoose=require('mongoose');
var express=require('express')
const session=require('express-session');

var app=express();
app.set('view engine', 'ejs');

var bodyParser=require('body-parser');
const { check, validationResult } = require('express-validator');
var Schema=require('./userSchema');
var newbody = mongoose.model("latestcollection",Schema);
const THREE_HOURS=1000* 60 * 60 * 3
const{
    NODE_ENV='development',
    SESS_NAME='anjalisession',
    SESS_SECRET='secretcookie',
    SESS_LIFETIME=THREE_HOURS

}=process.env

const IN_PROD=NODE_ENV==='production '
          

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json());

        const redirectLogin=(req,res,next)=>{
            if(!req.session.userId){
                console.log("redirecting to /login by middleware redirectlogin");
                res.redirect('/login');
            }else{
                next();
            }
        }
            

    const redirectHome=(req,res,next)=>{
            if(req.session.userId){
                console.log("redirecting to /home by home middleware")
                res.redirect('/home')
            }else{
                next();
            }

    }
 

    app.use(session({
        name:SESS_NAME,
        resave:false,
        saveUninitialized:false,
        secret:SESS_SECRET,
        cookie : {
            maxAge:SESS_LIFETIME,
            sameSite:true,
            secure:IN_PROD,
        }
    }))


    app.get('/',redirectLogin,(req,res)=>{
        const{userId}=req.session;
        console.log(req.session);
        res.send(`IN HOME PAGE`
        )
    })
            app.get('/admin',(req,res)=>{
                var error=[]
                res.render('admin',{error})
            })
                app.post('/admin',(req,res)=>{
                    var email=req.body.email;
                    var password=req.body.password;
                     console.log(email +"  "+ password)
                        if(req.body.email==="anjalibadlani1999@gmail.com"){
                               newbody.findOne({email:req.body.email})
                                .then((student)=>{
                               if( student ){
                                    if(student.password === req.body.password ){
                                        console.log('admin authenticated');
                                         req.session.userId=req.body.email;
                                        newbody.find()
                                        .then((details=>{
                                            console.log(details)
                                            var error=[];
                                           res.render('adminhtml',{details});
                                        })

                                        )}
                                
                                    else{
                                        var error=[];
                                        error.push("Incorrect password");
                                        console.log('incorrect password')
                                        res.render("admin",{error});
                                    }
                               }
                               else{
                                    var error=[];
                                    error.push("Email does does not exist");
                                    console.log('Admin email doesnot match');
                                    res.render("admin",{error});
                               }
                            })
                             
            
                        }else{
                            res.render('notadmin'); 
                        }
            
                })
    app.get('/login',(req,res)=>{
     res.render('signin');
    })

    app.get('/register',(req,res)=>{
        res.render('register');
    })
    

app.post('/login',(req,res)=>{
console.log("in post login ");
        var email=req.body.email;
        var password=req.body.password;
        // console.log(email +"  "+ password)
            if(email && password){
                console.log("finding " + email + " in database");
                   newbody.findOne({email:req.body.email})
                .then((student)=>{
                   if( student ){
                        if(student.password === req.body.password ){
                            console.log('user authenticated');
                            req.session.userId=req.body.email;
                            res.redirect('/home')
                        }
                        else{
                            res.send({passwordError: "incorrectPassword"})
                            console.log('incorrect password')
                        }
                   }else{
                    res.send({emailError: "incorrectEmail"})
                       console.log('User not found with this email')
                   }
                })
                
            }else{
                res.redirect('/login');
            }

})

        app.post('/register',(req,res)=>{
            console.log("in post register");
            var name=req.body.name;
            var email=req.body.email;
            var password=req.body.password;
                console.log(name +" "+ email +" "+password);
                newbody.findOne({email:req.body.email})
                .then((student)=>{
                    if(student){
                      res.send({usererror: "Userexists"})
                    }
                    else{
                        var sData = new newbody()
                        sData.name = req.body.name
                        sData.email= req.body.email
                        sData.password = req.body.password
                        sData.save()
                        req.session.userId=req.body.email;
                        console.log("DATA SAVED IN DATABASE");              
                        return res.redirect('/home');                    
                    }
                })            
                
               
        })
        app.get('/home' ,redirectLogin,(req,res)=>{
            newbody.findOne({email:req.session.userId})
            .then((student)=>{
                res.render('home.ejs',{student:student});
          
            })
            
        })

        

        app.post('/logout',redirectLogin,(req,res)=>{
            req.session.destroy(err=>{
                // console.log("error");
            if(err){
                return res.redirect('/login');
            }
        res.clearCookie(SESS_NAME);
        res.redirect('/login');

        })
        })

        app.listen(8000,function()
        {
            console.log("listening on port 8000");
        })
