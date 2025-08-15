import InventoryModel from "../models/inventory.js";

//validar si el id es un ObjectId válido de MongoDB
const isValidObjectId = (id) => {
  return id.match(/^[0-9a-fA-F]{24}$/);
};


const inventoryController = {

  create: async (req, res) => {
    try {
      const { 
        name, 
        type, 
        description, 
        descripcion, 
        price, 
        precio, 
        stock, 
        imageUrl,
        ...rest 
      } = req.body;
      
      console.log("Datos recibidos en req.body:", req.body);

      // Mapeo de campos del frontend al backend
      const finalDescription = description || descripcion || "";
      
      // Convertir y validar precio
      let finalPrice = price !== undefined ? price : precio;
      if (typeof finalPrice === 'string') {
        finalPrice = parseFloat(finalPrice);
      }
      
      // Convertir y validar stock
      let finalStock = stock !== undefined ? stock : 0;
      if (typeof finalStock === 'string') {
        finalStock = parseInt(finalStock, 10);
      }
      
      // Validar tipo con valor por defecto
      const allowedTypes = ["consoles", "accessories", "games"];
      const finalType = type && allowedTypes.includes(type) ? type : "consoles";
      
      // Validación exhaustiva de campos requeridos
      const errors = [];
      
      if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push("El nombre del producto es requerido y debe ser una cadena no vacía");
      }
      
      if (finalPrice === undefined || isNaN(finalPrice)) {
        errors.push("El precio es requerido y debe ser un número válido");
      } else if (finalPrice < 0) {
        errors.push("El precio no puede ser negativo");
      }
      
      if (finalStock === undefined || isNaN(finalStock)) {
        errors.push("El stock es requerido y debe ser un número válido");
      } else if (finalStock < 0) {
        errors.push("El stock no puede ser negativo");
      }
      
      if (!allowedTypes.includes(finalType)) {
        errors.push(`El tipo debe ser uno de: ${allowedTypes.join(", ")}`);
      }
      
      if (errors.length > 0) {
        return res.status(400).json({
          allOK: false,
          message: "Errores de validación",
          data: { errors },
        });
      }

      // Preparar datos del producto con valores por defecto
      const productData = {
        name: name.trim(),
        type: finalType,
        description: finalDescription.trim(),
        price: finalPrice,
        stock: finalStock,
        imageUrl: imageUrl || "https://placehold.co/400x300/e9ecef/212529?text=Sin+Imagen",
        isActive: true,
        ...rest,
      };

      // Crear nuevo producto
      const newProduct = new InventoryModel(productData);
      const productCreated = await newProduct.save();

      res.status(201).json({
        allOK: true,
        message: "Producto creado exitosamente",
        data: productCreated,
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);

      // Manejo específico de errores de validación de Mongoose
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = error.errors[key].message;
        });

        return res.status(400).json({
          allOK: false,
          message: "Error de validación en el modelo",
          data: validationErrors,
        });
      }

      // Manejo de errores de duplicados
      if (error.code === 11000) {
        return res.status(400).json({
          allOK: false,
          message: "Ya existe un producto con ese nombre",
          data: null,
        });
      }

      // Manejo de otros errores
      res.status(500).json({
        allOK: false,
        message: "Error interno al crear el producto",
        data: error.message,
      });
    }
  },

  // Leer todos los productos con filtros avanzados
  readAll: async (req, res) => {
    try {
      const { type, consola, genero, minPrice, maxPrice, inStock, multiplayer } = req.query;
      let filter = { isActive: true };

      if (type) filter.type = type;
      if (consola) filter.consola = consola;
      if (genero) filter.genero = genero;
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      if (inStock === 'true') filter.stock = { $gt: 0 };
      if (multiplayer === 'true') filter.multiplayer = true;
      
      const products = await InventoryModel.find(filter).sort({ createdAt: -1 });

      res.status(200).json({
        allOK: true,
        message: "Productos obtenidos exitosamente",
        data: products,
      });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener los productos",
        data: error.message,
      });
    }
  },

  // Leer un solo producto por ID, con validación de ID
  readOne: async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
          data: null,
        });
      }
      
      const product = await InventoryModel.findById(id);

      if (!product) {
        return res.status(404).json({
          allOK: false,
          message: `Producto con ID ${id} no encontrado`,
          data: null,
        });
      }

      res.status(200).json({
        allOK: true,
        message: `Producto con ID ${id} encontrado`,
        data: product,
      });
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al obtener el producto",
        data: error.message,
      });
    }
  },

  // Actualizar un producto por ID, con validación de ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
          data: null,
        });
      }

      const updateData = req.body;
      
      const updatedProduct = await InventoryModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!updatedProduct) {
        return res.status(404).json({
          allOK: false,
          message: `Producto con ID ${id} no encontrado`,
          data: null,
        });
      }
      
      res.status(200).json({
        allOK: true,
        message: `Producto con ID ${id} actualizado exitosamente`,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al actualizar el producto",
        data: error.message,
      });
    }
  },

  // Eliminar un producto por ID, con validación de ID
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          allOK: false,
          message: "ID inválido. Debe ser un ObjectId válido de MongoDB.",
          data: null,
        });
      }
      
      const productDeleted = await InventoryModel.findByIdAndDelete(id);

      if (!productDeleted) {
        return res.status(404).json({
          allOK: false,
          message: `Producto con ID ${id} no encontrado`,
          data: null,
        });
      }
      
      res.status(200).json({
        allOK: true,
        message: `Producto con ID ${id} eliminado exitosamente`,
        data: null,
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({
        allOK: false,
        message: "Error al eliminar el producto",
        data: error.message,
      });
    }
  }
};

export default inventoryController;