const Section = require("../models/Section");
const Course = require("../models/Course");
const exp = require("constants");

// create section

exports.createSection = async (req, res) => {
  try {
    // fetch data from request body

    const { sectionName, courseId } = req.body;

    // validate request body

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "sectionName and courseId are required",
      });
    }

    // create section

    const newSection = await Section.create({
      sectionName,
    });

    // update course with section

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    console.log(updatedCourse);

    // return response

    return res.status(200).json({
      success: true,
      message: "section created successfully",
      data: newSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// uupdate section

exports.updateSection = async (req, res) => {
  try {
    // fetch data from request body
    const { sectionName, sectionId } = req.body;

    // validate request body

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionName and sectionId are required",
      });
    }

    // update data

    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );
    // return response

    return res.status(200).json({
      success: true,
      message: "section updated successfully",
      data: section,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

// delete section

exports.deleteSection = async (req, res) => {
  try {
    // get section id from request params

    const { sectionId } = req.params;

    // use find by id and delete

    const section = await Section.findByIdAndDelete(sectionId);

    // return response

    return res.status(200).json({
      success: true,
      message: "section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};
