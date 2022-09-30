$('.register_btn').click(function () {
  var username = $('.register_name').val();
  var password = $('.register_pass').val();
  if (username == "" || password == "") {
    $('.register_result').html('<div class="alert alert-danger">يرجي ادخال كافة البيانات المطلوبة</div>');
    return false;
  }
  if (site_data.allow_register==0) {
    fireNotification('غير مسموح بتسجيل العضويات الان ');
    return false;
  }
  $.ajax({
    type: "GET",
    url: base_url + "/register?username=" + username + "&password=" + password,
    success: function (data) {
      if (data == "1") {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        $('.register_result').html('<div class="alert alert-success">تم التسجيل بنجاح </div>');
        // $('#UserlogInBtn').trigger('click');
        // $('.login_name').val(username);
        // $('.login_pass').val(password);
        // $('.register_name').val('');
        // $('.register_pass').val();
        setTimeout( function(){
          window.location.replace(base_url+'/home');
        }, 1000 );
      } else {
        fireNotification(data);
        // $('.register_result').html('<div class="alert alert-danger">' + data + '</div>');
      }
    }
  });
  return false;
});

$('.login_btn').click(function () {
  var username = $('.login_name').val();
  var password = $('.login_pass').val();
  if (username == "" || password == "") {
    $('.login_result').html('<div class="alert alert-danger">يرجي ادخال كافة البيانات المطلوبة</div>');
    return false;
  }
  $.ajax({
    type: "GET",
    url: base_url + "/login?username=" + username + "&password=" + password,
    success: function (data) {
      if (data == "1") {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        window.location.href = base_url + "/home";
      } else {
        fireNotification(data);
        // $('.login_result').html('<div class="alert alert-danger">' + data + '</div>');
      }
    }
  });
  return false;
});

$('.visitor_btn').click(function () {
  if (site_data.allow_visitor==0) {
    fireNotification('غير مسموح لدخول الزوار الان ');
    return false;
  }
  var username = $('.visitor_name').val();
  if (username == "") {
    $('.visitor_result').html('<div class="alert alert-danger">يرجي ادخال كافة البيانات المطلوبة</div>');
    return false;
  }
  $.ajax({
    type: "GET",
    url: base_url + "/visitor?username=" + username,
    success: function (data) {
      if (data.status == 1) {
        localStorage.setItem("v-username", username);
        window.location.href = base_url + "/home";
      } else {
        if (data.status == 0) {
          fireNotification(data.msg);
        }
        if (data.status == 2) {
          $('.visitor_result').html('<div class="alert alert-danger">'+data.msg+'</div>');
        }
      }
    }
  });
  return false;
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var cooke_msg = getCookie("msg");

if (cooke_msg != "") {
  fireNotification(cooke_msg);
  document.cookie ="msg=;";
}

function fireNotification(msg){
  var alert = ' <div class="alert-div" style="min-width: 180px; max-width: 260px; border: 1px solid black; z-index: 2110; background-color: rgb(239, 239, 239); position: absolute; top: 30%; margin-left: 34px; padding: 5px;" class="hand corner  "><center><div class="corner border label label-primary" style="margin-top: -10px; padding-top: 10px; padding-left: 15px; width: 50%; padding-right: 15px; border-radius: 15px;">تنبيه</div></center>'+
  '<div style="width:100%;display:block;padding:0px 5px;" class="break fl">'+msg+'</div></div>';
  $('.notifi-div').append(alert);
}

$('body').click(function(){
  $('.alert-div').remove();
})


if (typeof(Storage) !== "undefined") {
    // Retrieve
    $('.visitor_name').val(localStorage.getItem("v-username"));
    $('.login_name').val(localStorage.getItem("username"));
    $('.login_pass').val(localStorage.getItem("password"));
}
