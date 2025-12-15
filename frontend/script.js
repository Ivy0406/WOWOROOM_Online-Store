const AllProducts_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/products";
let allProducts = [];

const dom = {
  productsList: document.querySelector(".productWrap"),
  productSelect: document.querySelector(".productSelect"),
  cart: document.querySelector(".shoppingCart"),
  orderInfo: document.querySelector(".orderInfo"),
};

getAllProducts();

async function getAllProducts() {
  try {
    let response = await axios.get(AllProducts_Api_Url);
    allProducts = response.data.products;
    console.log(allProducts);
    renderProducts(allProducts);
  } catch (error) {
    console.log(error);
  }
}

function renderProducts(products) {
  let combinedCards = products
    .map((product) => {
      let card = `<li class="productCard">
          <h4 class="productType">${product["category"]}</h4>
          <img
            src=${product["images"]}
            alt=${product["title"]}
          />
          <a href="#" class="addCardBtn">加入購物車</a>
          <h3>${product["title"]}</h3>
          <del class="originPrice">NT$${product["origin_price"]}</del>
          <p class="nowPrice">NT$${product["price"]}</p>
        </li>`;
      return card;
    })
    .join("");
  dom.productsList.innerHTML = combinedCards;
}

function filterProducts(categorySelected) {
  if (categorySelected === "全部") {
    renderProducts(allProducts);
  } else {
    let productsSelected = allProducts.filter(
      (product) => product["category"] === categorySelected
    );
    renderProducts(productsSelected);
  }
}

dom.productSelect.addEventListener("change", function (e) {
  let categorySelected = e.target.value;
  filterProducts(categorySelected);
});
