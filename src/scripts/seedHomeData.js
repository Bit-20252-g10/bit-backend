import connectDB from '../config/db.js';
import CategoryModel from '../models/category.js';
import FeatureModel from '../models/feature.js';
import HomeModel from '../models/home.js';

const seedHomeData = async () => {
  try {
    await connectDB();
    
    // Limpiar datos existentes
    await CategoryModel.deleteMany({});
    await FeatureModel.deleteMany({});
    await HomeModel.deleteMany({});
    
    // Crear categorías
    const categories = [
      {
        name: "Consolas",
        description: "PlayStation, Xbox, Nintendo y más",
        icon: "🎮",
        route: "/consolas",
        order: 1
      },
      {
        name: "Juegos",
        description: "Los mejores títulos para todas las plataformas",
        icon: "🎯",
        route: "/juegos",
        order: 2
      },
      {
        name: "Accesorios",
        description: "Controles, audífonos, cargadores y más",
        icon: "🎧",
        route: "/accesorios",
        order: 3
      }
    ];
    
    await CategoryModel.insertMany(categories);
    console.log('✅ Categorías creadas exitosamente');
    
    // Crear características
    const features = [
      {
        title: "Amplia Selección",
        description: "Miles de juegos y accesorios para todas las consolas",
        icon: "🎮",
        order: 1
      },
      {
        title: "Envío Rápido",
        description: "Entrega en 24-48 horas en toda la ciudad",
        icon: "🚚",
        order: 2
      },
      {
        title: "Mejores Precios",
        description: "Garantizamos los precios más competitivos del mercado",
        icon: "💰",
        order: 3
      },
      {
        title: "Garantía Total",
        description: "Todos nuestros productos incluyen garantía oficial",
        icon: "🛡️",
        order: 4
      }
    ];
    
    await FeatureModel.insertMany(features);
    console.log('✅ Características creadas exitosamente');
    
    // Crear configuración del hero
    const homeConfig = new HomeModel({
      heroTitle: "Bienvenido a Princegaming",
      heroSubtitle: "Tu tienda de confianza para consolas, juegos y accesorios gaming",
      heroButtonText: "Explorar Consolas",
      heroButtonRoute: "/consolas"
    });
    
    await homeConfig.save();
    console.log('✅ Configuración del hero creada exitosamente');
    
    console.log('🎉 Todos los datos de la página de inicio han sido creados exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al crear los datos:', error);
    process.exit(1);
  }
};

seedHomeData(); 