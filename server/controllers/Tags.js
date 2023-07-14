const Tag  = require('../models/Tag');

// createTag
exports.createTag = async(req, res) => {
    try{

        // fetch data from request body
        const {name,description} = req.body;

        // validate request body

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message: "Please include all fields"
            })
        }

        // create new tag entry

        const newTag = await Tag.create({
            name:name,
            description : description
        })

        // return response

        return res.status(200).json({
            success:true,
            message: "Tag created successfully",
            data: newTag
        })



    }
    catch(error){
        return res.status(500).json({
            success:false,
            
            message: error.message
        })
    }
}

// get all tags

exports.getAllTags = async(req, res) => {
    try{
        const allTags = await Tag.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message: "Tags fetched successfully",
            data: allTags
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            
            message: error.message
        })
    }
}