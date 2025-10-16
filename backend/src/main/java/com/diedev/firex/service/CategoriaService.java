package com.diedev.firex.service;

import com.diedev.firex.models.Categoria;
import com.diedev.firex.repositories.CategoriaRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CategoriaService implements ICategoriaService {

    @Autowired
    CategoriaRepositorio categoriaRepositorio;

    @Override
    public List<Categoria> getCategorias() {
        return categoriaRepositorio.findAll();
    }

    @Override
    public Categoria nuevaCategoria(Categoria categoria) {
        return categoriaRepositorio.save(categoria);
    }

    @Override
    public Categoria buscarCategoria(Long id) {
        Categoria categoria = categoriaRepositorio.findById(id).orElse(null);
        return categoria;
    }

    @Override
    public int borrarCategoria(Long id) {
        categoriaRepositorio.deleteById(id);
        return 1;
    }
}