import FeatureModel from "../models/feature.js";

const featureController = {
  create: async (req, res) => {
    try {
      const { title, description, icon, order } = req.body;
      
      if (!title || !description || !icon) {
        return res.status(400).json({
          allOK: false,
          message: "Todos los campos son requeridos: title, description, icon",
          data: null,
        });
      }

      const newFeature = new FeatureModel({
        title,
        description,
        icon,
        order: order || 0
      });

      const featureCreated = await newFeature.save();
      res.status(201).json({
        allOK: true,
        message: "Característica creada exitosamente",
        data: featureCreated,
      });
    } catch (error) {
      console.error("Error creating feature:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear la característica",
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

      const features = await FeatureModel.find(filter).sort({ order: 1, createdAt: -1 });
      res.status(200).json({
        allOK: true,
        message: "Todas las características recuperadas exitosamente",
        data: features,
      });
    } catch (error) {
      console.error("Error retrieving features:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar las características",
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

      const feature = await FeatureModel.findById(id);
      if (!feature) {
        return res.status(404).json({
          allOK: false,
          message: `Característica con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Característica con ID ${id} encontrada`,
        data: feature,
      });
    } catch (error) {
      console.error("Error retrieving feature:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar la característica",
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

      const updatedFeature = await FeatureModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedFeature) {
        return res.status(404).json({
          allOK: false,
          message: `Característica con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Característica con ID ${id} actualizada exitosamente`,
        data: updatedFeature,
      });
    } catch (error) {
      console.error("Error updating feature:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar la característica",
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

      const featureDeleted = await FeatureModel.findByIdAndDelete(id);
      if (!featureDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `Característica con ID ${id} no encontrada`,
          data: null,
        });
      }
      res.status(200).json({
        allOK: true,
        message: `Característica con ID ${id} eliminada exitosamente`,
        data: null,
      });
    } catch (error) {
      console.error("Error deleting feature:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar la característica",
        data: error.message,
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const features = await FeatureModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
      res.status(200).json({
        allOK: true,
        message: "Características activas recuperadas exitosamente",
        data: features,
      });
    } catch (error) {
      console.error("Error retrieving active features:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar características activas",
        data: error.message,
      });
    }
  },

  getByTitle: async (req, res) => {
    try {
      const { title } = req.params;
      const features = await FeatureModel.find({ 
        title: { $regex: title, $options: 'i' },
        isActive: true 
      }).sort({ order: 1, createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Características con título ${title} recuperadas exitosamente`,
        data: features,
      });
    } catch (error) {
      console.error("Error retrieving features by title:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar características por título",
        data: error.message,
      });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { features } = req.body;
      
      if (!Array.isArray(features)) {
        return res.status(400).json({
          allOK: false,
          message: "Se requiere un array de características con sus nuevos órdenes",
          data: null,
        });
      }

      const updatePromises = features.map(feat => 
        FeatureModel.findByIdAndUpdate(feat.id, { order: feat.order }, { new: true })
      );

      const updatedFeatures = await Promise.all(updatePromises);
      
      res.status(200).json({
        allOK: true,
        message: "Orden de características actualizado exitosamente",
        data: updatedFeatures,
      });
    } catch (error) {
      console.error("Error updating feature order:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar el orden de características",
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

      const feature = await FeatureModel.findById(id);
      if (!feature) {
        return res.status(404).json({
          allOK: false,
          message: `Característica con ID ${id} no encontrada`,
          data: null,
        });
      }

      feature.isActive = !feature.isActive;
      const updatedFeature = await feature.save();

      res.status(200).json({
        allOK: true,
        message: `Característica ${updatedFeature.isActive ? 'activada' : 'desactivada'} exitosamente`,
        data: updatedFeature,
      });
    } catch (error) {
      console.error("Error toggling feature active status:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al cambiar el estado de la característica",
        data: error.message,
      });
    }
  },

  getByIcon: async (req, res) => {
    try {
      const { icon } = req.params;
      const features = await FeatureModel.find({ 
        icon: { $regex: icon, $options: 'i' },
        isActive: true 
      }).sort({ order: 1, createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: `Características con icono ${icon} recuperadas exitosamente`,
        data: features,
      });
    } catch (error) {
      console.error("Error retrieving features by icon:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar características por icono",
        data: error.message,
      });
    }
  },

  getFeatured: async (req, res) => {
    try {
      const { limit = 6 } = req.query;
      const features = await FeatureModel.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .limit(parseInt(limit));

      res.status(200).json({
        allOK: true,
        message: "Características destacadas recuperadas exitosamente",
        data: features,
      });
    } catch (error) {
      console.error("Error retrieving featured features:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al recuperar características destacadas",
        data: error.message,
      });
    }
  }
};

export default featureController; 