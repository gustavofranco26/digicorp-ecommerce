import { auth, db } from "./src/firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");
const loginStatus = document.getElementById("login-status");
const loginSection = document.getElementById("login-section");
const productsSection = document.getElementById("products-section");
const productsList = document.getElementById("products-list");
const cartSection = document.getElementById("cart-section");
const cartList = document.getElementById("cart-list");
const btnClearCart = document.getElementById("btn-clear-cart");
const btnBuy = document.getElementById("btn-buy");

btnLogin.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Login exitoso");
    loginStatus.textContent = "Login exitoso";
  } catch (error) {
    console.log("Error en login:", error.message);
    loginStatus.textContent = `Error: ${error.message}`;
  }
});

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
});

btnClearCart.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para vaciar el carrito.");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  try {
    await setDoc(cartRef, { items: {}, status: "activo" }, { merge: false });
    alert("Carrito vaciado correctamente.");
    loadCart();
  } catch (error) {
    console.error("Error vaciando el carrito:", error);
    alert("No se pudo vaciar el carrito.");
  }
});

btnBuy.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para comprar.");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) {
    alert("No tienes carrito para comprar.");
    return;
  }

  const cartData = cartSnap.data();

  if (cartData.status === "comprado") {
    alert("Este carrito ya fue comprado.");
    return;
  }

  try {
    await updateDoc(cartRef, { status: "comprado" });
    alert("Compra realizada con éxito!");
    loadCart();
  } catch (error) {
    console.error("Error al marcar compra:", error);
    alert("No se pudo completar la compra.");
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario logueado:", user.email);
    loginStatus.textContent = `Usuario: ${user.email}`;
    loginSection.style.display = "none";
    productsSection.style.display = "block";
    btnLogout.style.display = "inline-block";

    loadProducts();
    loadCart();
  } else {
    console.log("Usuario no logueado");
    loginStatus.textContent = "Por favor, inicia sesión.";
    loginSection.style.display = "block";
    productsSection.style.display = "none";
    btnLogout.style.display = "none";
    productsList.innerHTML = "";
    cartList.innerHTML = "";
    if(cartSection) cartSection.style.display = "none";
    if(btnBuy) btnBuy.style.display = "none";
  }
});

async function loadProducts() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/products");
    if (!response.ok) throw new Error("Error al cargar productos");
    const products = await response.json();
    productsList.innerHTML = "";
    products.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.nombre} - S/ ${p.precio} - Stock: ${p.cantidad}`;

      const btnAdd = document.createElement("button");
      btnAdd.textContent = "Agregar al carrito";
      btnAdd.onclick = () => addToCart(p);

      const btnRemove = document.createElement("button");
      btnRemove.textContent = "Quitar del carrito";
      btnRemove.onclick = () => removeFromCart(p.id);

      li.appendChild(btnAdd);
      li.appendChild(btnRemove);

      productsList.appendChild(li);
    });
  } catch (error) {
    productsList.innerHTML = `<li>Error: ${error.message}</li>`;
  }
}

async function loadCart() {
  const user = auth.currentUser;
  if (!user) {
    cartList.innerHTML = "";
    if(cartSection) cartSection.style.display = "none";
    if(btnBuy) btnBuy.style.display = "none";
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists() || cartSnap.data().status === "comprado") {
    cartList.innerHTML = "<li>El carrito está vacío.</li>";
    btnClearCart.style.display = "none";
    if(cartSection) cartSection.style.display = "none";
    if(btnBuy) btnBuy.style.display = "none";
    return;
  }

  const cartData = cartSnap.data();
  cartList.innerHTML = "";

  for (const productId in cartData.items) {
    const item = cartData.items[productId];
    const li = document.createElement("li");
    li.textContent = `${item.name} - Cantidad: ${item.quantity} - Precio unitario: S/ ${item.price}`;
    cartList.appendChild(li);
  }
  btnClearCart.style.display = "inline-block";
  if(cartSection) cartSection.style.display = "block";
  if(btnBuy) btnBuy.style.display = "inline-block";
}

async function addToCart(product) {
  console.log("Agregar al carrito:", product.nombre);
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  let cartData = { items: {}, status: "activo" };
  if (cartSnap.exists()) {
    cartData = cartSnap.data();
    if(cartData.status === "comprado"){
      cartData = { items: {}, status: "activo" };
    }
  }

  if (cartData.items[product.id]) {
    cartData.items[product.id].quantity += 1;
  } else {
    cartData.items[product.id] = {
      name: product.nombre,
      price: product.precio,
      quantity: 1
    };
  }

  await setDoc(cartRef, cartData);
  alert(`Producto "${product.nombre}" agregado al carrito.`);
  loadCart();
}

async function removeFromCart(productId) {
  console.log("Quitar del carrito, productId:", productId);
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión para quitar productos del carrito.");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) {
    alert("El carrito está vacío.");
    return;
  }

  const cartData = cartSnap.data();

  if (!cartData.items[productId]) {
    alert("El producto no está en el carrito.");
    return;
  }

  if (cartData.items[productId].quantity > 1) {
    cartData.items[productId].quantity -= 1;
  } else {
    delete cartData.items[productId];
  }

  await setDoc(cartRef, cartData);
  alert("Producto eliminado del carrito.");
  loadCart();
}
