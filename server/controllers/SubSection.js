const SubSection = require('../models').SubSection;

const Section = 
require('../models').Section;

const {uploadV}



// create subsection

exports.createSubSection = async (req, res) => {
    try{
        // fetch data from request body


        const {title,timeDuration,description,videoUrl,sectionId} = req.body;

        // file upload
        const video = req.files.video;

        // validate request body

        if(!title || !timeDuration || !description || !videoUrl || !sectionId){
            return res.status(400).json({
                success:false,
                message: "Please include all fields"
            })
        }
        // upload video to cloudinary

        

        // create new subsection entry

        const newSubSection = await SubSection.create({

    }