class UI {
  constructor() {}

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
(function () {
  let ui = new UI();
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

  let params = (new URL(location)).searchParams;
  let p_id = params.get('product_id');
  let product = JSON.parse(getCookie(p_id));
  console.log(product);
  console.log(product.name);
  $('#product_name').val(product.name);
  $('#price').val(product.price);
  $('#description').val(product.description);
  $('#product_code').val(product.product_code);
  $('#product_priority_order').val(product.priority_order);
  $.each(product.image_urls, function (index, element) {
    var el = document.createElement('li');
    el.innerHTML = `<div><img src="${element.image_url}" data-id=${element.image_id}><i class="js-remove">✖</i></div>`;
    editableList.el.appendChild(el);
  });

  // $.each(product.image_urls, function (indexInArray, valueOfElement) {
  //   console.log(indexInArray);
  //   console.log(valueOfElement);
  //   $('.panel-body').append(`
  //     <div class="row image-row" style=" border-bottom: 2px dashed lightgray; padding: 10px">
  //       <div class="col-sm-4 col-xs-12" style="display:flex;">
  //           <span>排序:</span>
  //           <div class="col-xs-12">
  //             <input type="text" class="form-control" id="order${indexInArray+1}" value="${indexInArray}">
  //           </div>
  //       </div>
  //       <div class="col-sm-8 col-xs-12 input-file">
  //         <input type="file" id="product_photo_url_${indexInArray+1}" data-imgUrl=${valueOfElement.image_url}>
  //         <img src="${valueOfElement.image_url}" id="cate_img_${indexInArray+1}" alt="">
  //       </div>
  //     </div>
  //   `)
  // });

  $("#update-product").click(async function () {
    $("#addSpinner").show();
    let name = $("#product_name").val();
    let price = $("#price").val();
    let description = $("#description").val();
    let product_code = $('#product_code').val();
    let product_priority_order = $('#product_priority_order').val()
    console.log(name, price, description, product_code);

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
      product_priority_order == ""
    ) {
      console.log('欄位皆不能為空');
      $("#addSpinner").hide();
      ui.showAlertMsg('欄位皆不能為空', 'alert-danger')
    } else {
      let body = {
        "name": name,
        "product_id": p_id,
        "price": parseInt(price),
        "description": description,
        "product_code": product_code,
        "priority_order": parseInt(product_priority_order),
      }
      let images = [];
      $('.panel-body li img').each((li_index, item) => {
        let image = {};
        let id = $(item).data('id');
        $.each(product.image_urls, function (item_index, element) {
          if (id == element.image_id) {
            image['op'] = 'update';
          }
        });
        if (id) {
          image['image_id'] = id;
        } else {
          image['op'] = 'post';
        }

        image['image_url'] = item.src;
        image['priority_order'] = li_index;
        console.log(item.src, li_index)
        images.push(image);
      })

      $.each(product.image_urls, function (item_index, element) {
        let exist = false;
        $('.panel-body li img').each((li_index, item) => {
          let id = $(item).data('id');
          if (element.image_id == id) {
            exist = true;
          }
        });
        if (!exist) {
          images.push({
            'image_id': element.image_id,
            'op': 'delete'
          });
        }
      });
      body['image_urls'] = images
      $('.loading').show();
      updateProduct(body).
      then(async data => {
        ui.showAlertMsg('修改成功', 'alert-success')
        $("#addSpinner").hide();
        $('.loading').hide();
      })
    }
  });

  $('#addPhoto').click(e => {
    e.preventDefault();
    document.getElementById("product_photo_url_0").click();
  })

  $(document).on('change', "input[type='file']", function (e) {

    $('.loading').show();
    // setTimeout(() => {
    //   var el = document.createElement('li');
    //   el.innerHTML = `<div><img src="https://loremflickr.com/320/240?random=${Math.random()}"><i class="js-remove">✖</i></div>`;
    //   editableList.el.appendChild(el);
    //   $('.loading').hide();
    // }, 1000);

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
      $('.loading').hide();
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        _this.siblings('img').attr('src', downloadURL);
        _this.attr('data-imgUrl', downloadURL);
        var el = document.createElement('li');
        el.innerHTML = `<div><img src="${downloadURL}"><i class="js-remove">✖</i></div>`;
        editableList.el.appendChild(el);
        // });
      });
    });
  });
  $('#back').click(event => {
    // window.location.replace("./index.html");
    // window.location.reload(history.back());
    window.location = document.referrer;
  })

  $('#deleteConfirm').click(e => {
    e.preventDefault();
    $('.loading').addClass('show');
    deleteProduct(p_id).
    then(response => {
      if (response.status >= 200 && response.status < 300) {
        setTimeout(() => {
          $('.loading').removeClass('show');
          window.location = document.referrer;
        }, 2000);
      } else {
        $('.loading').removeClass('show');
        ui.showAlertMsg('刪除失敗', 'alert-danger')
      }
    })
  })

})();

async function updateProduct(body) {
  console.log(body);
  let option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'put',
    body: JSON.stringify(body)
  }
  console.log(option);
  let categories = await fetch('https://flashboxlaunch.herokuapp.com/product', option);
  let data = await categories.text();
  console.log('updateProduct', data);
  return data;
}

async function deleteProduct(p_id) {
  try {
    let option = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "delete",
    };
    let result = await fetch(
      `https://flashboxlaunch.herokuapp.com/product/${p_id}`,
      option
    );

    return result;
  } catch (error) {
    console.log("err", error);
  }
}
