const express=require('express');
const Feedback=require('../model/Feedback');
const router=express.Router();


router.post('/sendFeedback', async (req, res) => {
    const { username, subject, message } = req.body;
  
    try {
      const newFeedback = new Feedback({
        username,
        subject,
        message,
      });
  
      await newFeedback.save();
  
      res.json({ success: true, msg: 'Feedback sent!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, msg: 'Failed to send feedback' });
    }
  });




module.exports=router;