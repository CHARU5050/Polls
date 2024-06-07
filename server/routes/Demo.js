const express=require('express');
const Demo=require('../model/Demo');
const router=express.Router();






router.post('/getonepoll', async (req, res) => {
    try {
      
      const { pollid} = req.body;
    
 
      const poll = await Demo.findOne({ _id: pollid});
      if (!poll) return res.status(404).send('Poll not found');
      res.json(poll);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  });


  router.post('/submitresponse', async (req, res) => {
    try {
      const { id, options, count, pollid, index, username, openvote } = req.body;
  
      // Update the vote count for the selected option
      await Demo.updateOne(
        { _id: pollid, 'options.id': id },
        { $set: { 'options.$.vote_count': count } }
      );
  
      // Update the voters array with the username and date
     
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error submitting response:', error);
      res.status(500).json({ success: false, error: 'Failed to submit response' });
    }
  });
  


  module.exports=router;


