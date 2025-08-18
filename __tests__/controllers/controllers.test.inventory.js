import { jest } from "@jest/globals";

// Mock del modelo Inventory
jest.unstable_mockModule("../../src/models/inventory.js", () => {
  const mockInventory = function(data) {
    this.data = data;
    this.save = jest.fn();
  };
  
  mockInventory.find = jest.fn();
  mockInventory.findById = jest.fn();
  mockInventory.findByIdAndUpdate = jest.fn();
  mockInventory.findByIdAndDelete = jest.fn();
  
  return {
    default: mockInventory,
  };
});

const inventoryController = (await import("../../src/controllers/inventory.js")).default;
const InventoryModel = (await import("../../src/models/inventory.js")).default;

describe("inventoryController", () => {
  let req, res;

  beforeEach(() => {
    req = { 
      body: {}, 
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("CREATE", () => {
    describe("Validaciones de entrada exitosas", () => {
      it("debe crear producto con datos válidos", async () => {
        req.body = {
          name: "PlayStation 5",
          type: "consoles",
          description: "Consola de última generación",
          price: 499.99,
          stock: 10,
          imageUrl: "https://example.com/ps5.jpg"
        };

        const mockProduct = {
          _id: "507f1f77bcf86cd799439011",
          ...req.body,
          isActive: true
        };

        InventoryModel.prototype.save = jest.fn().mockResolvedValue(mockProduct);

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "Producto creado exitosamente",
          data: mockProduct
        });
      });

      it("debe crear producto con valores por defecto", async () => {
        req.body = {
          name: "Xbox Controller",
          price: 59.99,
          stock: 5
        };

        const mockProduct = {
          _id: "507f1f77bcf86cd799439012",
          name: "Xbox Controller",
          type: "consoles",
          description: "",
          price: 59.99,
          stock: 5,
          imageUrl: "https://placehold.co/400x300/e9ecef/212529?text=Sin+Imagen",
          isActive: true
        };

        InventoryModel.prototype.save = jest.fn().mockResolvedValue(mockProduct);

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
      });

      it("debe manejar campos en español (descripcion, precio)", async () => {
        req.body = {
          name: "Nintendo Switch",
          descripcion: "Consola portátil",
          precio: "299.99",
          stock: "8"
        };

        const mockProduct = {
          _id: "507f1f77bcf86cd799439013",
          name: "Nintendo Switch",
          type: "consoles",
          description: "Consola portátil",
          price: 299.99,
          stock: 8,
          isActive: true
        };

        InventoryModel.prototype.save = jest.fn().mockResolvedValue(mockProduct);

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
      });
    });

    describe("Validaciones de error", () => {
      it("debe retornar 400 si falta nombre", async () => {
        req.body = {
          type: "consoles",
          price: 499.99,
          stock: 10
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Errores de validación",
          data: { errors: ["El nombre del producto es requerido y debe ser una cadena no vacía"] }
        });
      });

      it("debe retornar 400 si nombre está vacío", async () => {
        req.body = {
          name: "",
          price: 499.99,
          stock: 10
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });

      it("debe retornar 400 si precio es inválido", async () => {
        req.body = {
          name: "Producto Test",
          price: "invalid",
          stock: 10
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Errores de validación",
          data: { errors: ["El precio es requerido y debe ser un número válido"] }
        });
      });

      it("debe retornar 400 si precio es negativo", async () => {
        req.body = {
          name: "Producto Test",
          price: -100,
          stock: 10
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Errores de validación",
          data: { errors: ["El precio no puede ser negativo"] }
        });
      });

      it("debe retornar 400 si stock es inválido", async () => {
        req.body = {
          name: "Producto Test",
          price: 100,
          stock: "invalid"
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Errores de validación",
          data: { errors: ["El stock es requerido y debe ser un número válido"] }
        });
      });

      it("debe retornar 400 si stock es negativo", async () => {
        req.body = {
          name: "Producto Test",
          price: 100,
          stock: -5
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Errores de validación",
          data: { errors: ["El stock no puede ser negativo"] }
        });
      });

      it("debe retornar 400 si tipo es inválido", async () => {
        req.body = {
          name: "Producto Test",
          type: "invalid_type",
          price: 100,
          stock: 10
        };

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Errores de validación",
          data: { errors: ["El tipo debe ser uno de: consoles, accessories, games"] }
        });
      });

      it("debe manejar errores de duplicados", async () => {
        req.body = {
          name: "Producto Duplicado",
          price: 100,
          stock: 10
        };

        const error = new Error("Duplicate key");
        error.code = 11000;
        InventoryModel.prototype.save = jest.fn().mockRejectedValue(error);

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Ya existe un producto con ese nombre",
          data: null
        });
      });

      it("debe manejar errores de validación de Mongoose", async () => {
        req.body = {
          name: "Producto Test",
          price: 100,
          stock: 10
        };

        const error = new Error("Validation failed");
        error.name = "ValidationError";
        error.errors = {
          name: { message: "Name is required" }
        };
        InventoryModel.prototype.save = jest.fn().mockRejectedValue(error);

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Error de validación en el modelo",
          data: { name: "Name is required" }
        });
      });

      it("debe manejar errores de base de datos generales", async () => {
        req.body = {
          name: "Producto Test",
          price: 100,
          stock: 10
        };

        InventoryModel.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

        await inventoryController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Error interno al crear el producto",
          data: "Database error"
        });
      });
    });
  });

  describe("READ ALL", () => {
    describe("Consultas sin filtros", () => {
      it("debe retornar array vacío cuando no hay productos", async () => {
        InventoryModel.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        });

        await inventoryController.readAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "Productos obtenidos exitosamente",
          data: []
        });
      });

      it("debe retornar lista de productos", async () => {
        const mockProducts = [
          { _id: "1", name: "PS5", type: "consoles", price: 499.99, stock: 10 },
          { _id: "2", name: "Xbox Controller", type: "accessories", price: 59.99, stock: 5 }
        ];

        InventoryModel.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProducts)
        });

        await inventoryController.readAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "Productos obtenidos exitosamente",
          data: mockProducts
        });
      });
    });

    describe("Consultas con filtros", () => {
      it("debe filtrar por tipo", async () => {
        req.query = { type: "consoles" };
        const mockProducts = [{ _id: "1", name: "PS5", type: "consoles" }];

        InventoryModel.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProducts)
        });

        await inventoryController.readAll(req, res);

        expect(InventoryModel.find).toHaveBeenCalledWith({ isActive: true, type: "consoles" });
      });

      it("debe filtrar por rango de precio", async () => {
        req.query = { minPrice: "100", maxPrice: "500" };
        const mockProducts = [{ _id: "1", name: "PS5", price: 499.99 }];

        InventoryModel.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProducts)
        });

        await inventoryController.readAll(req, res);

        expect(InventoryModel.find).toHaveBeenCalledWith({
          isActive: true,
          price: { $gte: 100, $lte: 500 }
        });
      });

      it("debe filtrar por stock disponible", async () => {
        req.query = { inStock: "true" };
        const mockProducts = [{ _id: "1", name: "PS5", stock: 5 }];

        InventoryModel.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProducts)
        });

        await inventoryController.readAll(req, res);

        expect(InventoryModel.find).toHaveBeenCalledWith({
          isActive: true,
          stock: { $gt: 0 }
        });
      });

      it("debe filtrar por múltiples parámetros", async () => {
        req.query = {
          type: "accessories",
          minPrice: "50",
          maxPrice: "100",
          inStock: "true"
        };
        const mockProducts = [{ _id: "1", name: "Controller", price: 59.99, stock: 10 }];

        InventoryModel.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProducts)
        });

        await inventoryController.readAll(req, res);

        expect(InventoryModel.find).toHaveBeenCalledWith({
          isActive: true,
          type: "accessories",
          price: { $gte: 50, $lte: 100 },
          stock: { $gt: 0 }
        });
      });
    });

    it("debe manejar errores de base de datos", async () => {
      InventoryModel.find.mockImplementation(() => {
        throw new Error("Database error");
      });

      await inventoryController.readAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        allOK: false,
        message: "Error al obtener los productos",
        data: "Database error"
      });
    });
  });

  describe("READ ONE", () => {
    describe("Validación de ID", () => {
      it("debe retornar 400 para ID inválido (menos de 24 caracteres)", async () => {
        req.params.id = "12345";

        await inventoryController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
          data: null
        });
      });

      it("debe retornar 400 para ID con caracteres no válidos", async () => {
        req.params.id = "invalid-object-id-12345";

        await inventoryController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });

      it("debe aceptar ID válido de 24 caracteres hex", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        const mockProduct = { _id: "507f1f77bcf86cd799439011", name: "PS5" };

        InventoryModel.findById.mockResolvedValue(mockProduct);

        await inventoryController.readOne(req, res);

        expect(InventoryModel.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe("Búsqueda de producto", () => {
      it("debe retornar 404 si el producto no existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        InventoryModel.findById.mockResolvedValue(null);

        await inventoryController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Producto con ID 507f1f77bcf86cd799439011 no encontrado",
          data: null
        });
      });

      it("debe retornar producto cuando existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        const mockProduct = { _id: "507f1f77bcf86cd799439011", name: "PS5", price: 499.99 };

        InventoryModel.findById.mockResolvedValue(mockProduct);

        await inventoryController.readOne(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "Producto con ID 507f1f77bcf86cd799439011 encontrado",
          data: mockProduct
        });
      });
    });

    it("debe manejar errores de base de datos", async () => {
      req.params.id = "507f1f77bcf86cd799439011";
      InventoryModel.findById.mockRejectedValue(new Error("Database error"));

      await inventoryController.readOne(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        allOK: false,
        message: "Error al obtener el producto",
        data: "Database error"
      });
    });
  });

  describe("UPDATE", () => {
    describe("Validación de ID", () => {
      it("debe retornar 400 para ID inválido", async () => {
        req.params.id = "12345";
        req.body = { name: "Updated Product" };

        await inventoryController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
          data: null
        });
      });
    });

    describe("Actualización exitosa", () => {
      it("debe actualizar producto exitosamente", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { name: "Updated Product", price: 599.99 };

        const updatedProduct = {
          _id: "507f1f77bcf86cd799439011",
          name: "Updated Product",
          price: 599.99
        };

        InventoryModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

        await inventoryController.update(req, res);

        expect(InventoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
          "507f1f77bcf86cd799439011",
          { name: "Updated Product", price: 599.99 },
          { new: true, runValidators: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "Producto con ID 507f1f77bcf86cd799439011 actualizado exitosamente",
          data: updatedProduct
        });
      });

      it("debe retornar 404 si el producto no existe", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        req.body = { name: "Updated Product" };

        InventoryModel.findByIdAndUpdate.mockResolvedValue(null);

        await inventoryController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "Producto con ID 507f1f77bcf86cd799439011 no encontrado",
          data: null
        });
      });
    });

    it("debe manejar errores de base de datos", async () => {
      req.params.id = "507f1f77bcf86cd799439011";
      req.body = { name: "Updated Product" };

      InventoryModel.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await inventoryController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        allOK: false,
        message: "Error al actualizar el producto",
        data: "Database error"
      });
    });
  });

  describe("DELETE", () => {
    describe("Validación de ID", () => {
      it("debe retornar 400 para ID inválido", async () => {
        req.params.id = "12345";

        await inventoryController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
          data: null
        });
      });
    });

    describe("Eliminación exitosa", () => {
      it("debe eliminar producto exitosamente", async () => {
        req.params.id = "507f1f77bcf86cd799439011";
        const deletedProduct = { _id: "507f1f77bcf86cd799439011", name: "Deleted Product" };

        InventoryModel.findByIdAndDelete.mockResolvedValue(deletedProduct);

        await inventoryController.delete(req, res);

        expect(InventoryModel.findByIdAndDelete).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          allOK: true,
          message: "Producto con ID 507f1f77bcf86cd799439011 eliminado exitosamente",
          data: deletedProduct
        });
      });
    });

    it("debe manejar errores de base de datos", async () => {
      req.params.id = "507f1f77bcf86cd799439011";

      InventoryModel.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

      await inventoryController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        allOK: false,
        message: "Error al eliminar el producto",
        data: "Database error"
      });
    });
  });
});
