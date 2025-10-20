// FireX Hub - Utilidades comunes

// Base URL del backend
const baseURL = "http://localhost:8066"

// Claves de localStorage
const STORAGE_KEYS = {
  USER: "fx:user",
  CART: "fx:cart",
  RECARGAS: "fx:recargas",
}

// ========== Gestión de Usuario ==========

function getUser() {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  return userStr ? JSON.parse(userStr) : null
}

function setUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

function isLoggedIn() {
  return getUser() !== null
}

function isAdmin() {
  const user = getUser()
  return user && user.role === "ADMIN"
}

// ========== Guards de Autenticación ==========

function authGuard() {
  if (!isLoggedIn()) {
    location.href = "login.html"
  }
}

function adminGuard() {
  if (!isAdmin()) {
    location.href = "index.html"
  }
}

// ========== API Wrapper ==========

async function api(path, options = {}) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(baseURL + path, config)

    // Intentar parsear JSON
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      // Si el backend devuelve un mensaje de error
      const errorMessage = data.message || data.error || data || `Error HTTP ${response.status}`
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// ========== Logout ==========

function logout() {
  clearUser()
  location.href = "login.html"
}

// ========== Formateo de Moneda ==========

function formatCOP(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount)
}

// ========== Gestión de Carrito ==========

function getCart() {
  const cartStr = localStorage.getItem(STORAGE_KEYS.CART)
  return cartStr ? JSON.parse(cartStr) : []
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
}

function addToCart(product) {
  const cart = getCart()
  const existing = cart.find((item) => item.id === product.id)

  if (existing) {
    existing.qty += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    })
  }

  setCart(cart)
}

function removeFromCart(productId) {
  const cart = getCart()
  const filtered = cart.filter((item) => item.id !== productId)
  setCart(filtered)
}

function updateCartQty(productId, qty) {
  const cart = getCart()
  const item = cart.find((item) => item.id === productId)
  if (item) {
    item.qty = Math.max(1, qty)
    setCart(cart)
  }
}

function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART)
}

function getCartTotal() {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function getCartCount() {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + item.qty, 0)
}

// ========== Gestión de Recargas (localStorage, migrable a API) ==========

function getRecargas() {
  const recargasStr = localStorage.getItem(STORAGE_KEYS.RECARGAS)
  return recargasStr ? JSON.parse(recargasStr) : []
}

function setRecargas(recargas) {
  localStorage.setItem(STORAGE_KEYS.RECARGAS, JSON.stringify(recargas))
}

function createRecarga(data) {
  const recargas = getRecargas()
  const timestamp = Date.now()
  const id = `SR-${timestamp}`

  const newRecarga = {
    id,
    userEmail: data.userEmail,
    userId: data.userId || null,
    tipo: data.tipo,
    estadoExtintor: data.estadoExtintor,
    fecha: data.fecha,
    franja: data.franja,
    direccion: data.direccion,
    telefono: data.telefono,
    observaciones: data.observaciones || "",
    status: "PENDIENTE",
    timeline: [
      {
        ts: new Date().toISOString(),
        status: "PENDIENTE",
        by: data.userEmail,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  recargas.push(newRecarga)
  setRecargas(recargas)

  return id
}

function listRecargasByUser(email) {
  const recargas = getRecargas()
  return recargas.filter((r) => r.userEmail === email)
}

function listRecargasAll() {
  if (!isAdmin()) {
    console.warn("listRecargasAll: Solo administradores pueden listar recargas")
    return []
  }
  return getRecargas()
}

function getRecargaById(id) {
  const recargas = getRecargas()
  return recargas.find((r) => r.id === id)
}

function updateRecargaStatus(id, newStatus, by) {
  const recargas = getRecargas()
  const recarga = recargas.find((r) => r.id === id)

  if (recarga) {
    recarga.status = newStatus
    recarga.updatedAt = new Date().toISOString()
    recarga.timeline.push({
      ts: new Date().toISOString(),
      status: newStatus,
      by: by || "admin",
    })

    setRecargas(recargas)
    return true
  }

  return false
}

function deleteRecarga(id) {
  const recargas = getRecargas()
  const filtered = recargas.filter((r) => r.id !== id)
  setRecargas(filtered)
  return true
}

// ========== Gestión de Usuarios (API) ==========

async function fetchUsers() {
  return api("/api/users/all")
}

async function createUser(payload) {
  return api("/api/users/add", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

async function updateUserBasic(id, payload) {
  // Solo actualiza name, phone, address (NO email, role, password)
  return api(`/api/users/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

async function deleteUser(id) {
  return api(`/api/users/delete/${id}`, {
    method: "DELETE",
  })
}

// ========== Notificaciones (stubs para futuro Gmail/WhatsApp) ==========

async function notifyEmail(to, subject, body) {
  console.log("[v0] notifyEmail stub called:", { to, subject, body })
  // TODO: Implementar integración con Gmail API
  return Promise.resolve(true)
}

async function notifyWhatsApp(toPhone, text) {
  console.log("[v0] notifyWhatsApp stub called:", { toPhone, text })
  // TODO: Implementar integración con WhatsApp API
  return Promise.resolve(true)
}

function toast(message, type = "info") {
  const toastContainer = document.getElementById("toast-container") || createToastContainer()

  const toast = createElement(
    "div",
    {
      className: `toast toast-${type}`,
      role: "alert",
      "aria-live": "polite",
    },
    [message],
  )

  toastContainer.appendChild(toast)

  // Trigger animation
  setTimeout(() => toast.classList.add("toast-show"), 10)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove("toast-show")
    setTimeout(() => toast.remove(), 300)
  }, 5000)
}

function createToastContainer() {
  const container = createElement("div", {
    id: "toast-container",
    className: "toast-container",
  })
  document.body.appendChild(container)
  return container
}

function confirmDialog(text) {
  return window.confirm(text)
}

// ========== Utilidades DOM ==========

function qs(selector, parent = document) {
  return parent.querySelector(selector)
}

function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector))
}

function on(element, event, handler) {
  element.addEventListener(event, handler)
}

function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag)
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "className") {
      el.className = value
    } else if (key.startsWith("on")) {
      el.addEventListener(key.substring(2).toLowerCase(), value)
    } else {
      el.setAttribute(key, value)
    }
  })
  children.forEach((child) => {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child))
    } else {
      el.appendChild(child)
    }
  })
  return el
}

// ========== Mensajes de Alerta ==========

function showAlert(message, type = "info", containerId = "alert-container") {
  const container = qs(`#${containerId}`)
  if (!container) return

  container.innerHTML = `<div class="alert ${type}" role="alert" aria-live="polite">${message}</div>`

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    container.innerHTML = ""
  }, 5000)
}

function clearAlert(containerId = "alert-container") {
  const container = qs(`#${containerId}`)
  if (container) {
    container.innerHTML = ""
  }
}
