import AccessoryModel from "../models/accessory.js";

const accessoryController = {
  create: async (req, res) => {
    try {
      const { name, category, brand, description, price, imageUrl, stock, compatibleWith, color, wireless } = req.body;
      
      if (!name || !category || !brand || !description || price === undefined) {
        return res.status(400).json({
          allOK: false,
          message: "Todos los campos son requeridos: name, category, brand, description, price",
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

      const newAccessory = new AccessoryModel({
        name,
        category,
        brand,
        description,
        price,
        imageUrl,
        stock: stock || 0,
        compatibleWith: compatibleWith || [],
        color: color || 'Negro',
        wireless: wireless || false
      });

      const accessoryCreated = await newAccessory.save();
      res.status(201).json({
        allOK: true,
        message: "Accesorio creado exitosamente",
        data: accessoryCreated,
      });
    } catch (error) {
      console.error("Error creating accessory:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear el accesorio",
        data: error.message,
      });
    }
  },

  readAll: async (req, res) => {
    try {
      const { category, brand, compatibleWith, minPrice, maxPrice, inStock, wireless } = req.query;
      let filter = { isActive: true };

      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      if (compatibleWith) filter.compatibleWith = { $in: [compatibleWith] };
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      if (inStock === 'true') filter.stock = { $gt: 0 };
      if (wireless === 'true') filter.wireless = true;

      const accessories = await AccessoryModel.find(filter).sort({ createdAt: -1 });
      res.status(200).json({
        allOK: true,
        message: "Todos los accesorios recuperados exitosamente",
        data: accessories,
      });
    } catch (error) {
      console.error("Error retrieving accessories:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar los accesorios",
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

      const accessory = await AccessoryModel.findById(id);
      if (!accessory) {
        return res.status(404).json({
          allOK: false,
          message: `Accesorio con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Accesorio con ID ${id} encontrado`,
        data: accessory,
      });
    } catch (error) {
      console.error("Error retrieving accessory:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar el accesorio",
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

      const updatedAccessory = await AccessoryModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedAccessory) {
        return res.status(404).json({
          allOK: false,
          message: `Accesorio con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Accesorio con ID ${id} actualizado exitosamente`,
        data: updatedAccessory,
      });
    } catch (error) {
      console.error("Error updating accessory:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar el accesorio",
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

      const accessoryDeleted = await AccessoryModel.findByIdAndDelete(id);
      if (!accessoryDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `Accesorio con ID ${id} no encontrado`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Accesorio con ID ${id} eliminado exitosamente`,
        data: null,
      });
    } catch (error) {
      console.error("Error deleting accessory:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar el accesorio",
        data: error.message,
      });
    }
  },

  getByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const accessories = await AccessoryModel.find({ 
        category, 
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Accesorios de categoría ${category} recuperados exitosamente`,
        data: accessories,
      });
    } catch (error) {
      console.error("Error retrieving accessories by category:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar accesorios por categoría",
        data: error.message,
      });
    }
  },

  getByBrand: async (req, res) => {
    try {
      const { brand } = req.params;
      const accessories = await AccessoryModel.find({ 
        brand, 
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Accesorios de marca ${brand} recuperados exitosamente`,
        data: accessories,
      });
    } catch (error) {
      console.error("Error retrieving accessories by brand:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar accesorios por marca",
        data: error.message,
      });
    }
  },

  getCompatibleWith: async (req, res) => {
    try {
      const { console } = req.params;
      const accessories = await AccessoryModel.find({ 
        compatibleWith: { $in: [console, 'Universal'] },
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Accesorios compatibles con ${console} recuperados exitosamente`,
        data: accessories,
      });
    } catch (error) {
      console.error("Error retrieving compatible accessories:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar accesorios compatibles",
        data: error.message,
      });
    }
  },

  getInStock: async (req, res) => {
    try {
      const accessories = await AccessoryModel.find({ 
        stock: { $gt: 0 },
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: "Accesorios en stock recuperados exitosamente",
        data: accessories,
      });
    } catch (error) {
      console.error("Error retrieving accessories in stock:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar accesorios en stock",
        data: error.message,
      });
    }
  },

  getWireless: async (req, res) => {
    try {
      const accessories = await AccessoryModel.find({ 
        wireless: true,
        isActive: true 
      }).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: "Accesorios inalámbricos recuperados exitosamente",
        data: accessories,
      });
    } catch (error) {
      console.error("Error retrieving wireless accessories:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar accesorios inalámbricos",
        data: error.message,
      });
    }
  }
};

export default accessoryController; 