const All_Products_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/products";
let allProducts = [];

const Cart_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/carts";
let productsInCart = [];
let cartTotalPrice = 0;

// 抓取DOM元素
const dom = {
  productsList: document.querySelector(".productWrap"),
  productSelect: document.querySelector(".productSelect"),
  cart: document.querySelector(".shoppingCart-table"),
  orderInfo: document.querySelector(".orderInfo"),
  addCardBtns : '' // 等卡片渲染完畢再賦值
//   
};

const cartTableTitle = `<tr class="table-titile">
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>`;
const cartTableBottom = `<tr class="table-bottom">
            <td>
              <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
            <td>NT$13,980</td>
          </tr>`;   


// 初始化
getAllProducts();
getProductsInCart();

async function getAllProducts() {
  try {
    let response = await axios.get(All_Products_Api_Url);
    allProducts = response.data.products;
    renderProducts(allProducts);
  } catch (error) {
    console.log(error);
  }
}

async function getProductsInCart() {
  try {
    let response = await axios.get(Cart_Api_Url);
    productsInCart = response.data.carts;
    cartTotalPrice = response.data.finalTotal;
    renderCart(productsInCart);
    console.log(productsInCart);
  } catch (error) {
    console.log(error);
  }
}

function renderProducts(products) {
  let combinedCards = products
    .map((product) => {
      let card = `<li class="productCard" data-id="${product["id"]}">
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
    // 綁加入購物車按鈕的監聽
    dom.addCardBtns = document.querySelectorAll(".addCardBtn");
    dom.addCardBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        let productTraget = e.target.closest(".productCard");
        console.log(productTraget);
        const prodoctToCart = {
            data: {
            productId: productTraget.dataset.id,
            quantity: getQuantity(id)
            }
        }
        console.log(prodoctToCart);
    });
});
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

function getQuantity(id) {
}

function renderCart(productsInCart){
    let cartItems = productsInCart.map(item=>{
        let priceTotal = Number(item.product.price) * Number(item.quantity);
        let cartItem = `<tr class="cart-product">
            <td>
              <div class="cardItem-title">
                <img src=${item.product.images} alt=${item.product.title} />
                <p>Antony 雙人床架／雙人加大</p>
              </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${priceTotal}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons"> clear </a>
            </td>
          </tr>`;
            return cartItem;
    }).join("");
    dom.cart.innerHTML = cartTableTitle + cartItems + cartTableBottom;
    console.log(dom.cart);

}

dom.productSelect.addEventListener("change", function (e) {
  let categorySelected = e.target.value;
  filterProducts(categorySelected);
});


