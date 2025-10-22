package com.diedev.firex.controllers;

import com.diedev.firex.models.Producto;
import com.diedev.firex.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    ProductoService productoService;

    // Listar productos
    @GetMapping("/list")
    public List<Producto> cargarProductos() {
        return productoService.getProductos();
    }

    // Buscar por Id
    @GetMapping("/list/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        return productoService.buscarProducto(id);
    }

    // Agregar un producto
    @PostMapping("/")
    public ResponseEntity<Producto> agregar(@RequestBody Producto producto) {
        Producto obj = productoService.nuevoProducto(producto);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    // Actualizar un producto (FIX)
    @PutMapping("/")
    public ResponseEntity<Producto> editar(@RequestBody Producto producto) {
        if (producto.getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Producto actual = productoService.buscarProducto(producto.getId());
        if (actual == null) {
            return ResponseEntity.notFound().build();
        }

        // Campos a actualizar
        actual.setName(producto.getName());
        actual.setDescription(producto.getDescription());
        actual.setPrice(producto.getPrice());
        actual.setStock(producto.getStock());
        actual.setCategory(producto.getCategory());

        Producto guardado = productoService.nuevoProducto(actual); // save
        return ResponseEntity.ok(guardado);
    }

    // Eliminar un producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Producto> eliminar(@PathVariable Long id) {
        Producto obj = productoService.buscarProducto(id);
        if (obj != null) {
            productoService.borrarProducto(id);
        } else {
            return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}
