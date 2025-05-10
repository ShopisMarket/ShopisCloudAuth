import express from 'express';
import auth from '../middleware/auth.js';
import List, { ListValidationSchema, ItemValidationSchema } from '../models/List.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET api/lists
// @desc    Get all lists for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find lists where user is owner or shared with
    const lists = await List.find({
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/lists/:id
// @desc    Get list by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user has access to this list
    if (list.owner.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to access this list' });
    }
    
    res.json(list);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/lists
// @desc    Create a list
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user.id };
    
    // Validate input with Zod
    const validatedData = ListValidationSchema.safeParse(data);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        msg: 'Validation error', 
        errors: validatedData.error.format() 
      });
    }
    
    // Create new list
    const newList = new List(validatedData.data);
    const list = await newList.save();
    
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/lists/:id
// @desc    Update a list
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user has access to update this list
    if (list.owner.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to update this list' });
    }
    
    // Update list fields
    if (req.body.name) list.name = req.body.name;
    if (req.body.totalBudget !== undefined) list.totalBudget = req.body.totalBudget;
    
    await list.save();
    
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/lists/:id
// @desc    Delete a list
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user is the owner
    if (list.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this list' });
    }
    
    await list.deleteOne();
    
    res.json({ msg: 'List removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/lists/:id/items
// @desc    Add item to a list
// @access  Private
router.post('/:id/items', auth, async (req, res) => {
  try {
    // Validate item data
    const validatedData = ItemValidationSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        msg: 'Validation error', 
        errors: validatedData.error.format() 
      });
    }
    
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user has access to this list
    if (list.owner.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to add items to this list' });
    }
    
    // Add item to list
    const newItem = validatedData.data;
    list.items.push(newItem);
    
    await list.save();
    
    // Return the newly added item
    res.json(list.items[list.items.length - 1]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/lists/:id/items/:itemId
// @desc    Update an item in a list
// @access  Private
router.put('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user has access to this list
    if (list.owner.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to update items in this list' });
    }
    
    // Find item in the list
    const item = list.items.id(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Update item fields
    if (req.body.name !== undefined) item.name = req.body.name;
    if (req.body.quantity !== undefined) item.quantity = req.body.quantity;
    if (req.body.price !== undefined) item.price = req.body.price;
    if (req.body.isPurchased !== undefined) item.isPurchased = req.body.isPurchased;
    
    await list.save();
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/lists/:id/items/:itemId
// @desc    Delete an item from a list
// @access  Private
router.delete('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user has access to this list
    if (list.owner.toString() !== req.user.id && 
        !list.sharedWith.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to delete items from this list' });
    }
    
    // Find item index
    const itemIndex = list.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Remove item
    list.items.splice(itemIndex, 1);
    await list.save();
    
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/lists/:id/share
// @desc    Share a list with another user
// @access  Private
router.post('/:id/share', auth, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }
    
    // Find user to share with
    const userToShareWith = await User.findOne({ email });
    
    if (!userToShareWith) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }
    
    // Check if user is the owner
    if (list.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only the owner can share this list' });
    }
    
    // Check if already shared with this user
    if (list.sharedWith.includes(userToShareWith._id)) {
      return res.status(400).json({ msg: 'List already shared with this user' });
    }
    
    // Add user to sharedWith array
    list.sharedWith.push(userToShareWith._id);
    await list.save();
    
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;