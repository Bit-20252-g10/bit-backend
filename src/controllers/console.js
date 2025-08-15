import ConsoleModel from '../models/console.js';

const consoleController = {
  // GET all consoles
  readAll: async (req, res) => {
    try {
      const consoles = await ConsoleModel.find({ isActive: true });
      res.json({
        allOK: true,
        message: "Consolas obtenidas exitosamente",
        data: consoles,
      });
    } catch (error) {
      console.error("Error obteniendo consolas:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener consolas",
        data: error.message,
      });
    }
  },

  // GET single console by ID
  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const console = await ConsoleModel.findById(id);
      
      if (!console || !console.isActive) {
        return res.status(404).json({
          allOK: false,
          message: "Consola no encontrada",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Consola obtenida exitosamente",
        data: console,
      });
    } catch (error) {
      console.error("Error obteniendo consola:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener consola",
        data: error.message,
      });
    }
  },

  // POST create new console
  create: async (req, res) => {
    try {
      const newConsole = new ConsoleModel(req.body);
      const savedConsole = await newConsole.save();
      
      res.status(201).json({
        allOK: true,
        message: "Consola creada exitosamente",
        data: savedConsole,
      });
    } catch (error) {
      console.error("Error creando consola:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear consola",
        data: error.message,
      });
    }
  },

  // PUT update console by ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedConsole = await ConsoleModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedConsole || !updatedConsole.isActive) {
        return res.status(404).json({
          allOK: false,
          message: "Consola no encontrada",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Consola actualizada exitosamente",
        data: updatedConsole,
      });
    } catch (error) {
      console.error("Error actualizando consola:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar consola",
        data: error.message,
      });
    }
  },

  // DELETE console by ID (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedConsole = await ConsoleModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      
      if (!deletedConsole) {
        return res.status(404).json({
          allOK: false,
          message: "Consola no encontrada",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Consola eliminada exitosamente",
        data: deletedConsole,
      });
    } catch (error) {
      console.error("Error eliminando consola:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar consola",
        data: error.message,
      });
    }
  },
};

export default consoleController;
