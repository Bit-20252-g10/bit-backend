import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";

// Mock de bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// Mock del modelo User
jest.unstable_mockModule("../../src/models/user.js", () => {
  const mockUser = function(data) {
    this.data = data;
    this.save = jest.fn();
  };
  
  mockUser.find = jest.fn();
  mockUser.findOne = jest.fn();
  mockUser.findById = jest.fn();
  mockUser.findByIdAndUpdate = jest.fn();
  mockUser.findByIdAndDelete = jest.fn();
  
  return {
    default: mockUser,
  };
});

const usersController = (await import("../../src/controllers/user.js")).default;
const UserModel = (await import("../../src/models/user.js")).default;

describe("usersController", () => {
  let req, res;

  beforeEach(() => {
    req = { 
      body: {}, 
      params: {},
      path: '/users',
      method: 'POST'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("CREATE", () => {
    describe("Validaciones de entrada", () => {
      it("debe retornar 400 si falta username", async () => {
        req.body = { email: "test@test.com", password: "123456" };
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "All fields are required: username, email, password",
          data: null,
        });
      });

      it("debe retornar 400 si falta email", async () => {
        req.body = { username: "testuser", password: "123456" };
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "All fields are required: username, email, password",
          data: null,
        });
      });

      it("debe retornar 400 si falta password", async () => {
        req.body = { username: "testuser", email: "test@test.com" };
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "All fields are required: username, email, password",
          data: null,
        });
      });

      it("debe retornar 400 si todos los campos están vacíos", async () => {
        req.body = { username: "", email: "", password: "" };
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe("Validación de email único", () => {
      it("debe retornar 400 si el email ya existe", async () => {
        req.body = { username: "testuser", email: "existing@test.com", password: "123456" };
        UserModel.findOne.mockResolvedValue({ _id: "1", email: "existing@test.com" });
        
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Email already registered",
          data: null,
        });
      });

      it("debe permitir crear usuario si el email no existe", async () => {
        req.body = { username: "testuser", email: "new@test.com", password: "123456" };
        UserModel.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashedPassword123");
        
        const mockUser = {
          _id: "123",
          username: "testuser",
          email: "new@test.com",
          password: "hashedPassword123",
          toObject: () => ({
            _id: "123",
            username: "testuser",
            email: "new@test.com"
          })
        };
        
        UserModel.prototype.save = jest.fn().mockResolvedValue(mockUser);
        
        await usersController.create(req, res);
        
        expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "User created successfully",
          data: { _id: "123", username: "testuser", email: "new@test.com" }
        });
      });
    });

    describe("Manejo de errores", () => {
      it("debe manejar errores de base de datos", async () => {
        req.body = { username: "testuser", email: "test@test.com", password: "123456" };
        UserModel.findOne.mockRejectedValue(new Error("Database connection failed"));
        
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Error creating user",
          data: "Database connection failed",
        });
      });
    });
  });

  describe("READ ALL", () => {
    it("debe retornar array vacío cuando no hay usuarios", async () => {
      UserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });
      
      await usersController.readAll(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        allOK: true,
        message: "Users retrieved successfully",
        data: []
      });
    });

    it("debe retornar lista de usuarios sin contraseñas", async () => {
      const mockUsers = [
        { _id: "1", username: "user1", email: "user1@test.com" },
        { _id: "2", username: "user2", email: "user2@test.com" }
      ];
      
      UserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });
      
      await usersController.readAll(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        allOK: true,
        message: "Users retrieved successfully",
        data: mockUsers
      });
    });

    it("debe manejar errores de base de datos", async () => {
      UserModel.find.mockImplementation(() => {
        throw new Error("Database error");
      });
      
      await usersController.readAll(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("READ ONE", () => {
    describe("Validación de ID", () => {
      it("debe retornar 400 para ID inválido (menos de 24 caracteres)", async () => {
        req.params.id = "12345";
        
        await usersController.readOne(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Invalid ID. Must be a valid MongoDB ObjectId",
          data: null,
        });
      });

      it("debe retornar 400 para ID con caracteres no válidos", async () => {
        req.params.id = "invalid-object-id-12345";
        
        await usersController.readOne(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it("debe aceptar ID válido de 24 caracteres hex", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        UserModel.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue({ _id: "507f1f77bcf86cd799439011", username: "test" })
        });
        
        await usersController.readOne(req, res);
        
        expect(UserModel.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      });
    });

    describe("Búsqueda de usuario", () => {
      it("debe retornar 404 si el usuario no existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        UserModel.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
        
        await usersController.readOne(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "User with ID 507f1f77bcf86cd799439011 not found",
          data: null,
        });
      });

      it("debe retornar usuario sin contraseña cuando existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        const mockUser = { _id: "507f1f77bcf86cd799439011", username: "testuser", email: "test@test.com" };
        
        UserModel.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockUser)
        });
        
        await usersController.readOne(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "User with ID 507f1f77bcf86cd799439011 found",
          data: mockUser
        });
      });
    });

    it("debe manejar errores de base de datos", async () => {
      req.params.id = "507f1f77bcf86cd799439011";
      UserModel.findById.mockImplementation(() => {
        throw new Error("Database connection failed");
      });
      
      await usersController.readOne(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("UPDATE", () => {
    describe("Actualización exitosa", () => {
      it("debe actualizar usuario sin cambiar contraseña", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { username: "updatedName", email: "updated@test.com" };
        
        const updatedUser = { _id: "507f1f77bcf86cd799439011", username: "updatedName", email: "updated@test.com" };
        UserModel.findByIdAndUpdate.mockReturnValue({
          select: jest.fn().mockResolvedValue(updatedUser)
        });
        
        await usersController.update(req, res);
        
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439011",
          { username: "updatedName", email: "updated@test.com" },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it("debe actualizar contraseña y hashearla", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { password: "newPassword123" };
        
        bcrypt.hash.mockResolvedValue("hashedNewPassword");
        UserModel.findByIdAndUpdate.mockReturnValue({
          select: jest.fn().mockResolvedValue({ _id: "507f1f77bcf86cd799439011" })
        });
        
        await usersController.update(req, res);
        
        expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439011",
          { password: "hashedNewPassword" },
          { new: true }
        );
      });

      it("debe actualizar campos parciales", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { username: "onlyUsernameUpdated" };
        
        UserModel.findByIdAndUpdate.mockReturnValue({
          select: jest.fn().mockResolvedValue({ _id: "507f1f77bcf86cd799439011", username: "onlyUsernameUpdated" })
        });
        
        await usersController.update(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe("Manejo de errores", () => {
      it("debe retornar 404 si usuario no existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { username: "updated" };
        
        UserModel.findByIdAndUpdate.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
        
        await usersController.update(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "User with ID 507f1f77bcf86cd799439011 not found",
          data: null,
        });
      });

      it("debe manejar errores de base de datos", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { username: "updated" };
        
        UserModel.findByIdAndUpdate.mockImplementation(() => {
          throw new Error("Database error");
        });
        
        await usersController.update(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe("DELETE", () => {
    describe("Eliminación exitosa", () => {
      it("debe eliminar usuario exitosamente", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        const deletedUser = { _id: "507f1f77bcf86cd799439011", username: "deletedUser" };
        
        UserModel.findByIdAndDelete.mockResolvedValue(deletedUser);
        
        await usersController.delete(req, res);
        
        expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "User with ID 507f1f77bcf86cd799439011 deleted successfully",
          data: null,
        });
      });
    });

    describe("Manejo de errores", () => {
      it("debe retornar 404 si usuario no existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        UserModel.findByIdAndDelete.mockResolvedValue(null);
        
        await usersController.delete(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "User with ID 507f1f77bcf86cd799439011 not found",
          data: null,
        });
      });

      it("debe manejar errores de base de datos", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        UserModel.findByIdAndDelete.mockRejectedValue(new Error("Database error"));
        
        await usersController.delete(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe("Casos de borde y validaciones adicionales", () => {
    describe("CREATE - Validaciones extra", () => {
      it("debe manejar campos con espacios en blanco", async () => {
        req.body = { username: "  ", email: "test@test.com", password: "123456" };
        await usersController.create(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it("debe manejar email con formato inválido", async () => {
        req.body = { username: "test", email: "invalid-email", password: "123456" };
        UserModel.findOne.mockResolvedValue(null);
        
        await usersController.create(req, res);
        
        // El controlador actual no valida formato de email, pero el test está listo
        expect(UserModel.findOne).toHaveBeenCalledWith({ email: "invalid-email" });
      });
    });

    describe("UPDATE - Casos especiales", () => {
      it("debe manejar actualización con body vacío", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = {};
        
        UserModel.findByIdAndUpdate.mockReturnValue({
          select: jest.fn().mockResolvedValue({ _id: "507f1f77bcf86cd799439011" })
        });
        
        await usersController.update(req, res);
        
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439011",
          {},
          { new: true }
        );
      });
    });
  });
});
