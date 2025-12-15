const AllProducts_Api_Url =
  "https://livejs-api.hexschool.io/api/livejs/v1/customer/ivy1215/products";
let allProducts = [];

const dom = {
  productsList: document.querySelector(".productWrap"),
  cart: document.querySelector(".shoppingCart"),
  orderInfo: document.querySelector(".orderInfo"),
};

getAllProducts();

async function getAllProducts() {
  try {
    let response = await axios.get(AllProducts_Api_Url);
    let allProducts = response.data.products;
    console.log(allProducts);
    renderProducts(allProducts);
  } catch (error) {
    console.log(error);
  }
}
