const express=require('express');
const user=require('../model/user')
const Poll=require('../model/Poll');
const router=express.Router();
const bcrypt =require("bcrypt");
const jwt = require('jsonwebtoken');


async function checkAndDropEmailIndex() {
  const indexes = await user.collection.indexes();
  console.log(indexes+" ");
  const emailIndex = indexes.find(index => index.key.email);

  if (emailIndex) {
    await user.collection.dropIndex(emailIndex.name);
    console.log('Dropped email index');
  }
}

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, msg: 'Please fill all the fields!' });
    }
  
    try {
      const existingUser = await user.findOne({ username });
      if (existingUser) {
       console.log(existingUser)
        return res.json({ success: false, msg: 'Username already  exist!' });
      }
      await checkAndDropEmailIndex();
     
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new user({
        username,
        password: hashedPassword,

     });
   
  
      await newUser.save();
      
  
      return res.json({ success: true, msg: 'Registration successful!' });
    } catch (error) {
        console.log(error);
      return res.json({ success: false, msg: 'Error during registration!' });
    }
  });
  

  router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userDetails = await user.findOne({ username });
        if (!userDetails) return res.status(404).json("User not found!");

        const isPasswordValid = await bcrypt.compare(password, userDetails.password);
        if (!isPasswordValid) return res.status(400).json("Invalid password!");

        const token = jwt.sign({ id: userDetails._id }, "jwtkey");
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).status(200).json({ username: userDetails.username });
    } catch (err) {
      console.log(err);
        res.status(500).json(err);
    }
});


router.post('/deleteAccount', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await user.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid password' });
    }


    await user.deleteOne({ username });
    await Poll.deleteMany({ username });

    res.json({ success: true, msg: 'Account and associated polls deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Failed to delete account' });
  }
});



router.post('/changePass', async (req, res) => {
  const { oldpass, newpass, username } = req.body;
  
  try {
    const user_details = await user.findOne({ username });

    if (!user_details) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldpass, user_details.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPass = await bcrypt.hash(newpass, salt);

    user_details.password = hashedNewPass;
    await user_details.save(); // Ensure save is called on the instance

    res.json({ success: true, msg: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Failed to update password' });
  }
});





router.post('/security-question', async (req, res) => {
  const { username, question, answer, password } = req.body;
  try {
    const user_details = await user.findOne({ username });

    if (!user_details) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user_details.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Incorrect password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedAnswer = await bcrypt.hash(answer, salt);

    user_details.securityQuestion = question;
    user_details.answer = hashedAnswer;
    await user_details.save(); // Ensure save is called on the instance

    res.json({ success: true, msg: 'Security question and answer set!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Failed to set security question and answer' });
  }
});




router.post('/forgot-password', async (req, res) => {
  console.log("hello")
  const { username, question, answer} = req.body;
  try {
    const user_details = await user.findOne({ username:username ,securityQuestion:question});
    if (!user_details) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(answer, user_details.answer);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Incorrect password' });
    }
    else{
  
    return res.json({ success: true, msg: 'Security question and answer set!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Failed to set security question and answer' });
  }
});







router.post('/logout', (req, res) => {
  res.clearCookie("access_token", {
      sameSite: "none",
      secure: true
  }).status(200).json("User has been logged out.");
});


  module.exports=router;