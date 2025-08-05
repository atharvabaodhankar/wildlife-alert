const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");
const { authenticateJWT } = require("../middleware/auth");

// GET /api/animals - Get all animals
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const animals = await Animal.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ message: "Server error while fetching animals." });
  }
});

// POST /api/animals - Add new animal
router.post("/", authenticateJWT, async (req, res) => {
  try {
    console.log("📝 Adding animal request:", req.body);
    console.log("👤 User info:", req.user);
    
    const { name, description, habitat } = req.body;

    // Validation
    if (!name || !description || !habitat) {
      return res.status(400).json({ 
        message: "All fields (name, description, habitat) are required." 
      });
    }

    // Check if animal already exists (case-insensitive)
    const existingAnimal = await Animal.findOne({ 
      name: { $regex: new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "$", 'i') } 
    });
    
    if (existingAnimal) {
      return res.status(400).json({ 
        message: "An animal with this name already exists in the database." 
      });
    }

    // Create new animal
    const newAnimal = new Animal({
      name: name.trim(),
      description: description.trim(),
      habitat: habitat.trim(),
      createdBy: req.user.userId
    });

    console.log("🐾 Creating animal:", newAnimal);
    
    const savedAnimal = await newAnimal.save();
    await savedAnimal.populate('createdBy', 'name email');

    console.log("✅ Animal saved successfully:", savedAnimal);

    res.status(201).json({
      message: "Animal added successfully!",
      animal: savedAnimal
    });
  } catch (error) {
    console.error("❌ Error adding animal:", error);
    res.status(500).json({ message: "Server error while adding animal.", error: error.message });
  }
});

// GET /api/animals/:id - Get single animal
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!animal) {
      return res.status(404).json({ message: "Animal not found." });
    }
    
    res.json(animal);
  } catch (error) {
    console.error("Error fetching animal:", error);
    res.status(500).json({ message: "Server error while fetching animal." });
  }
});

// PUT /api/animals/:id - Update animal (only by creator or admin)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { name, description, habitat } = req.body;
    
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: "Animal not found." });
    }

    // Check if user is creator or admin
    if (animal.createdBy.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. You can only edit animals you created." });
    }

    // Update animal
    animal.name = name?.trim() || animal.name;
    animal.description = description?.trim() || animal.description;
    animal.habitat = habitat?.trim() || animal.habitat;

    const updatedAnimal = await animal.save();
    await updatedAnimal.populate('createdBy', 'name email');

    res.json({
      message: "Animal updated successfully!",
      animal: updatedAnimal
    });
  } catch (error) {
    console.error("Error updating animal:", error);
    res.status(500).json({ message: "Server error while updating animal." });
  }
});

// DELETE /api/animals/:id - Delete animal (only by creator or admin)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: "Animal not found." });
    }

    // Check if user is creator or admin
    if (animal.createdBy.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. You can only delete animals you created." });
    }

    await Animal.findByIdAndDelete(req.params.id);

    res.json({ message: "Animal deleted successfully!" });
  } catch (error) {
    console.error("Error deleting animal:", error);
    res.status(500).json({ message: "Server error while deleting animal." });
  }
});

module.exports = router;