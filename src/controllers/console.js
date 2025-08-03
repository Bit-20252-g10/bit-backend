import ConsoleModel from "../models/console.js";

const consoleController = {
  create: async (req, res) => {
    try {
      const { name, brand, model, description, price, imageUrl, stock, features, releaseYear, color } = req.body;
      
      if (!name || !brand || !model || !description || price === undefined) {
        return res.status(400).json({
          allOK: false,
          message: "Todos los campos son requeridos: name, brand, model, description, price",
          data: null,
        });
      }
      
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
          allOK: false,
          message: "El precio debe ser un número válido mayor o igual a 0",
          data: null,
        });
      }

      const newConsole = new ConsoleModel({
        name,
        brand,
        model,
        description,
        price,
        imageUrl,
        stock: stock || 0,
        features: features || [],
        releaseYear,
        color: color || 'Negro'
      });

      const consoleCreated = await newConsole.save();
      res.status(201).json({
        allOK: true,
        message: "Consola creada exitosamente",
        data: consoleCreated,
      });
    } catch (error) {
      console.error("Error creating console:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear la consola",
        data: error.message,
      });
    }
  },

  readAll: async (req, res) => {
    try {
      const { brand, minPrice, maxPrice, inStock, releaseYear } = req.query;
      let filter = { isActive: true };

      if (brand) filter.brand = brand;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      if (inStock === 'true') filter.stock = { $gt: 0 };
      if (releaseYear) filter.releaseYear = parseInt(releaseYear);

      const consoles = await ConsoleModel.find(filter).sort({ createdAt: -1 });
      res.status(200).json({
        allOK: true,
        message: "Todas las consolas recuperadas exitosamente",
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving consoles:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar las consolas",
        data: error.message,
      });
    }
  },

  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB",
          data: null,
        });
      }

      const console = await ConsoleModel.findById(id);
      if (!console) {
        return res.status(404).json({
          allOK: false,
          message: `Consola con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Consola con ID ${id} encontrada`,
        data: console,
      });
    } catch (error) {
      console.error("Error retrieving console:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar la consola",
        data: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB",
          data: null,
        });
      }

      const updatedConsole = await ConsoleModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedConsole) {
        return res.status(404).json({
          allOK: false,
          message: `Consola con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Consola con ID ${id} actualizada exitosamente`,
        data: updatedConsole,
      });
    } catch (error) {
      console.error("Error updating console:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar la consola",
        data: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB",
          data: null,
        });
      }

      const consoleDeleted = await ConsoleModel.findByIdAndDelete(id);
      if (!consoleDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `Consola con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Consola con ID ${id} eliminada exitosamente`,
        data: null,
      });
    } catch (error) {
      console.error("Error deleting console:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar la consola",
        data: error.message,
      });
    }
  },

  getByBrand: async (req, res) => {
    try {
      const { brand } = req.params;
      const consoles = await ConsoleModel.find({ 
        brand, 
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Consolas de marca ${brand} recuperadas exitosamente`,
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving consoles by brand:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar consolas por marca",
        data: error.message,
      });
    }
  },

  getByModel: async (req, res) => {
    try {
      const { model } = req.params;
      const consoles = await ConsoleModel.find({ 
        model: { $regex: model, $options: 'i' },
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Consolas del modelo ${model} recuperadas exitosamente`,
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving consoles by model:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar consolas por modelo",
        data: error.message,
      });
    }
  },

  getInStock: async (req, res) => {
    try {
      const consoles = await ConsoleModel.find({ 
        stock: { $gt: 0 },
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: "Consolas en stock recuperadas exitosamente",
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving consoles in stock:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar consolas en stock",
        data: error.message,
      });
    }
  },

  getByReleaseYear: async (req, res) => {
    try {
      const { year } = req.params;
      const consoles = await ConsoleModel.find({ 
        releaseYear: parseInt(year),
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Consolas del año ${year} recuperadas exitosamente`,
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving consoles by release year:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar consolas por año de lanzamiento",
        data: error.message,
      });
    }
  },

  getByFeature: async (req, res) => {
    try {
      const { feature } = req.params;
      const consoles = await ConsoleModel.find({ 
        features: { $in: [feature] },
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Consolas con característica ${feature} recuperadas exitosamente`,
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving consoles by feature:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar consolas por característica",
        data: error.message,
      });
    }
  },

  getLatest: async (req, res) => {
    try {
      const { limit = 5 } = req.query;
      const consoles = await ConsoleModel.find({ isActive: true })
        .sort({ releaseYear: -1, createdAt: -1 })
        .limit(parseInt(limit));

      res.status(200).json({
        allOK: true,
        message: "Últimas consolas recuperadas exitosamente",
        data: consoles,
      });
    } catch (error) {
      console.error("Error retrieving latest consoles:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar las últimas consolas",
        data: error.message,
      });
    }
  }
};

export default consoleController; 