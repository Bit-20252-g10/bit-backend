import AccessoryModel from '../models/accessory.js';

const accessoryController = {
  // GET all accessories
  readAll: async (req, res) => {
    try {
      const accessories = await AccessoryModel.find({ isActive: true });
      res.json({
        allOK: true,
        message: "Accesorios obtenidos exitosamente",
        data: accessories,
      });
    } catch (error) {
      console.error("Error obteniendo accesorios:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener accesorios",
        data: error.message,
      });
    }
  },

  // GET single accessory by ID
  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const accessory = await AccessoryModel.findById(id);
      
      if (!accessory || !accessory.isActive) {
        return res.status(404).json({
          allOK: false,
          message: "Accesorio no encontrado",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Accesorio obtenido exitosamente",
        data: accessory,
      });
    } catch (error) {
      console.error("Error obteniendo accesorio:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener accesorio",
        data: error.message,
      });
    }
  },

  // POST create new accessory
  create: async (req, res) => {
    try {
      const newAccessory = new AccessoryModel(req.body);
      const savedAccessory = await newAccessory.save();
      
      res.status(201).json({
        allOK: true,
        message: "Accesorio creado exitosamente",
        data: savedAccessory,
      });
    } catch (error) {
      console.error("Error creando accesorio:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear accesorio",
        data: error.message,
      });
    }
  },

  // PUT update accessory by ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedAccessory = await AccessoryModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedAccessory || !updatedAccessory.isActive) {
        return res.status(404).json({
          allOK: false,
          message: "Accesorio no encontrado",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Accesorio actualizado exitosamente",
        data: updatedAccessory,
      });
    } catch (error) {
      console.error("Error actualizando accesorio:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar accesorio",
        data: error.message,
      });
    }
  },

  // DELETE accessory by ID (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedAccessory = await AccessoryModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      
      if (!deletedAccessory) {
        return res.status(404).json({
          allOK: false,
          message: "Accesorio no encontrado",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Accesorio eliminado exitosamente",
        data: deletedAccessory,
      });
    } catch (error) {
      console.error("Error eliminando accesorio:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar accesorio",
        data: error.message,
      });
    }
  },
};

export default accessoryController;
