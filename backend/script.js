const Orders_Api_url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/ivy1215/orders";
const Admin_Token = {
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
        let res = await axios.get(Orders_Api_url,Admin_Token);
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
        if(!order.paid){
            orderStatus = '未處理';
        }else{
            orderStatus = '已付款';
        }
        let orderItem = `<tr class="order-item">
            <td class="order-id">${order.id}</td>
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

    const orderStatusBtns = document.querySelectorAll(".orderStatus");
    orderStatusBtns.forEach(btn=>{
        btn.addEventListener('click',function(e){
            e.preventDefault();
            let targetOrder = e.target.closest(".order-item");
            console.log(targetOrder);
            editOrderStatus(targetOrder);
        })
    })
    
};

function editOrderStatus(targetOrder){
    let result = confirm("您是否要修改訂單狀態呢？");
    if(!result){
        return
    }else{
        let targetId = targetOrder.querySelector(".order-id").textContent.trim();
        let targetStatus = targetOrder.querySelector(".orderStatus").textContent.trim();
        let isPaid = targetStatus === "已付款";
        let nextStatus = !isPaid;
        putOrders(targetId,nextStatus);
    }
        
}

async function putOrders(id,status) {
    const targetDataToPut = {
            data: {
            id: id,
            paid: status
            }
        }
    try {
        let res = await axios.put(Orders_Api_url,targetDataToPut,Admin_Token)
        ordersData = res.data.orders;
        renderOrdersList(ordersData);
    } catch (error) {
        console.log(error);
    }
}