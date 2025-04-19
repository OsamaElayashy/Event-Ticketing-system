const eventmodel= require("../Models/Event.js")

const eventController={
    getallevents: async(req,res)=>{
        try {
        const event = await eventmodel.find();
        return res.status(200).json(event);
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    },
    
    getEvent: async (req, res) => {
        try {
          const event = await eventmodel.findById(req.params.id);
          return res.status(200).json(event);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },
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
      

    }


