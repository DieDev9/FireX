package com.diedev.firex.service;

import com.diedev.firex.models.Producto;
import com.diedev.firex.repositories.ProductoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ProductoService implements IProductoService {

    @Autowired
    ProductoRepositorio productoRepositorio;

    @Override
    public List<Producto> getProductos() {
        return productoRepositorio.findAll();
    }

    @Override
    public Producto nuevoProducto(Producto producto) {
        return productoRepositorio.save(producto);
    }

    @Override
    public Producto buscarProducto(Long id) {
        Producto producto = productoRepositorio.findById(id).orElse(null);
        return producto;
    }

    @Override
    public int borrarProducto(Long id) {
        productoRepositorio.deleteById(id);
        return 1;
    }
}