var Category;
(function () {
  var instance;
  Category = function Category() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.c_id = '';
    this.name = '';
    this.mark = '';
    this.description = '';
    this.image_url = '';
    this.lower_price = 0;
    this.medium_price = 0;
    this.upper_price = 0;
    this.range_id = 0;
  };
}());
let cateObj = new Category();


class UI {
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
  clear() {
    $("#category").val('');
    $("#title").val('');
    $("#description").val('');
    $('#cate_img').attr('src', '');
    $('#fileButton').val('');
    $(".category-table-body").empty();
  }
}

(function () {
  let ui = new UI();
  let params = (new URL(location)).searchParams;
  cateObj.c_id = params.get('category_id');
  cateObj.name = params.get('mark');
  cateObj.mark = params.get('name');
  cateObj.description = params.get('description');
  cateObj.image_url = params.get('image_url');
  cateObj.lower_price = params.get('lower_price');
  cateObj.medium_price = params.get('medium_price');
  cateObj.upper_price = params.get('upper_price');
  cateObj.range_id = params.get('range_id');

  $('#category').val(params.get('mark'));
  $('#name').val(params.get('name'));
  $('#description').val(params.get('description'));
  $('#cate_img').attr('src', params.get('image_url'));
  $('#lower_bound').val(params.get('lower_price'));
  $('#medium').val(params.get('medium_price'));
  $('#upper_bound').val(params.get('upper_price'));

  $('#back').click(event => {
    window.location.replace("./index.html");
  })

  $("#addCategoryBtn").click(async function () {
    $("#addSpinner").show();
    cateObj.mark = $("#category").val();
    cateObj.name = $("#name").val();
    cateObj.description = $("#description").val();
    cateObj.imageUrl = $("#cate_img").attr('src');
    cateObj.lower_price = $("#lower_bound").val();;
    cateObj.medium_price = $("#medium").val();;
    cateObj.upper_price = $("#upper_bound").val();;

    if (!cateObj.mark ||
      typeof cateObj.mark == "undefined" ||
      cateObj.mark == "" ||
      typeof cateObj.name === "undefined" ||
      cateObj.name == "" ||
      typeof cateObj.description === "undefined" ||
      cateObj.description == "" ||
      typeof cateObj.imageUrl === "undefined" ||
      cateObj.imageUrl == "" ||
      typeof cateObj.lower_price === "undefined" ||
      cateObj.lower_price == "" ||
      typeof cateObj.medium_price === "undefined" ||
      cateObj.medium_price == "" ||
      typeof cateObj.upper_price === "undefined" ||
      cateObj.upper_price == ""
    ) {
      ui.showAlertMsg('所有欄位皆不能為空值', 'alert-danger')
      $("#addSpinner").hide();
    } else {
      $('.loading').addClass('show');
      debugger
      let response = await updateCategory();
      console.log(response);
      if (!response.status) {
        ui.showAlertMsg('未知錯誤發生', 'alert-danger');
        $("#addSpinner").hide();
      }
      let r = response.text();
      if (r["sqlMessage"]) {
        ui.showAlertMsg(r["sqlMessage"], 'alert-danger');
        $("#addSpinner").hide();
      } else {
        await updatePriceRange({
          "range_id": cateObj.range_id,
          "lower_bound": cateObj.lower_price,
          "medium": cateObj.medium_price,
          "upper_bound": cateObj.upper_price
        });
        ui.showAlertMsg("修改成功", 'alert-success');
        $("#addSpinner").hide();
        $('.loading').removeClass('show');
        window.location = document.referrer;
      }
    }
  });

  $('#fileButton').change(e => {
    var file = e.target.files[0];
    var metadata = {
      contentType: 'image/jpeg'
    };

    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
    uploadTask.on('state_changed', function (snapshot) {
      $('#addPhotoSpinner').show();
    }, function (error) {}, function () {
      $('#addPhotoSpinner').hide();
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        $('#cate_img').attr('src', downloadURL);
        cateObj.image_url = downloadURL;
      });
    });
  })

  $('#deleteConfirm').click(e => {
    e.preventDefault();
    console.log('123');
    $('.loading').addClass('show');
    deleteCategory().
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

async function updateCategory() {
  try {
    let option = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify({
        category_id: cateObj.c_id,
        name: cateObj.name,
        mark: cateObj.mark,
        description: cateObj.description,
        image_url: cateObj.image_url
      })
    };
    console.log(option);
    let response = await fetch(
      "https://medfirst-sx.herokuapp.com/category",
      option
    );
    return response;
  } catch (error) {
    console.log("err", error);
  }
}

async function deleteCategory() {
  try {
    let option = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "delete",
    };
    let result = await fetch(
      `https://medfirst-sx.herokuapp.com/category/${cateObj.c_id}`,
      option
    );

    return result;
  } catch (error) {
    console.log("err", error);
  }
}

async function updatePriceRange(body) {
  let option = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'put',
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