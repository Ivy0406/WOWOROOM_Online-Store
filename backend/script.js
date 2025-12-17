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

const orderListHead = `
    <thead>
            <tr>
              <th>訂單編號</th>
              <th>聯絡人</th>
              <th>聯絡地址</th>
              <th>電子郵件</th>
              <th>訂單品項</th>
              <th>訂單日期</th>
              <th>訂單狀態</th>
              <th>操作</th>
            </tr>
          </thead>
`;



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


function renderOrdersList(orders) {
    let orderItems = orders.map(order=>{
        let orderStatus = '';
        console.log(order.paid)
        if(!order.paid){
            orderStatus = '未處理';
        }else{
            orderStatus = '已付款';
        }
        let orderItem = `<tr>
            <td>${order.id}</td>
            <td>
              <p>${order.user.name}</p>
              <p>${order.user.tel}</p>
            </td>
            <td>${order.user.address}</td>
            <td>${order.user.email}</td>
            <td>
              <p>${order.products[0].title}</p>
            </td>
            <td>${new Date(order.createdAt * 1000).toLocaleDateString()}</td>
            <td class="orderStatus">
              <a href="#">${orderStatus}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除" />
            </td>
          </tr>`
        return orderItem;
    }).join('');
    dom.orderList.innerHTML = orderListHead + orderItems;
};

