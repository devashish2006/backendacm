import { Router } from 'express';
import { Event } from '../models/Event';

const router = Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find(); 
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error });
  }
});

// GET a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); 
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error });
  }
});

// POST a new event
router.post('/', async (req, res) => {
  const { title, description, imageUrl, date } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      imageUrl,
      date: new Date(date),
    });
    await newEvent.save(); 
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
});

// PUT (update) an existing event
router.put('/:id', async (req, res) => {
  const { title, description, imageUrl, date } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, date: new Date(date) },
      { new: true } 
    );
    if (updatedEvent) {
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error });
  }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id); 
    if (deletedEvent) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error });
  }
});

export { router as eventRoutes };
