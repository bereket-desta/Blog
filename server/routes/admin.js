const express = require('express');
const router = express.Router();
const posts = require('../models/post');
const users = require('../models/user');
const bcrypt = require('bcrypt');       //to encrypt and decrypt password
const jwt = require('jsonwebtoken');    //helps with the cookies

const adminLayout = '../views/layouts/admin'
const jwtsecret = process.env.JWT_SECRET;




/*
* check login
*/

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    //console.log("Token: ", token )

    if(!token) {
        console.log("No token found")
        return res.status(401).json ({message: 'unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, jwtsecret);
        req.userId = decoded.userId;
        next();
    }
    catch (error){
        console.error('JWT verification error:', error);
        res.status(401).json ( {message: "Unauthorized"} )
    }
}






/*
* get/
* Admin - login page
*/

router.get('/admin', async (req, res) => {
    
    try{

        const locals = {
            title: "Admin",
            description: "Simple Blog Admin page"
        }

        res.render('admin/index', { locals, layout: adminLayout });

    }
    catch (error){
        console.log(error);
    }
});


/*
* get/
* Admin - login check
*/

router.post('/admin', async(req, res) => {

    try{
        const {username, password} = req.body;

        const user = await users.findOne({ username });

        if(!user){
            return res.status(401).json( {message: "incorect credentials!"} );
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        
        if(!passwordValid){
            return res.status( {message: "invalid password!"} );
        }

        const token = jwt.sign({userId: user._id}, jwtsecret);
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard');

    }

    catch (error){
        console.log(error)
    }
});


/*
* get
* admin dashboard
*/

router.get('/dashboard', authMiddleware, async(req, res) => {
    //res.status(200).json({message:'Protected route accessed'})

    try {
        const locals =
        {
            title: "Admin-Dashboard",
            description: "Blog website Admin page."
        }

        const data = await posts.find();
        res.render('admin/dashboard', { locals, data, layout: adminLayout });

    } catch (error) {
        console.log(error)
    }    
    
    
});



/*
* get
*  admin create new post
*/

router.get('/add-post', authMiddleware, async(req, res) => {
    
    try {
    
        const locals = {
            title: "Add Post",
            description: "Blog website Admin page."
        }

        const data = await posts.find()
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
})


/*
* post
* Admin create new post
*/

router.post('/add-post', authMiddleware, async(req, res) => {
    
    try {
        console.log(req.body);
        const newPost =new posts({
            title: req.body.title,
            body: req.body.body
        });
        await posts.create(newPost);
        res.redirect('/dashboard')
    } 
    
    catch (error) {
        console.log(error);
    }
})


/*
* get
* Admin edit post
*/
router.get('/edit-post/:id', authMiddleware, async(req, res) => {
    
    try {

        const locals = {
            title: 'Edit-post',
            description: 'Blog website admin page'
        };

        const data = await posts.findOne({_id: req.params.id});
        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }
})



/*
* PUT
* Admin edit post
*/
router.put('/edit-post/:id', authMiddleware, async(req,res) => {
    try {
        await posts.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect('/dashboard');

    } 
    catch (error) {
        console.log(error);    
    }
})



/*
* DELETE
* Admin Delete post
*/

router.delete('/delete-post/:id', authMiddleware, async(req, res) => {
    try {
        
        await posts.deleteOne({ _id: req.params.id } );
        res.redirect('/dashboard');

    } 
    catch (error) {
        console.log(error);    
    }
})


/*
* Get
* Admin logout
*/

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})


/*
*post
*admin -register
*/

router.post('/register', async(req, res) => {
    try{
        const {username, password, email} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
    
        try{ 
            
            const user = await users.create({username, password:hashedPassword, email});
            res.status(201).json({message: 'user created successfully!'});

        }
        catch (error){
            if (error.code === 11000) {
                res.status(409).json({message: "user alredy registerd"});
            }
            else{
            res.status(500).json({message: "internal server error"});
            }
        }

    }
    catch (error){
        console.log(error);
    }

})


module.exports = router;