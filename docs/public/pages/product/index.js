class UI {
  constructor() {}
  renderProductList(products) {
    console.log(products);
    $(".category-table-body").empty();
    $.each(products, function (key, value) {
      console.log(value);
      $(".category-table-body").append(`
        <tr>
          <th>${value.name}</th>
          <th>${value.description}</th>
          <th>${value.price}</th>
          <th>${value.product_code}</th>
          <th>${value.priority_order}</th>
          <th><img class="product-img" src="${value.image_urls[0].image_url}"></th>
          <th>
            <button class="btn btn-primary btn-modify" id="btn-modify" data-id=${value.product_id}>修改<i class="fa fa-spinner fa-spin" style="display: none; margin-left: 10px; font-size:12px"></i></button>
          </th>
      </tr>
    `);
    });
  }

  showAlertMsg(msg, type) {
    $(".showAlert").empty();
    $(".showAlert").addClass(`show ${type}`);
    $(".showAlert").append(`${msg}`);
    setTimeout(() => {
      $(".showAlert").empty();
      $(".showAlert").removeClass("show");
      $(".showAlert").removeClass(type);
    }, 3000);
  }
};

(async function () {
  var byId = function (id) {
    return document.getElementById(id);
  };
  // Editable list
  var editableList = Sortable.create(byId('editable'), {
    animation: 150,
    filter: '.js-remove',
    onFilter: function (evt) {
      evt.item.parentNode.removeChild(evt.item);
    }
  });

  $('#addPhoto').click(e => {
    e.preventDefault();
    // Ply.dialog('prompt', {
    // 	title: 'Add',
    // 	form: { name: 'name' }
    // }).done(function (ui) {
    // 	var el = document.createElement('li');
    // 	el.innerHTML = ui.data.name + '<i class="js-remove">✖</i>';
    // 	editableList.el.appendChild(el);
    // });
    document.getElementById("product_photo_url_0").click();
  })

  let ui = new UI();

  const urlParams = new URLSearchParams(window.location.search);
  const mark = urlParams.get('mark');
  const title = urlParams.get('title');
  const category_id = urlParams.get('category_id');
  // $('#product_name').val(title);

  let response = await getProduct(mark);
  let products = JSON.parse(response)
  ui.renderProductList(products);


  $('#form-submit').click(event => {
    $("#addSpinner").show();
    let name = $("#product_name").val();
    let price = $("#price").val();
    let description = $("#description").val();
    let product_code = $('#product_code').val();
    let product_priority_order = $('#product_priority_order').val()
    console.log(name, price, description, product_code);

    $('.panel-body').children('.li').children('.div').each((index, item) => {
      console.log(item, index);
      console.log($(item).find(`#order${index}`).val());
      console.log($(item).find(`#product_photo_url_${index}`).val());
    });

    if (
      typeof name == "undefined" ||
      name == "" ||
      typeof price === "undefined" ||
      price == "" ||
      typeof description == "undefined" ||
      description == "" ||
      typeof price === "undefined" ||
      price == "" ||
      typeof product_code === "undefined" ||
      product_code == "" ||
      typeof product_priority_order === "undefined" ||
      product_priority_order == "" || $('.panel-body li img').length <= 0
    ) {
      console.log('欄位皆不能為空');
      $("#addSpinner").hide();
      ui.showAlertMsg('欄位皆不能為空', 'alert-danger')
    } else {
      let body = {
        "name": name,
        "category_id": category_id,
        "price": parseInt(price),
        "description": description,
        "product_code": product_code,
        "priority_order": parseInt(product_priority_order),
      }
      let images = [];
      $('.panel-body li img').each((index, item)=>{
        console.log(item.src, index)
        images.push({
          "image_url": item.src,
          "priority_order": index
        })
      })
      // $('.panel-body').children('.li').children('.div').each((index, item) => {
      //   console.log(item, index);
      //   console.log($(item).find(`#order${index}`).val());
      //   console.log($(item).find(`#product_photo_url_${index}`).val());
      //   images.push({
      //     "image_url": $(item).find(`#product_photo_url_${index}`).attr("data-imgUrl"),
      //     "priority_order": parseInt($(item).find(`#order${index}`).val())
      //   })
      // });
      // debugger
      body['images'] = images
      postProduct(body).
      then(async data => {
        ui.showAlertMsg('新增成功', 'alert-success')
        let response = await getProduct(mark);
        products = JSON.parse(response)
        ui.renderProductList(products);
        $("#addSpinner").hide();
      })
    }
  })

  $('#update_price').click(event => {
    let categoryId = $("#category_id").val();
    let lowerBound = $("#lower_bound").val();
    let medium = $("#medium").val();
    let upperBound = $("#upper_bound").val();
    let body = {
      "category_id": categoryId,
      "lower_bound": parseInt(lowerBound),
      "medium": parseInt(medium),
      "upper_bound": parseInt(upperBound)
    }
    postPriceRange(body)
      .then(data => {
        console.log(data);
      })
  })

  $('.category-table-body').on('click', '.btn-modify', function () {
    let product_id = $(this).data("id");
    let index = $(this).parent().parent().index()
    // console.log(products[index]);
    setCookie(product_id, products[index], 10 * 60);
    debugger;
    window.location.href = `./update.html?product_id=${product_id}`;
    // $(this).find('.fa').show();
    // let category_id = $(this).data("id");
    // deleteProduct(category_id).
    // then(response => {
    //   if (response.status >= 200 && response.status < 300) {
    //     $(this).parents('tr').first().remove();
    //   }
    //   $(this).find('.fa').hide();
    // })
  })

  // $('.panel-body').on('click', '.btn-delete', function () {
  //   $(this).find('.fa').show();
  //   let category_id = $(this).data("id");
  //   deleteCategory(category_id).
  //   then(response => {
  //     if (response.status >= 200 && response.status < 300) {
  //       $(this).parents('tr').first().remove();
  //     }
  //     $(this).find('.fa').hide();
  //   })
  // });

  $('#back').click(event => {
    window.location.replace("../category/index.html");
  })

  $('.addIcon').click(event => {
    event.preventDefault();
    $('.panel-body').append(`
      <div class="row image-row" style=" border-bottom: 2px dashed lightgray; padding: 10px">
        <div class="col-sm-4 col-xs-12" style="display:flex;">
            <span>排序:</span>
            <div class="col-xs-12">
              <input type="text" class="form-control" id="order${$('.panel-body .image-row').length}" value="">
            </div>
        </div>
        <div class="col-sm-8 col-xs-12 input-file">
          <input type="file" id="product_photo_url_${$('.panel-body .image-row').length}">
          <img src="" id="cate_img_${$('.panel-body .image-row').length}" alt="">
        </div>
      </div>
    `)
    console.log($('.panel-body .image-row').length);
  })


  $(document).on('change', "input[type='file']", function (e) {

    $('.loading').show();
    // setTimeout(() => {
    //   var el = document.createElement('li');
    //   el.innerHTML = `<div><img src="https://loremflickr.com/320/240?random=${Math.random()}"><i class="js-remove">✖</i></div>`;
    //   editableList.el.appendChild(el);
    //   $('.loading').hide();
    // }, 1000);


    // return;
    var _this = $(this);
    var file = e.target.files[0];
    var metadata = {
      contentType: 'image/jpeg'
    };

    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
    uploadTask.on('state_changed', function (snapshot) {
      $('#addPhotoSpinner').show();
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {

    }, function () {
      $('#addPhotoSpinner').hide();
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        _this.siblings('img').attr('src', downloadURL);
        _this.attr('data-imgUrl', downloadURL);
        var el = document.createElement('li');
        el.innerHTML = `<div><img src="${downloadURL}"><i class="js-remove">✖</i></div>`;
        editableList.el.appendChild(el);
        $('.loading').hide();

        // });
      });
    });
  });

})();

async function getProduct(mark) {
  let categories = await fetch(`https://medfirst-sx.herokuapp.com/products?mark=${mark}`);
  let data = await categories.text();
  // console.log(data);
  return data;
}

async function postProduct(body) {
  console.log(body);
  let option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify(body)
  }
  console.log(option);
  let categories = await fetch('https://medfirst-sx.herokuapp.com/product', option);
  let data = await categories.text();
  console.log('postProduct', data);
  return data;
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

async function deleteProduct(product_id) {
  try {
    let option = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "delete",
    };
    console.log(option);
    let result = await fetch(
      `https://medfirst-sx.herokuapp.com/product/${product_id}`,
      option
    );
    return result;
  } catch (error) {
    console.log("err", error);
  }
}

(function () {



})();