import connectDB from './src/config/db.js';
import GameModel from './src/models/games.js';

const playstationGames = [
  {
    name: "Marvel's Spider-Man 2",
    consola: "PlayStation",
    genero: "Acción",
    descripcion: "Peter Parker y Miles Morales unen fuerzas en una nueva aventura.",
    precio: 279960,
    stock: 30,
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    releaseYear: 2023,
    rating: "T",
    multiplayer: false
  },
  {
    name: "Final Fantasy XVI",
    consola: "PlayStation",
    genero: "RPG",
    descripcion: "Nueva entrega de la legendaria saga de rol.",
    precio: 279960,
    stock: 25,
    developer: "Square Enix",
    publisher: "Square Enix",
    releaseYear: 2023,
    rating: "M",
    multiplayer: false
  },
  {
    name: "God of War Ragnarök",
    consola: "PlayStation",
    genero: "Acción",
    descripcion: "La épica continuación de la saga nórdica de Kratos.",
    precio: 279960,
    stock: 28,
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    releaseYear: 2022,
    rating: "M",
    multiplayer: false
  }
];

const xboxGames = [
  {
    name: "Starfield",
    consola: "Xbox",
    genero: "RPG",
    descripcion: "Explora el espacio en el nuevo RPG de Bethesda.",
    precio: 279960,
    stock: 28,
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    releaseYear: 2023,
    rating: "M",
    multiplayer: false
  },
  {
    name: "Forza Motorsport",
    consola: "Xbox",
    genero: "Carreras",
    descripcion: "Simulación de carreras de nueva generación.",
    precio: 279960,
    stock: 32,
    developer: "Turn 10 Studios",
    publisher: "Xbox Game Studios",
    releaseYear: 2023,
    rating: "E",
    multiplayer: true
  },
  {
    name: "Halo Infinite",
    consola: "Xbox",
    genero: "Shooter",
    descripcion: "La última entrega de la saga Halo con multijugador gratuito.",
    precio: 239960,
    stock: 28,
    developer: "343 Industries",
    publisher: "Xbox Game Studios",
    releaseYear: 2021,
    rating: "T",
    multiplayer: true
  }
];

const nintendoGames = [
  {
    name: "The Legend of Zelda: Tears of the Kingdom",
    consola: "Nintendo",
    genero: "Aventura",
    descripcion: "La esperada secuela de Breath of the Wild",
    precio: 279960,
    stock: 40,
    developer: "Nintendo",
    publisher: "Nintendo",
    releaseYear: 2023,
    rating: "E10+",
    multiplayer: false
  },
  {
    name: "Super Mario Bros. Wonder",
    consola: "Nintendo",
    genero: "Plataformas",
    descripcion: "Nueva aventura de Mario con gráficos 2D mejorados",
    precio: 239960,
    stock: 35,
    developer: "Nintendo",
    publisher: "Nintendo",
    releaseYear: 2023,
    rating: "E",
    multiplayer: true
  },
  {
    name: "Pokémon Scarlet & Violet",
    consola: "Nintendo",
    genero: "RPG",
    descripcion: "Nueva generación de Pokémon en mundo abierto",
    precio: 239960,
    stock: 45,
    developer: "Game Freak",
    publisher: "Nintendo",
    releaseYear: 2022,
    rating: "E",
    multiplayer: true
  }
];

const seedGames = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Iniciando seed de juegos...');
    
    // Limpiar juegos existentes
    await GameModel.deleteMany({});
    console.log('✅ Juegos existentes eliminados');
    
    // Crear todos los juegos
    const allGames = [...playstationGames, ...xboxGames, ...nintendoGames];
    await GameModel.insertMany(allGames);
    
    console.log(`✅ ${allGames.length} juegos creados exitosamente`);
    console.log(`   - PlayStation: ${playstationGames.length} juegos`);
    console.log(`   - Xbox: ${xboxGames.length} juegos`);
    console.log(`   - Nintendo: ${nintendoGames.length} juegos`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedGames(); 