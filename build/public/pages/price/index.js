const url_params = new URLSearchParams(window.location.search);
const lower_bound = url_params.get('lower_bound');
const medium = url_params.get('medium');
const upper_bound = url_params.get('upper_bound');
const category_id = url_params.get('category_id');
const range_id = url_params.get('range_id');

class UI {
  constructor() {

    if (lower_bound.localeCompare('undefined') != -1) {
      $('#lower_bound').val(0);
    } else {
      $('#lower_bound').val(lower_bound);
    }
    if (upper_bound.localeCompare('undefined') != -1) {
      $('#upper_bound').val(0);
    } else {
      $('#upper_bound').val(upper_bound);
    }
    if (medium.localeCompare('undefined') != -1) {
      $('#medium').val(0);
    } else {
      $('#medium').val(medium);
    }
  }
}

(function () {
  let ui = new UI();


  $('#update_price').click(async (event) => {
    $("#addSpinner").show();
    console.log(category_id);
    let med = $('#medium').val();
    let lb = $('#lower_bound').val();
    let ub = $('#upper_bound').val();
    let body = {
      "category_id": category_id,
      "lower_bound": lb,
      "medium": med,
      "upper_bound": ub
    };
    let response = await postPriceRange(body);
    let obj = JSON.parse(response);
    if (obj.insertId && typeof obj.insertId !== 'undefined') {
      showAlertMsg('新增成功', 'alert-success')
    } else {
      showAlertMsg(obj.sqlMessage, 'alert-danger')
    }
    $("#addSpinner").hide();
  })

  $('#deleteRange').click(async event => {
    event.preventDefault();
    $("#deleteSpinner").show();
    let response = await deletePriceRange(range_id);
    $("#deleteSpinner").hide();
    window.history.back();
  })

  $('#back').click(event => {
    window.history.back();
  })

})();

function showAlertMsg(msg, type) {
  $(".showAlert").empty();
  $(".showAlert").addClass(`show ${type}`);
  $(".showAlert").append(`${msg}`);
  setTimeout(() => {
    $(".showAlert").empty();
    $(".showAlert").removeClass("show");
    $(".showAlert").removeClass(type);
  }, 3000);
}

async function postPriceRange(body) {
  let option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify(body)
  }
  let categories = await fetch('https://medfirst-sx.herokuapp.com/pricerange', option);
  let data = await categories.text();
  return data;
}

async function deletePriceRange(c_id) {
  let option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'delete',
  }
  let response = await fetch(`https://medfirst-sx.herokuapp.com/pricerange/${c_id}`, option);
  return response;
}