const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from req body
    const { email } = req.body;
    // check already user exist or not
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("Otp generated successsfully", otp);

    // unique otp for each user
    const checkOtp = await OTP.findOne({ otp: otp });

    while (checkOtp) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      checkOtp = await OTP.findOne({ otp: otp });
    }
    // create a entry in db

    const otpPayload = {
      email,
      otp,
    };

    const otpBody = await OTP.create(otpPayload);
    console.log("Otp created successfully", otpBody);

    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// signup

exports.signup = async (req, res) => {
  try {
    //    fetch data from req body
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate
    if(!firstName || !lastName || !email || !password || !confirmPassword
        || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // password match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password not matched" });
    }

    // check user already exist or not

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    // most recent otp

    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log(recentOtp);

    // validate otp

    if (recentOtp.length === 0) {
      return res.status(400).json({ message: "Otp not found" });
    } else if (recentOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid otp" });
    }

    // hash passowrd

    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in db

    const profileDetails = {
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    };
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      accountType,
      additionalDetails: profileDetails,
      contactNumber,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
    });

    return res.status(200).json({
        success: true,
        message: "User is Registered successfully",
         user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// login

exports.login = async (req, res) => {
    try{
        // fetch data from req body
        const { email, password } = req.body;
        // validate
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        // check user exist or not
        const user  = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        // generate jwt token after password matched 
       
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email : email,
                id : user._id,
                accountType : user.accountType,
            };
            const token = jwt.sign(payload , process.env.JWT_SECRET, { expiresIn: "2h" });
            user.token = token;
            user.password = undefined;
            // create cookie generator
    
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
    
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully",
                user,
                token
            });
        }
        else { 
            return res.status(400).json({ 
                success: false,
                message: "Password does not match" });
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// change password