import InventoryModel from "../models/inventory.js";

const homeController = {

  getHomeData: async (req, res) => {
    try {

      res.status(200).json({
        allOK: true,
        message: "Datos generales de la página de inicio obtenidos exitosamente.",
        data: {
          info: "Bienvenido a la API de la página de inicio. Usa otros endpoints para obtener datos específicos.",
        },
      });
    } catch (error) {
      console.error("Error al obtener los datos de la página de inicio:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener los datos de la página de inicio.",
        data: error.message,
      });
    }
  },


  getCategories: async (req, res) => {
    try {

      const categories = await InventoryModel.distinct("genero", { type: "games" });

      res.status(200).json({
        allOK: true,
        message: "Categorías obtenidas exitosamente.",
        data: categories,
      });
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener las categorías.",
        data: error.message,
      });
    }
  },


  getFeaturedGames: async (req, res) => {
    try {

      const featuredGames = await InventoryModel.find({ type: "games" }).sort({ createdAt: -1 }).limit(5);

      if (!featuredGames || featuredGames.length === 0) {
        return res.status(404).json({
          allOK: false,
          message: "No se encontraron juegos destacados.",
          data: null,
        });
      }

      res.status(200).json({
        allOK: true,
        message: "Juegos destacados obtenidos exitosamente.",
        data: featuredGames,
      });
    } catch (error) {
      console.error("Error al obtener los juegos destacados:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener los juegos destacados.",
        data: error.message,
      });
    }
  },

  getFeatures: async (req, res) => {
    try {
      res.status(200).json({
        allOK: true,
        message: "Funcionalidad de 'features' no implementada. Usa otros endpoints para obtener datos.",
        data: null,
      });
    } catch (error) {
      console.error("Error al obtener features:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener features.",
        data: error.message,
      });
    }
  },


  createCategory: async (req, res) => {
    res.status(405).json({
      allOK: false,
      message: "Las categorías se crean automáticamente al agregar un producto. No se permite crear una categoría directamente.",
      data: null,
    });
  },


  createFeature: async (req, res) => {
    res.status(405).json({
      allOK: false,
      message: "Las features se crean automáticamente al agregar un producto. No se permite crear una feature directamente.",
      data: null,
    });
  },


  updateHero: async (req, res) => {
    res.status(501).json({
      allOK: false,
      message: "El método 'updateHero' no está implementado aún.",
      data: null,
    });
  },
};

export default homeController;