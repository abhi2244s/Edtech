const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//createCourse

exports.createCourse = async (req, res) => {
  try {
    // fetch data from request body

    const {
      courseName,
      courseDescription,
      price,
      tag,
      image,
      whatYouWillLearn,
    } = req.body;

    // validate request body

    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !tag ||
      !image ||
      !whatYouWillLearn
    ) {
      return res.status(400).json({
        success: false,
        message: "Please include all fields",
      });
    }
    // check for instructor

    const userId = req.user.id;

    const instructorDetails = await User.findById(userId);

    // instructor not found

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // check given tag exists or not

    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // upload image to cloudinary

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create new course entry

    const newCourse = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      price: price,
      tag: tagDetails._id,
      image: thumbnailImage.secure_url,
      whatYouWillLearn: whatYouWillLearn,
      instructor: instructorDetails._id,
    });

    // add the coqurse to instructor's course list

    await User.findByIdAndUpdate(
      { id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
