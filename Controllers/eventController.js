const eventmodel= require("../Models/Event.js")

const eventController={
  // get all events admin/organizer
    getallevents: async(req,res)=>{
        try {
        const event = await eventmodel.find();
        return res.status(200).json(event);
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    },
    //get all approved events public
    getallapprovedevents: async(req,res)=>{
      try {
      const event = await eventmodel.find({status: 'approved'});
      return res.status(200).json(event);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },
  //get single event public
    getEvent: async (req, res) => {
        try {
          const event = await eventmodel.findById(req.params.id);
          return res.status(200).json(event);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },
      //create event organizer 
      createEvent: async (req, res) => {
        const event = new eventmodel({
          title: req.body.title,
          description: req.body.description,
          Date: req.body.Date,
          location: req.body.location,
          category: req.body.category,
          image: req.body.image,
          ticketPrice: req.body.ticketPrice,
          totaltickets: req.body.totaltickets,
          Organizer: req.body.Organizer,
          status: req.body.status
        });
        try {
          const newevent = await event.save();
          return res.status(201).json(newcourse);
        } catch (e) {
          return res.status(400).json({ message: e.message });
        }
      },

      //delete event organizer / admin

      deleteEvent: async (req, res) => {
        try {
          const deletedEvent = await eventmodel.findByIdAndDelete(req.params.id);
          if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
          }
          return res.status(200).json({ message: "Event deleted successfully" });
        } catch (e) {
          return res.status(500).json({ message: e.message });
        }
      },

      //update event organizer/ admin
    updateEvent: async (req, res) => {
      try {
        const updatedEvent = await eventmodel.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        if (!updatedEvent) {
          return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(updatedEvent);
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    },

    }

    


    


module.exports = eventController;
