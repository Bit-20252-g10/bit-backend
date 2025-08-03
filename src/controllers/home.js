import CategoryModel from "../models/category.js";
import FeatureModel from "../models/feature.js";
import HomeModel from "../models/home.js";
import GameModel from "../models/games.js";

const homeController = {
  getHomeData: async (req, res) => {
    try {
      const categories = await CategoryModel.find({ isActive: true }).sort({ order: 1 });
      
      const features = await FeatureModel.find({ isActive: true }).sort({ order: 1 });
      
      const homeConfig = await HomeModel.findOne({ isActive: true });
      
      const featuredGames = await GameModel.find().sort({ createdAt: -1 }).limit(6);
      
      const totalGames = await GameModel.countDocuments();
      
      res.status(200).json({
        allOK: true,
        message: "Home data retrieved successfully",
        data: {
          hero: homeConfig || {
            heroTitle: "Bienvenido a Princegaming",
            heroSubtitle: "Tu tienda de confianza para consolas, juegos y accesorios gaming",
            heroButtonText: "Explorar Consolas",
            heroButtonRoute: "/consolas"
          },
          categories,
          features,
          featuredGames,
          stats: {
            totalGames
          }
        }
      });
    } catch (error) {
      console.error("Error retrieving home data:", error);
      res.status(500).json({
        allOK: false,
        message: "Error retrieving home data",
        data: error.message,
      });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await CategoryModel.find({ isActive: true }).sort({ order: 1 });
      res.status(200).json({
        allOK: true,
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      console.error("Error retrieving categories:", error);
      res.status(500).json({
        allOK: false,
        message: "Error retrieving categories",
        data: error.message,
      });
    }
  },

  getFeatures: async (req, res) => {
    try {
      const features = await FeatureModel.find({ isActive: true }).sort({ order: 1 });
      res.status(200).json({
        allOK: true,
        message: "Features retrieved successfully",
        data: features,
      });
    } catch (error) {
      console.error("Error retrieving features:", error);
      res.status(500).json({
        allOK: false,
        message: "Error retrieving features",
        data: error.message,
      });
    }
  },

  getFeaturedGames: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const featuredGames = await GameModel.find().sort({ createdAt: -1 }).limit(limit);
      res.status(200).json({
        allOK: true,
        message: "Featured games retrieved successfully",
        data: featuredGames,
      });
    } catch (error) {
      console.error("Error retrieving featured games:", error);
      res.status(500).json({
        allOK: false,
        message: "Error retrieving featured games",
        data: error.message,
      });
    }
  },

  createCategory: async (req, res) => {
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
        message: "Category created successfully",
        data: categoryCreated,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({
        allOK: false,
        message: "Error creating category",
        data: error.message,
      });
    }
  },

  createFeature: async (req, res) => {
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
        message: "Feature created successfully",
        data: featureCreated,
      });
    } catch (error) {
      console.error("Error creating feature:", error);
      res.status(500).json({
        allOK: false,
        message: "Error creating feature",
        data: error.message,
      });
    }
  },

  updateHero: async (req, res) => {
    try {
      const { heroTitle, heroSubtitle, heroButtonText, heroButtonRoute, heroBackgroundImage } = req.body;
      
      let homeConfig = await HomeModel.findOne({ isActive: true });
      
      if (!homeConfig) {
        homeConfig = new HomeModel({
          heroTitle: heroTitle || "Bienvenido a Princegaming",
          heroSubtitle: heroSubtitle || "Tu tienda de confianza para consolas, juegos y accesorios gaming",
          heroButtonText: heroButtonText || "Explorar Consolas",
          heroButtonRoute: heroButtonRoute || "/consolas",
          heroBackgroundImage
        });
      } else {
        if (heroTitle) homeConfig.heroTitle = heroTitle;
        if (heroSubtitle) homeConfig.heroSubtitle = heroSubtitle;
        if (heroButtonText) homeConfig.heroButtonText = heroButtonText;
        if (heroButtonRoute) homeConfig.heroButtonRoute = heroButtonRoute;
        if (heroBackgroundImage !== undefined) homeConfig.heroBackgroundImage = heroBackgroundImage;
      }
      
      const updatedConfig = await homeConfig.save();
      
      res.status(200).json({
        allOK: true,
        message: "Hero configuration updated successfully",
        data: updatedConfig,
      });
    } catch (error) {
      console.error("Error updating hero configuration:", error);
      res.status(500).json({
        allOK: false,
        message: "Error updating hero configuration",
        data: error.message,
      });
    }
  }
};

export default homeController; 