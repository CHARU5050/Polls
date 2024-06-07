const express=require('express');
const Poll=require('../model/Poll');
const router=express.Router();


router.post('/create', async (req, res) => {
    try {
      const { question, options, username, expiration, openvote } = req.body;
  
      const newPoll = new Poll({
        question,
        options: options.map(option => ({
          id: option.id,
          option_text: option.options,
          vote_count: option.count,
        })),
        username,
        expiration,
        openvote,
      });
  
      const savedPoll = await newPoll.save();
      res.status(201).json({ pollid: savedPoll._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  router.post('/getonepoll', async (req, res) => {
    try {
      
      const { pollid } = req.body;
    
 
      const poll = await Poll.findOne({ _id: pollid});
      if (!poll) return res.status(404).send('Poll not found');
      res.json(poll);
    } catch (error) {
      
      res.status(500).send('Server Error');
    }
  });



  router.get('/getpollsbyuser', async (req, res) => {
    try {
      const { username } = req.params;
      const polls = await Poll.find({ username });
      res.json(polls);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  });
  

  router.get('/getallpolls', async (req, res) => {
    try {
      const polls = await Poll.find();
      res.json(polls);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  });

  router.post('/importance', async (req, res) => {
    const { pollid, starred } = req.body;
    
  
    try {
      // Find the poll by pollid and update the starred status
      const updatedPoll = await Poll.findOneAndUpdate(
        { _id: pollid },
        { starred: starred },
        { new: true }
      );
  
      if (!updatedPoll) {
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }
  
      res.json({ success: true, message: 'Starred status updated', poll: updatedPoll });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });


  router.post('/submitresponse', async (req, res) => {
    try {
      const { id, options, count, pollid, index, username, openvote } = req.body;
  
      // Update the vote count for the selected option
      await Poll.updateOne(
        { _id: pollid, 'options.id': id },
        { $set: { 'options.$.vote_count': count } }
      );
  
      // Update the voters array with the username and date
      await Poll.updateOne(
        { _id: pollid },
        { $push: { voters: { username, option_index: id, date: new Date() } } }
      );
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error submitting response:', error);
      res.status(500).json({ success: false, error: 'Failed to submit response' });
    }
  });
  

  router.delete('/deletepoll/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting poll with ID: ${id}`);
      const poll = await Poll.findByIdAndDelete(id);
      if (!poll) {
        return res.status(404).json({ success: false, message: 'Poll not found' });
      }
      res.json({ success: true, message: 'Poll deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
  


  router.put('/editpoll', async (req, res) => {
    const { pollid, question, expiration, options, openvote } = req.body;
  
    try {
      const updatedPoll = await Poll.findOneAndUpdate(
        { _id: pollid }, 
        {
          question: question,
          expiration: new Date(expiration),
          options: options,
          openvote: openvote
        },
        { new: true }
      );
  
      if (updatedPoll) {
        res.json({ success: true, poll: updatedPoll });
      } else {
        res.status(404).json({ success: false, message: 'Poll not found' });
      }
    } catch (error) {
      console.error('Error updating poll:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  



module.exports=router;