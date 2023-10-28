const productList = document.getElementById("productList");
const mainProductsUrl = "https://fakestoreapi.com/products?limit=8";

function fetchProd() {
  fetch(mainProductsUrl)
    .then((data) => data.json())
    .then((products) => showProduct(products));
}

function showProduct(products) {
  const loading = document.getElementsByClassName("loading")[0];
  if (loading) {
    loading.classList.remove("loading");
    loading.classList.add("loaded");
  }
  productList.innerHTML = "";
  productList.innerHTML = products
    .map((product) => {
      const { image, title, id } = product;
      return `
      <div class="product" onclick="infoProd(${id})">
            <div class="prodImg">
              <img src="${image}" alt="${title}" />
            </div>
            <div class="prodTitle">
              <h3>${title}</h3>
            </div>  
          </div>
    `;
    })
    .join("");
}
fetchProd();

const landingPage = document.getElementsByClassName("landingPage")[0];
const infoPage = document.getElementsByClassName("infoPage")[0];
const loginPage = document.getElementsByClassName("loginPage")[0];
const cartPage = document.getElementsByClassName("cartPage")[0];

function landingPageActivity() {
  if (!landingPage.classList.contains("activePage")) {
    landingPage.classList.remove("deactivePage");
    landingPage.classList.add("activePage");
    loginPage.classList.remove("activePage");
    loginPage.classList.add("deactivePage");
    cartPage.classList.remove("activePage");
    cartPage.classList.add("deactivePage");
    infoPage.classList.remove("activePage");
    infoPage.classList.add("deactivePage");
  }
}

function loginPageActivity() {
  if (!loginPage.classList.contains("activePage")) {
    loginPage.classList.remove("deactivePage");
    loginPage.classList.add("activePage");
    landingPage.classList.remove("activePage");
    landingPage.classList.add("deactivePage");
    cartPage.classList.remove("activePage");
    cartPage.classList.add("deactivePage");
    infoPage.classList.remove("activePage");
    infoPage.classList.add("deactivePage");
  }
}

function showCart() {
  if (!cartPage.classList.contains("activePage")) {
    cartPage.classList.remove("deactivePage");
    cartPage.classList.add("activePage");
    landingPage.classList.remove("activePage");
    landingPage.classList.add("deactivePage");
    loginPage.classList.remove("activePage");
    loginPage.classList.add("deactivePage");
    infoPage.classList.remove("activePage");
    infoPage.classList.add("deactivePage");
  }
  // const loading = document.getElementById("loading");
  // loading.classList.remove("loading");
  // loading.classList.add("loaded");
}

function infoProd(id) {
  if (!infoPage.classList.contains("activePage")) {
    infoPage.classList.remove("deactivePage");
    infoPage.classList.add("activePage");
    landingPage.classList.add("deactivePage");
    landingPage.classList.remove("activePage");
    loginPage.classList.remove("activePage");
    loginPage.classList.add("deactivePage");
    cartPage.classList.remove("activePage");
    cartPage.classList.add("deactivePage");
  }

  showInfoProd(id);
}

function showInfoProd(id) {
  const prodInfoFetch = `https://fakestoreapi.com/products/${id}`;
  fetch(prodInfoFetch)
    .then((res) => res.json())
    .then((product) => {
      const image = product.image;
      const title = product.title;
      const price = product.price;
      const discountPrice = price.toFixed(1);
      const increasPrice = price + price * 0.05;
      const currentPrice = increasPrice.toFixed(1);
      const description = product.description;
      const prodInfo = document.getElementById("prodInfo");
      prodInfo.innerHTML = "";
      prodInfo.innerHTML = `<div class="prodImg">
    <img
    src="${image}"
          alt="..."
        />
      </div>
      <div class="prodAboutAll">
        <div class="prodAllPrice">
          <div class="prices">
            <h2>${discountPrice} <span class="dollarSize">$</span></h2>
            <del>${currentPrice} <span class="proSize">$</span></del>
            <p class="discountNum">-5<span class="proSize">%</span></p>
          </div>
          <div class="prodBuyBtn">
            <button onclick="addCart(${id})">Add to cart</button>
          </div>
        </div>
        <hr />
        <div class="prodDescription">
          <div class="descriptionTitle">
            <h3>Compound:</h3>
          </div>
          <div class="descriptionText">
            <p>${description}</p>
          </div>
        </div>
      </div>`;
    })
    .catch((error) => {
      console.error("Xatolik:", error);
    });
}

function addCart(id) {
  if (id) {
    var products = JSON.parse(localStorage.getItem("products")) ?? [];
    products.push(id);
    localStorage.setItem("products", JSON.stringify(products));
    addCartFetch(id);
  }
}

function addCartFetch(id) {
  const prodNum = document.getElementById(`${id}`);
  const buyProduct = document.querySelector(`.buyProduct:nth-child(${id})`);
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((product) => {
      const image = product.image;
      const title = product.title;
      const price = product.price;
      const discountPrice = price;
      const increasPrice = price + price * 0.05;
      const buyProducts = document.getElementById("buyProducts");
      if (buyProducts.innerHTML === "") {
        buyProducts.innerHTML = `<h1>You haven't bought a product yet</h1>`;
      } else if (buyProduct) {
        const prodNum = document.getElementById(`${id}`);
        console.log(prodNum);
        if (prodNum) {
          prodNum.innerHTML = parseInt(prodNum.innerHTML) + 1;
        }
      } else {
        buyProducts.innerHTML += `
          <div class="buyProduct" >
            <div class="deleteProd" onclick="deleteProd(${id})">
              <i class="fa-solid fa-x"></i>
            </div>
            <div class="prodImg">
              <img src="${image}" alt="..." />
            </div>
            <div class="updateProd">
              <div class="title">
                <p>${title}</p>
              </div>
              <div class="quantity">
                <button class="updateBtn" onclick="decreaseItem(${id})">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <p class="prodNum" id="prodNum${id}">1</p>
                <button onclick="increaseItem(${id})">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div class="prodPrice">
              <h3>${Math.round(discountPrice)} $</h3>
              <del>${Math.round(increasPrice)} $</del>
            </div>
          </div>`;
      }

      const products = JSON.parse(localStorage.getItem("products")) || [];
      const productInfo = {
        id: id,
        image: image,
        title: title,
        price: price,
      };
      products.push(productInfo);
      localStorage.setItem("products", JSON.stringify(products));
    })
    .catch((error) => {
      console.error("Xatolik:", error);
    });
}

// addCartFetch(1)

function decreaseItem(id) {
  const prodNum = document.getElementById(`prodNum${id}`);
  if (prodNum.innerHTML > 0) {
    prodNum.innerHTML = parseInt(prodNum.innerHTML) - 1;
  }
}

function increaseItem(id) {
  const prodNum = document.getElementById(`prodNum${id}`);
  if (prodNum) {
    prodNum.innerHTML = parseInt(prodNum.innerHTML) + 1;
  }
}

function showTotalInfo() {
  const buyProducts = document.getElementById("buyProducts");
  const prodNum = document.getElementsByClassName("prodNum");
  const totalQuantity = document.getElementById("totalQuantity");
  const totalPrice = document.getElementById("totalPrice");
  if (!buyProducts.innerHTML === "") {
    totalQuantity.innerHTML = ""
    totalQuantity.innerHTML = prodNum.in
  }
}

showTotalInfo()

function deleteProd(id) {
  const buyProduct = document.querySelector(`.buyProduct:nth-child(${id})`);
  if (buyProduct) {
    buyProduct.style.display = "none";
  }
  console.log(buyProduct);
}
