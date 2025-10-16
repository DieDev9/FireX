package com.diedev.firex.controllers;

import com.diedev.firex.models.Categoria;
import com.diedev.firex.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    CategoriaService categoriaService;

    // Listar categorías
    @GetMapping("/list")
    public List<Categoria> cargarCategorias() {
        return categoriaService.getCategorias();
    }

    // Buscar por Id
    @GetMapping("/list/{id}")
    public Categoria buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarCategoria(id);
    }

    // Agregar una categoría
    @PostMapping("/")
    public ResponseEntity<Categoria> agregar(@RequestBody Categoria categoria) {
        Categoria obj = categoriaService.nuevaCategoria(categoria);
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    // Actualizar una categoría
    @PutMapping("/")
    public ResponseEntity<Categoria> editar(@RequestBody Categoria categoria) {
        Categoria obj = categoriaService.buscarCategoria(categoria.getId());
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }

    // Eliminar una categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<Categoria> eliminar(@PathVariable Long id) {
        Categoria obj = categoriaService.buscarCategoria(id);
        if (obj != null) {
            categoriaService.borrarCategoria(id);
        } else {
            return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(obj, HttpStatus.OK);
    }
}