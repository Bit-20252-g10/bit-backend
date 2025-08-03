import connectDB from '../config/db.js';
import CategoryModel from '../models/category.js';
import FeatureModel from '../models/feature.js';
import HomeModel from '../models/home.js';
import GameModel from '../models/games.js';
import ConsoleModel from '../models/console.js';
import AccessoryModel from '../models/accessory.js';
import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import { playstationGames, xboxGames, nintendoGames } from './gamesData.js';

const seedAllData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Iniciando seed de datos...');
    
    // Limpiar datos existentes
    await CategoryModel.deleteMany({});
    await FeatureModel.deleteMany({});
    await HomeModel.deleteMany({});
    await GameModel.deleteMany({});
    await ConsoleModel.deleteMany({});
    await AccessoryModel.deleteMany({});
    
    console.log('✅ Datos existentes eliminados');
    
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
    
    // Crear consolas reales
    const consoles = [
      {
        name: "PlayStation 5",
        brand: "PlayStation",
        model: "PS5",
        description: "La consola más potente de Sony con gráficos 4K y ray tracing",
        price: 1999960,
        stock: 25,
        features: ["4K Gaming", "Ray Tracing", "SSD Ultra Rápido", "DualSense Controller", "3D Audio"],
        releaseYear: 2020,
        color: "Blanco"
      },
      {
        name: "PlayStation 5 Digital Edition",
        brand: "PlayStation",
        model: "PS5 Digital",
        description: "PS5 sin lector de discos, solo juegos digitales",
        price: 1599960,
        stock: 20,
        features: ["4K Gaming", "Ray Tracing", "SSD Ultra Rápido", "DualSense Controller", "3D Audio"],
        releaseYear: 2020,
        color: "Blanco"
      },
      {
        name: "Xbox Series X",
        brand: "Xbox",
        model: "Series X",
        description: "La consola más potente de Microsoft con 4K gaming nativo",
        price: 1999960,
        stock: 22,
        features: ["4K Gaming", "Ray Tracing", "Quick Resume", "Game Pass", "Smart Delivery"],
        releaseYear: 2020,
        color: "Negro"
      },
      {
        name: "Xbox Series S",
        brand: "Xbox",
        model: "Series S",
        description: "Xbox compacta y económica, perfecta para 1440p gaming",
        price: 1199960,
        stock: 30,
        features: ["1440p Gaming", "Quick Resume", "Game Pass", "Smart Delivery", "All-Digital"],
        releaseYear: 2020,
        color: "Blanco"
      },
      {
        name: "Nintendo Switch OLED",
        brand: "Nintendo",
        model: "Switch OLED",
        description: "Nintendo Switch con pantalla OLED de 7 pulgadas",
        price: 349.99,
        stock: 28,
        features: ["Pantalla OLED", "Modo Portátil", "Joy-Con Controllers", "Nintendo eShop", "Tabletop Mode"],
        releaseYear: 2021,
        color: "Blanco"
      },
      {
        name: "Nintendo Switch",
        brand: "Nintendo",
        model: "Switch V2",
        description: "Nintendo Switch clásica con mejor batería",
        price: 299.99,
        stock: 35,
        features: ["Modo Portátil", "Joy-Con Controllers", "Nintendo eShop", "Tabletop Mode", "HD Rumble"],
        releaseYear: 2019,
        color: "Gris"
      }
    ];
    
    await ConsoleModel.insertMany(consoles);
    console.log('✅ Consolas creadas exitosamente');
    
    // Crear juegos de ejemplo
    const games = [
      ...playstationGames,
      ...xboxGames,
      ...nintendoGames
    ];
    
    await GameModel.insertMany(games);
    console.log('✅ Juegos creados exitosamente');
    
    // Crear accesorios de ejemplo
    const accessories = [
      {
        name: "DualSense Controller",
        category: "Controles",
        brand: "Sony",
        description: "Control inalámbrico para PlayStation 5 con haptic feedback",
        price: 279960,
        stock: 35,
        compatibleWith: ["PlayStation"],
        color: "Blanco",
        wireless: true
      },
      {
        name: "Xbox Wireless Controller",
        category: "Controles",
        brand: "Microsoft",
        description: "Control inalámbrico para Xbox Series X/S",
        price: 239960,
        stock: 28,
        compatibleWith: ["Xbox"],
        color: "Negro",
        wireless: true
      },
      {
        name: "Nintendo Switch Pro Controller",
        category: "Controles",
        brand: "Nintendo",
        description: "Control profesional para Nintendo Switch",
        price: 279960,
        stock: 20,
        compatibleWith: ["Nintendo"],
        color: "Negro",
        wireless: true
      },
      {
        name: "SteelSeries Arctis 7",
        category: "Audífonos",
        brand: "SteelSeries",
        description: "Audífonos gaming inalámbricos con sonido surround",
        price: 599960,
        stock: 12,
        compatibleWith: ["Universal"],
        color: "Negro",
        wireless: true
      },
      {
        name: "Cable HDMI 2.1",
        category: "Cables",
        brand: "Belkin",
        description: "Cable HDMI de alta velocidad para 4K gaming",
        price: 79960,
        stock: 50,
        compatibleWith: ["Universal"],
        color: "Negro",
        wireless: false
      },
      {
        name: "Cargador USB-C",
        category: "Cargadores",
        brand: "Anker",
        description: "Cargador rápido USB-C de 65W",
        price: 119960,
        stock: 25,
        compatibleWith: ["Universal"],
        color: "Negro",
        wireless: false
      }
    ];
    
    await AccessoryModel.insertMany(accessories);
    console.log('✅ Accesorios creados exitosamente');

    // Crear usuario de prueba para login
    const testEmail = 'pruebas@demo.com';
    const testPassword = 'Demo123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await UserModel.deleteOne({ email: testEmail });
    await UserModel.create({
      username: 'Usuario de Prueba',
      email: testEmail,
      password: hashedPassword
    });
    console.log('✅ Usuario de prueba creado: pruebas@demo.com / Demo123');
    
    console.log('🎉 ¡Todos los datos han sido creados exitosamente!');
    console.log('\n📊 Resumen de datos creados:');
    console.log(`   - ${categories.length} categorías`);
    console.log(`   - ${features.length} características`);
    console.log(`   - ${consoles.length} consolas`);
    console.log(`   - ${games.length} juegos`);
    console.log(`   - ${accessories.length} accesorios`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al crear los datos:', error);
    process.exit(1);
  }
};

seedAllData(); 