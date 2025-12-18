const All_Products_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/products";

const Cart_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/carts";

const Order_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/orders";

let allProducts = [];
let productsInCart = [];
let cartTotalPrice = 0;

// 抓取DOM元素
const dom = {
  productsList: document.querySelector(".productWrap"),
  productSelect: document.querySelector(".productSelect"),
  cart: document.querySelector(".shoppingCart-table"),
  orderInfo: document.querySelector(".orderInfo-form"),
  submitOrderBtn: document.querySelector(".orderInfo-btn"),
  forAdminBtn: document.querySelector(".for-admin-btn"),
  addCardBtns: "", // 等卡片渲染完畢再賦值
  deleteAllBtn: "", // 等購物車渲染完再賦值
};
const inputs = dom.orderInfo.elements;

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
            <td class="finalTotalPrice"></td>
          </tr>`;
const defaultMessageForEmptyCart = `<tr>
            <td colspan='4' class="carts default-message">
              <span class="material-icons md-36 default-icon" >shopping_basket</span>
                <p>目前還沒有喜歡的商品</p>
            </td>
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
    let res = await axios.get(Cart_Api_Url);
    productsInCart = res.data.carts;
    cartTotalPrice = Number(res.data.finalTotal);
    renderCart(productsInCart);
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
      alert("已成功加入購物車");
      let targetId = e.target.closest(".productCard").dataset.id;
      addCart(targetId);
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

function getQuantity(targetId) {
  let existItemsInCart = productsInCart.find(
    (item) => item.product.id === targetId
  );
  let quantity = existItemsInCart ? Number(existItemsInCart.quantity) + 1 : 1;
  return quantity;
}

function renderCart(productsInCart) {
  if (productsInCart.length === 0) {
    dom.cart.innerHTML = defaultMessageForEmptyCart;
  } else {
    let cartItems = productsInCart
      .map((item) => {
        let priceTotal = Number(item.product.price) * Number(item.quantity);
        let cartItem = `<tr class="cart-product" data-id=${item.id}>
            <td>
              <div class="cardItem-title">
                <img src=${item.product.images} alt=${item.product.title} />
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td><input type="number" value=${item.quantity} class="itemQty" min="1" max="5"></td>
            <td>NT$${priceTotal}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons"> clear </a>
            </td>
          </tr>`;
        return cartItem;
      })
      .join("");

    dom.cart.innerHTML = cartTableTitle + cartItems + cartTableBottom;
    const finalTotalPrice = document.querySelector(".finalTotalPrice");
    finalTotalPrice.textContent = `NT$${cartTotalPrice}`;

    // 刪除所有訂單按鈕
    dom.deleteAllBtn = document.querySelector(".discardAllBtn");
    dom.deleteAllBtn.addEventListener("click", function (e) {
      e.preventDefault();
      deleteAllCartItems();
    });
    // 刪除單一訂單按鈕
    const deleteBtns = document.querySelectorAll(".discardBtn ");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let targetCartId = e.target.closest(".cart-product").dataset.id;
        deleteCartItem(targetCartId);
      });
    });
    const itemQtyInput = document.querySelector(".itemQty");
    itemQtyInput.addEventListener("change", function (e) {
      let targetCartId = e.target.closest(".cart-product").dataset.id;
      let newItemQty = e.target.value;
      patchCart(targetCartId, newItemQty);
    });
  }
}

async function addCart(targetId) {
  const prodoctToCart = {
    data: {
      productId: targetId,
      quantity: getQuantity(targetId),
    },
  };
  try {
    let res = await axios.post(Cart_Api_Url, prodoctToCart);
    productsInCart = res.data.carts;
    cartTotalPrice = Number(res.data.finalTotal);
    renderCart(productsInCart);
  } catch (error) {
    console.log(error.res.data);
  }
}

async function deleteAllCartItems() {
  try {
    let res = await axios.delete(Cart_Api_Url);
    productsInCart = res.data.carts;
    renderCart(productsInCart);
  } catch (error) {
    console.log(error);
  }
}

async function deleteCartItem(targetCartId) {
  try {
    let res = await axios.delete(Cart_Api_Url + `/${targetCartId}`);
    productsInCart = res.data.carts;
    cartTotalPrice = Number(res.data.finalTotal);
    renderCart(productsInCart);
  } catch (error) {
    console.log(error.res.data);
  }
}

function checkOrderInputs() {
  let isFinished = true;
  const requiredFields = [
    "customerName",
    "customerPhone",
    "customerEmail",
    "customerAddress",
  ];
  requiredFields.forEach((field) => {
    let targetInputValue = inputs[field].value.trim();
    let targetInputMessage = document.querySelector(
      `#${field} + .orderInfo-message`
    );
    const regexEmail =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let regexEmailMessage = document.querySelector(".email-regax");
    if (!targetInputValue) {
      console.log(targetInputMessage);
      isFinished = false;
      regexEmailMessage.style.display = "none";
      targetInputMessage.style.display = "block";
    } else {
      if (field === "customerEmail") {
        if (!regexEmail.test(targetInputValue)) {
          console.log(regexEmailMessage.style);
          targetInputMessage.style.display = "none";
          regexEmailMessage.style.display = "block";
          onsole.log(regexEmailMessage.style);
          isFinished = false;
        }
      } else {
        targetInputMessage.style.display = "none";
      }
    }
  });
  return isFinished;
}

async function postOrder() {
  let isValid = checkOrderInputs();
  let isCartEmpty = productsInCart.length === 0;
  if (!isValid || isCartEmpty) {
    return;
  } else {
    let orderData = {
      data: {
        user: {
          name: inputs["customerName"].value.trim(),
          tel: inputs["customerPhone"].value.trim(),
          email: inputs["customerEmail"].value.trim(),
          address: inputs["customerAddress"].value.trim(),
          payment: inputs["tradeWay"].value,
        },
      },
    };
    try {
      await axios.post(Order_Api_Url, orderData);
      alert("您的訂單已經建立成功");
      dom.orderInfo.reset();
      getProductsInCart();
    } catch (error) {
      console.log(error);
    }
  }
}

async function patchCart(targetCartId, newItemQty) {
  let orderData = {
    data: {
      id: targetCartId,
      quantity: Number(newItemQty),
    },
  };
  try {
    let res = await axios.patch(Cart_Api_Url, orderData);
    productsInCart = res.data.carts;
    getProductsInCart(productsInCart);
    alert("產品數量修改成功")
  } catch (error) {
    console.log(error);
  }
}

dom.productSelect.addEventListener("change", function (e) {
  e.preventDefault();
  let categorySelected = e.target.value;
  filterProducts(categorySelected);
});

dom.submitOrderBtn.addEventListener("click", function (e) {
  e.preventDefault();
  postOrder();
});

dom.forAdminBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let result = prompt("請輸入管理者帳號");
  if (result === "ivy0406") {
    window.location.href = "./backend/index.html";
  } else {
    return;
  }
});
