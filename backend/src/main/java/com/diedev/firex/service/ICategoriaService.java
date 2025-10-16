package com.diedev.firex.service;

import com.diedev.firex.models.Categoria;

import java.util.List;

public interface ICategoriaService {
    List<Categoria> getCategorias();
    Categoria nuevaCategoria(Categoria categoria);
    Categoria buscarCategoria(Long id);
    int borrarCategoria(Long id);
}