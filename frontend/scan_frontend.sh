#!/usr/bin/env bash
set -euo pipefail

# ==========================
# Configuración
# ==========================
OUTPUT_FILE="resultado.txt"
MAX_SIZE_MIB=2

# Directorios a excluir
EXCLUDE_DIRS=(
  "node_modules" ".git" ".hg" ".svn"
  "dist" "build" ".next" ".nuxt" ".svelte-kit" ".turbo" "coverage"
  ".cache" ".parcel-cache" ".vite" ".yarn" ".pnpm-store" "storybook-static"
)

# Patrones a incluir (frontend/React)
INCLUDE_PATTERNS=(
  "*.html" "*.css" "*.scss" "*.sass" "*.less"
  "*.js" "*.jsx" "*.mjs" "*.cjs"
  "*.ts" "*.tsx" "*.mts" "*.cts"

)

# Patrones a ignorar
IGNORE_PATTERNS=(
  "*.min.js" "*.min.css" "*.map"
)

# ==========================
# Cabecera de salida
# ==========================
{
  echo "Estructura de directorios y archivos escaneados ($(date))"
  echo
  echo "Raíz del escaneo: $(pwd)"
  echo "Excluyendo directorios: ${EXCLUDE_DIRS[*]}"
  echo "Incluyendo patrones: ${INCLUDE_PATTERNS[*]}"
  echo "Ignorando nombres: ${IGNORE_PATTERNS[*]}"
  echo "Tamaño máximo por archivo: ${MAX_SIZE_MIB} MiB"
  echo
  echo "Directorios:"
} > "$OUTPUT_FILE"

# ==========================
# Listado de directorios (con prune correcto)
# ==========================
# Nota: se excluyen dirs coincidentes tanto como carpeta raíz (./node_modules)
# como cualquier subruta (*/node_modules/*)
find . \
  \( $(printf "! -path %q -a " "./${EXCLUDE_DIRS[0]}") -false \) >/dev/null 2>&1 || true # silenciar shellcheck

# Construir expresión -prune
PRUNE_EXPR=()
for d in "${EXCLUDE_DIRS[@]}"; do
  PRUNE_EXPR+=( -path "./$d" -o -path "./$d/*" -o -path "*/$d/*" -o -path "*/$d" -o )
done
unset 'PRUNE_EXPR[${#PRUNE_EXPR[@]}-1]' || true

# Imprimir directorios (respetando prune)
find . \( "${PRUNE_EXPR[@]}" \) -prune -o -type d -print | sort >> "$OUTPUT_FILE"
echo >> "$OUTPUT_FILE"

# ==========================
# Recolectar archivos (con prune + include + ignore)
# ==========================
echo "Archivos escaneados:" >> "$OUTPUT_FILE"

# Construir include e ignore
INCLUDE_EXPR=()
for p in "${INCLUDE_PATTERNS[@]}"; do INCLUDE_EXPR+=( -name "$p" -o ); done
unset 'INCLUDE_EXPR[${#INCLUDE_EXPR[@]}-1]' || true

IGNORE_EXPR=()
for p in "${IGNORE_PATTERNS[@]}"; do IGNORE_EXPR+=( ! -name "$p" ); done

# Buscar archivos y listarlos
mapfile -d '' FILES < <(
  find . \
    \( "${PRUNE_EXPR[@]}" \) -prune -o \
    -type f \( "${INCLUDE_EXPR[@]}" \) "${IGNORE_EXPR[@]}" \
    -print0
)

# Mostrar lista en salida
for f in "${FILES[@]}"; do
  f="${f%$'\0'}"
  printf '%s\n' "$f" >> "$OUTPUT_FILE"
done

{
  echo
  echo "==============================="
  echo
} >> "$OUTPUT_FILE"

# ==========================
# Volcar contenidos (con límite de tamaño)
# ==========================
bytes_limit=$(( MAX_SIZE_MIB * 1024 * 1024 ))
for f0 in "${FILES[@]}"; do
  f="${f0%$'\0'}"
  [ -f "$f" ] || continue
  echo "===== $f =====" >> "$OUTPUT_FILE"
  size=$(stat -c%s -- "$f" 2>/dev/null || echo 0)
  if (( size <= bytes_limit )); then
    # Si parece binario, no lo volcamos
    if command -v file >/dev/null 2>&1 && file --mime "$f" | grep -qi "charset=binary"; then
      echo "[Omitido: archivo binario ($size bytes)]" >> "$OUTPUT_FILE"
    else
      # Intento de normalizar; si falla, cat directo
      iconv -f UTF-8 -t UTF-8 -c -- "$f" 2>/dev/null >> "$OUTPUT_FILE" || cat -- "$f" >> "$OUTPUT_FILE"
    fi
  else
    echo "[Omitido: excede ${MAX_SIZE_MIB} MiB (${size} bytes)]" >> "$OUTPUT_FILE"
  fi
  echo >> "$OUTPUT_FILE"
done

echo "Listo: se creó '$OUTPUT_FILE'"
