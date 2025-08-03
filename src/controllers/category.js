import CategoryModel from "../models/category.js";

const categoryController = {
  create: async (req, res) => {
    try {
      const { name, description, icon, route, imageUrl, order } = req.body;
      
      if (!name || !description || !icon || !route) {
        return res.status(400).json({
          allOK: false,
          message: "Todos los campos son requeridos: name, description, icon, route",
          data: null,
        });
      }

      const newCategory = new CategoryModel({
        name,
        description,
        icon,
        route,
        imageUrl,
        order: order || 0
      });

      const categoryCreated = await newCategory.save();
      res.status(201).json({
        allOK: true,
        message: "Categoría creada exitosamente",
        data: categoryCreated,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear la categoría",
        data: error.message,
      });
    }
  },

  readAll: async (req, res) => {
    try {
      const { active } = req.query;
      let filter = {};

      if (active === 'true') {
        filter.isActive = true;
      } else if (active === 'false') {
        filter.isActive = false;
      }

      const categories = await CategoryModel.find(filter).sort({ order: 1, createdAt: -1 });
      res.status(200).json({
        allOK: true,
        message: "Todas las categorías recuperadas exitosamente",
        data: categories,
      });
    } catch (error) {
      console.error("Error retrieving categories:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar las categorías",
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

      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({
          allOK: false,
          message: `Categoría con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Categoría con ID ${id} encontrada`,
        data: category,
      });
    } catch (error) {
      console.error("Error retrieving category:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar la categoría",
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

      const updatedCategory = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({
          allOK: false,
          message: `Categoría con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Categoría con ID ${id} actualizada exitosamente`,
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar la categoría",
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

      const categoryDeleted = await CategoryModel.findByIdAndDelete(id);
      if (!categoryDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `Categoría con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Categoría con ID ${id} eliminada exitosamente`,
        data: null,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar la categoría",
        data: error.message,
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const categories = await CategoryModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
      res.status(200).json({
        allOK: true,
        message: "Categorías activas recuperadas exitosamente",
        data: categories,
      });
    } catch (error) {
      console.error("Error retrieving active categories:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar categorías activas",
        data: error.message,
      });
    }
  },

  getByRoute: async (req, res) => {
    try {
      const { route } = req.params;
      const category = await CategoryModel.findOne({ route, isActive: true });
      
      if (!category) {
        return res.status(404).json({
          allOK: false,
          message: `Categoría con ruta ${route} no encontrada`,
          data: null,
        });
      }

      res.status(200).json({
        allOK: true,
        message: `Categoría con ruta ${route} encontrada`,
        data: category,
      });
    } catch (error) {
      console.error("Error retrieving category by route:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar categoría por ruta",
        data: error.message,
      });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { categories } = req.body;
      
      if (!Array.isArray(categories)) {
        return res.status(400).json({
          allOK: false,
          message: "Se requiere un array de categorías con sus nuevos órdenes",
          data: null,
        });
      }

      const updatePromises = categories.map(cat => 
        CategoryModel.findByIdAndUpdate(cat.id, { order: cat.order }, { new: true })
      );

      const updatedCategories = await Promise.all(updatePromises);
      
      res.status(200).json({
        allOK: true,
        message: "Orden de categorías actualizado exitosamente",
        data: updatedCategories,
      });
    } catch (error) {
      console.error("Error updating category order:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar el orden de categorías",
        data: error.message,
      });
    }
  },

  toggleActive: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB",
          data: null,
        });
      }

      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({
          allOK: false,
          message: `Categoría con ID ${id} no encontrada`,
          data: null,
        });
      }

      category.isActive = !category.isActive;
      const updatedCategory = await category.save();

      res.status(200).json({
        allOK: true,
        message: `Categoría ${updatedCategory.isActive ? 'activada' : 'desactivada'} exitosamente`,
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error toggling category active status:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al cambiar el estado de la categoría",
        data: error.message,
      });
    }
  }
};

export default categoryController; 