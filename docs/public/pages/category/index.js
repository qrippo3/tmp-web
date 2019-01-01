var Category;
(function () {
  var instance;
  Category = function Category() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.name = '';
    this.mark = '';
    this.description = '';
    this.image_url = '';
    this.lower_price = 0;
    this.medium_price = 0;
    this.upper_price = 0;
  };
}());
let cateObj = new Category();

class UI {

  async renderCategoryList() {
    let category = await getCategory();
    let cobj = await JSON.parse(category);
    let pricerange = await getPriceRange();
    let pobj = await JSON.parse(pricerange);
    let res = _(cobj).concat(pobj).groupBy('mark').map(_.spread(_.assign)).value();
    res.forEach(element => {
      $(".category-table-body").append(`
      <tr>
      <input type="hidden" class="c_range_id" value=${element.range_id}>
      <td class="c_mark" style="text-align: center;font-size: 2rem;"><a href="../product/?mark=${element.mark}&title=${element.name}&category_id=${element.category_id}">${element.mark}</a></td>
      <td class="c_name">${element.name}</td>
      <td class="c_description">${element.description}</td>
      <td class="c_lower_price">${element.lower_bound}</a></td>
      <td class="c_medium_price">${element.medium}</a></td>
      <td class="c_upper_price">${element.upper_bound}</a></td>
      <td class="c_imageUrl"><img src="${element.image_url}" ></td>
      <td>
        <button class="btn btn-primary btn-modify" id="btn-modify" data-id=${element.category_id}>修改</button>
      </td>
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
  clear() {
    $("#category").val('');
    $("#title").val('');
    $("#description").val('');
    $('#cate_img').attr('src', '');
    $('#fileButton').val('');
    $(".category-table-body").empty();
  }
}


(async function () {
  // debugger;
  let ui = new UI();
  await ui.renderCategoryList();
  $("#addCategoryBtn").click(async function () {
    $("#addSpinner").show();
    let mark = $("#category").val();
    let name = $("#title").val();
    let description = $("#description").val();
    let imageUrl = $("#cate_img").attr('src');
    console.log(mark);
    if (!mark ||
      typeof mark == "undefined" ||
      mark == "" ||
      typeof name === "undefined" ||
      name == "" ||
      typeof description === "undefined" ||
      description == "" ||
      typeof imageUrl === "undefined" ||
      imageUrl == ""
    ) {
      ui.showAlertMsg('所有欄位皆不能為空值', 'alert-danger')
      $("#addSpinner").hide();
    } else {
      cateObj.name = name;
      cateObj.mark = mark;
      cateObj.description = description;
      let response = await postCategory();
      let r = JSON.parse(response);
      console.log(r);
      if (r["sqlMessage"]) {
        ui.showAlertMsg(r["sqlMessage"], 'alert-danger');
        $("#addSpinner").hide();
      } else {
        console.log(r.insertId);
        await createPriceRange({
          "category_id": r.insertId,
          "lower_bound": 100,
          "medium": 1000,
          "upper_bound": 10000
        });
        ui.showAlertMsg("新增成功", 'alert-success');
        ui.clear();
        await ui.renderCategoryList();
        $("#addSpinner").hide();
      }
    }
  });

  // $('.category-table-body').on('click', '.btn-delete', function () {
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

  $('.category-table-body').on('click', '.btn-modify', function () {
    let mark = $(this).closest('tr').find('.c_mark').text() || ' ';
    let name = $(this).closest('tr').find('.c_name').text() || ' ';
    let description = $(this).closest('tr').find('.c_description').text() || ' ';
    let image_url = $(this).closest('tr').find('.c_imageUrl img').attr('src') || ' ';
    let category_id = $(this).data("id");
    let lower_price = $(this).closest('tr').find('.c_lower_price').text() || ' ';
    let medium_price = $(this).closest('tr').find('.c_medium_price').text() || ' ';
    let upper_price = $(this).closest('tr').find('.c_upper_price').text() || ' ';
    let range_id = $(this).closest('tr').find('.c_range_id').val() || ' ';
    console.log(category_id, mark, name, description, image_url);
    window.location.href = `./update.html?category_id=${category_id}&range_id=${range_id}&mark=${mark}&name=${name}&description=${description}&lower_price=${lower_price}&medium_price=${medium_price}&upper_price=${upper_price}&image_url=${encodeURI(image_url)}`;
  })

  $('#fileButton').change(e => {
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
        $('#cate_img').attr('src', downloadURL);
        cateObj.image_url = downloadURL;
      });
    });
  })
})();

async function getCategory() {
  let categories = await fetch(
    `https://medfirst-sx.herokuapp.com/categories`
  );
  let data = await categories.text();
  console.log(data);
  return data;
}

async function postCategory() {
  try {
    let option = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      },
      method: "post",
      body: JSON.stringify({
        name: cateObj.name,
        mark: cateObj.mark,
        description: cateObj.description,
        image_url: cateObj.image_url
      })
    };
    let categories = await fetch(
      `https://medfirst-sx.herokuapp.com/categories`,
      option
    );
    let data = await categories.text();
    return data;
  } catch (error) {
    console.log("err", error);
  }
}

async function getPriceRange() {
  let categories = await fetch('https://medfirst-sx.herokuapp.com/pricerange');
  let data = await categories.text();
  return data;
}

async function createPriceRange(body) {
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