import GameModel from '../models/games.js';

const gamesController = {
  // GET all games
  readAll: async (req, res) => {
    try {
      const games = await GameModel.find({ isActive: true });
      res.json({
        allOK: true,
        message: "Juegos obtenidos exitosamente",
        data: games,
      });
    } catch (error) {
      console.error("Error obteniendo juegos:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener juegos",
        data: error.message,
      });
    }
  },

  // GET single game by ID
  readOne: async (req, res) => {
    try {
      const { id } = req.params;
      const game = await GameModel.findById(id);
      
      if (!game || !game.isActive) {
        return res.status(404).json({
          allOK: false,
          message: "Juego no encontrado",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Juego obtenido exitosamente",
        data: game,
      });
    } catch (error) {
      console.error("Error obteniendo juego:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener juego",
        data: error.message,
      });
    }
  },

  // POST create new game
  create: async (req, res) => {
    try {
      const newGame = new GameModel(req.body);
      const savedGame = await newGame.save();
      
      res.status(201).json({
        allOK: true,
        message: "Juego creado exitosamente",
        data: savedGame,
      });
    } catch (error) {
      console.error("Error creando juego:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al crear juego",
        data: error.message,
      });
    }
  },

  // PUT update game by ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedGame = await GameModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedGame || !updatedGame.isActive) {
        return res.status(404).json({
          allOK: false,
          message: "Juego no encontrado",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Juego actualizado exitosamente",
        data: updatedGame,
      });
    } catch (error) {
      console.error("Error actualizando juego:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar juego",
        data: error.message,
      });
    }
  },

  // DELETE game by ID (soft delete)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedGame = await GameModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      
      if (!deletedGame) {
        return res.status(404).json({
          allOK: false,
          message: "Juego no encontrado",
          data: null,
        });
      }

      res.json({
        allOK: true,
        message: "Juego eliminado exitosamente",
        data: deletedGame,
      });
    } catch (error) {
      console.error("Error eliminando juego:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar juego",
        data: error.message,
      });
    }
  },
};

export default gamesController;
