const Orders_Api_url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/ivy1215/orders";
const adminToken = {
      headers: {
        'Authorization': 'goO12Xq0pVMaW3EOLuZbrHhjXxG3'
      }
}

const dom = {
    orderList: document.querySelector(".orderPage-table"),
    deleteAllBtn: document.querySelector(".discardAllBtn")
};


let ordersData = [];

getOrdersData();

async function getOrdersData() {
    try {
        let res = await axios.get(Orders_Api_url,adminToken);
        ordersData = res.data.orders;
        console.log(ordersData);
        renderOrdersList(ordersData);
    } catch (error) {
        console.log(error);
    }
}