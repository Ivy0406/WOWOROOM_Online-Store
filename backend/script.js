const Orders_Api_url =
  "https://livejs-api.hexschool.io/api/livejs/v1/admin/ivy1215/orders";
const Admin_Token = {
  headers: {
    Authorization: "goO12Xq0pVMaW3EOLuZbrHhjXxG3",
  },
};

const dom = {
  orderList: document.querySelector(".orderPage-table"),
  deleteAllBtn: document.querySelector(".discardAllBtn"),
  chartTypeSelect: document.querySelector(".chart-type-select"),
  chartTitle: document.querySelector(".chart-title")
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

const defaultMessageForEmptyList = `
<tr > 
    <td colspan='8' class="default-message">
        <span class="material-icons default-icon" >data_info_alert</span>
        <p>目前暫無新訂單唷 ！</p>
    </td>
</tr>

`;

let ordersData = [];
let selectedChartType = "全品項營收比重";

getOrdersData();

async function getOrdersData() {
  try {
    let res = await axios.get(Orders_Api_url, Admin_Token);
    ordersData = res.data.orders;
    console.log(ordersData);
    renderOrdersList(ordersData);
    updateChart(ordersData,selectedChartType);
  } catch (error) {
    console.log(error);
  }
}

function renderOrdersList(orders) {
  let orderListIsEmpty = orders.length === 0;
  if (orderListIsEmpty) {
    dom.orderList.innerHTML = orderListHead + defaultMessageForEmptyList;
  } else {
    let orderItems = orders
      .map((order) => {
        let orderStatus = "";
        if (!order.paid) {
          orderStatus = "未處理";
        } else {
          orderStatus = "已付款";
        }
        let productsOrdered = order.products
          .map((product) => `<p>${product.title}</p>`)
          .join("");
        let orderItem = `<tr class="order-item">
                <td class="order-id">${order.id}</td>
                <td>
                <p>${order.user.name}</p>
                <p>${order.user.tel}</p>
                </td>
                <td>${order.user.address}</td>
                <td>${order.user.email}</td>
                <td>
                ${productsOrdered}
                </td>
                <td>${new Date(
                  order.createdAt * 1000
                ).toLocaleDateString()}</td>
                <td class="orderStatus">
                <a href="#">${orderStatus}</a>
                </td>
                <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除" />
                </td>
            </tr>`;
        return orderItem;
      })
      .join("");

    dom.orderList.innerHTML = orderListHead + orderItems;

    // 狀態改變按鈕
    const orderStatusBtns = document.querySelectorAll(".orderStatus");
    orderStatusBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let targetOrder = e.target.closest(".order-item");
        console.log(targetOrder);
        editOrderStatus(targetOrder);
      });
    });
    // 刪除按鈕
    const deleteBtns = document.querySelectorAll(".delSingleOrder-Btn");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        let doublecheck = confirm("您確認要刪除此筆訂單嗎？");
        if (!doublecheck) {
          return;
        } else {
          let targetOrder = e.target.closest(".order-item");
          let targetOrderId = targetOrder
            .querySelector(".order-id")
            .textContent.trim();
          deleteTargetOrder(targetOrderId);
        }
      });
    });
  }
}

function editOrderStatus(targetOrder) {
  let result = confirm("您是否要修改訂單狀態呢？");
  if (!result) {
    return;
  } else {
    let targetId = targetOrder.querySelector(".order-id").textContent.trim();
    let targetStatus = targetOrder
      .querySelector(".orderStatus")
      .textContent.trim();
    let isPaid = targetStatus === "已付款";
    let nextStatus = !isPaid;
    putOrders(targetId, nextStatus);
  }
}

async function putOrders(id, status) {
  const targetDataToPut = {
    data: {
      id: id,
      paid: status,
    },
  };
  try {
    let res = await axios.put(Orders_Api_url, targetDataToPut, Admin_Token);
    ordersData = res.data.orders;
    renderOrdersList(ordersData);
  } catch (error) {
    console.log(error);
  }
}

async function deleteAllOrders() {
  try {
    let res = await axios.delete(Orders_Api_url, Admin_Token);
    ordersData = res.data.orders;
    renderOrdersList(ordersData);
    updateChart(ordersData,selectedChartType);
  } catch (error) {
    console.log(error);
  }
}

async function deleteTargetOrder(targetOrderId) {
  try {
    let res = await axios.delete(
      Orders_Api_url + `/${targetOrderId}`,
      Admin_Token
    );
    ordersData = res.data.orders;
    renderOrdersList(ordersData);
    updateChart(ordersData,selectedChartType);
  } catch (error) {
    console.log(error);
  }
}



function updateChart(ordersData,selectedChartType) {
  console.log(ordersData);
  // 整理圖表資料
  let productsCount = {};
  ordersData.reduce((countsObj, order) => {
    order.products.forEach((product) => {
      if(selectedChartType === "全品項營收比重"){
        countsObj[product.title] = (countsObj[product.title] || 0) + (product.quantity*product.price);
      }else{
        countsObj[product.category] = (countsObj[product.category] || 0) + (product.quantity*product.price);
      }
    });
    return countsObj;
  }, productsCount);
  console.log(productsCount);
  const productsCountAry = Object.entries(productsCount).sort((a,b)=> b[1]-a[1]);
  console.log(productsCountAry);
  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: productsCountAry,
    },
    color: {
        pattern: [
          "#100729ff",
          "#301E5F",
          "#5434A7",
          "#7E5BEF",
          "#9D7FEA",
          "#B4A0FF",
          "#DACBFF",
          "#efe6f7ff",
        ],
      },
      size:{
        height:450
      }
  });
}

// 全域監聽綁定
dom.deleteAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let doublecheck = confirm("您確認要刪除所有訂單嗎？");
  if (!doublecheck) {
    return;
  } else {
    deleteAllOrders();
  }
});


dom.chartTypeSelect.addEventListener("change", function(e){
  selectedChartType = e.target.value;
  console.log(selectedChartType);
  dom.chartTitle.textContent = selectedChartType;
  updateChart(ordersData,selectedChartType);
})