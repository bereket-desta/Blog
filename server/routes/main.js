
const express = require('express');
const router = express.Router();
const {marked} = require('marked');
const posts= require('../models/post');
//const post = require('../models/post');
//const { MongoClient } = require('mongodb');



//Routes


/*
* GET 
* Home
*/
// router.get('/', async(req, res) => {

//     const locals = {
//         title:"My Node.js Blog",
//         description:"simple Blog website with nodeja, express & mongodb"
//     }

//     try{
//         const data = await posts.find();
//         res.render('index', {locals, data});
//     }
//     catch(error){
//         console.log(error);
//     }

    
// });



//pagination
router.get('/', async(req, res) => {

   

    try{
        const locals = {
            title:"My Node.js Blog",
            description:"simple Blog website with nodeja, express & mongodb"
        }
        let perpage = 10;
        let page = req.query.page || 1;

        const data = await posts.aggregate([{$sort: {createdAt: -1}}])
        .skip(perpage * page - perpage)
        .limit(perpage)
        .exec();

        const count = await posts.countDocuments();
        const nextpage = parseInt(page)+1;
        const hasnextpage = nextpage <= Math.ceil(count/perpage) 
       
        res.render('index', {
             locals,
             data,
             current: page,
             nextpage: hasnextpage ? nextpage : null
            });
    }
    catch(error){
        console.log(error);
    }

    
});



/*
* GET 
* Post: id
*/
router.get('/post/:id', async (req, res) => {

    console.log('route accessed with ID:', req.params.id);
    
    try {
    
        let slug = req.params.id.trim();
        const data = await posts.findById(slug);

        if (!data) {
            return res.status(404).send('Post not found');
        }
        const locals = {
            title: data.title,
            description: "simple Blog website with Node.js, Express & MongoDB"
        };
        
        const renderBody = marked(data.body);
        
        res.render('post', { locals, data:{
            title: data.title,
            body: renderBody
        } 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

/*
* post
* post: searchTerm
*/
router.post('/search', async(req, res) => {
try{
    const locals = {
        title: "Search",
        description: "Simple blog created with Nodejs, Express & Mongodb."
    }

    let searchTerm = req.body.searchTerm;
    //console.log(searchTerm);
    const searchNoSpacialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

    const data = await posts.find({
        $or: [
            {title: {$regex: new RegExp(searchNoSpacialChar, 'i')}},
            {body: {$regex: new RegExp(searchNoSpacialChar, 'i')}}
        ]
    })

    res.render("search", {data, locals})
}

catch (error) {
    console.log(error);
}

});


/** testing to creat db post collection */

// const createPost = async () => {
//     try {
//         await posts.create([{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },{
//             title: 'Building a Blog',
//             body: 'This is body text'
//         },
//            ]);
//         console.log('Post created successfully');
//     } catch (error) {
//         console.error('Error creating post:', error.message);
//     }
// };


// createPost()




router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/contact', (req, res) => {
    res.render('contact');
})


module.exports = router;
