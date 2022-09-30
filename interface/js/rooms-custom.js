function fireWelcomeMsg(msg, image)
{
  var d = new Date();
  var n = d.getTime();
  // console.log(msg);
  var final = '<li class="single-chat-line text-left" style="direction:ltr; cursor: pointer; border-bottom: 2px;"><div class="user-avatar pull-left"><a class="single-user-panel"><img src="'+image+'" class="userIMG"></a></div><h5 class="single-user-panel">'+
  '<span style="padding: 1px 8px; margin-top: 2px; display: block; max-width: 82%; border-radius: 3px; color: red;" class="corner nosel u-topic dots fl hand">رساله ترحيب</span><span style="margin-top:2px;padding:0px 2px;margin-left:-20px;margin-right:4px;color:grey" class="fr minix tago" ago="'+n+'">الآن</span><br></h5><p style="font-size: 12px;">'+msg+'</p></li>';
  $('.room_wall').append(final);
}


function remove_manger(id)
{
  $.get(base_url+'/remove/manager/'+id+'/room/'+user.room_id,
  function(response,status){
    if (response.status == 1) {
      // console.log(response);
      $('.manager_'+id+'_room_'+user.room_id).remove();
      socket.emit('updateUser', response.manager, function(response){
        // console.log(response);
      });
    }
  });
}
// send message room chat
$('.chat_btn').click(function () {
  $('.chat_message').focus();
  var message = $('.chat_message').val();
  var room_id = user.room_id;
  var room_name = user.room_name;
  if (message == "" || room_id == "" || disable_msgs==null || message.trim() == "") {
    return false;
  }
  if ($.inArray(room_id, out_rooms ) != -1) {
    fireNotification({msg:'تم طردك من الغرفة'});
    return false;
  }
  if ($.inArray(room_id, deleted_rooms ) != -1) {
    fireNotification({msg:'تم ايقاف الغرفة من  الاداره  .'});
    return false;
  }
  $('.chat_message').val('');
  $.post(base_url+'/filter/msg', {msg: message}, function(response){
    // console.log(response);
    if (response.status == 0) {
      var msg_data = {
        user: user,
        room_id: room_id,
        room_name: room_name,
        message: message,
      }
      fireRoomMessage(msg_data);
    }else{
      var data = {
        room_id: room_id,
        room_name: room_name,
        message: response.msg,
        user: user,
      }
      socket.emit('roomMsg', data, function(response){
      });
    }
  });

  return false;
});

$('.rdelete').on('click', function(){
  if (user.type == "admin" || user.room_manage == user.room_id || user.group.manage_room ==1) {
    delete_room($(this).attr('data-id'));
    addLog('حذف غرفة', user.id);
  }
});

function delete_room(id){
  socket.emit('deleteRoomEvent', {id: id}, function(response){
    $('#roomIInfo').modal('hide');
    console.log(response);
  });
}

socket.on('deleteRoomListner', function(data){
  if (user.room_id == data.id) {
    user.room_id = '';
    $('.chat_message').css('background-color','lightgray');
    fireNotification({msg:'تم ايقاف الغرفة .'});
  }
  if ($('#li_room_'+data.id).length > 0) {
    $('#li_room_'+data.id).remove();
    var rooms_count = parseInt($('.rooms_count').html()) -1;
    $('.rooms_count').html(rooms_count);
    deleted_rooms.push(data.id);
  }
});

// out user from room
$('body').on('click', 'a.out_room', function () {
  if (user.group.logout_num <= user.logout_count) {
    fireNotification({msg: 'لقد تعديت الحد الاقصي المسموح به يوميا .'});
    return false;
  }
  var out_room_user = all_users.find(elem => elem.id == $(this).attr('visitor_id'));
  if (user.group.power < out_room_user.group.power) {
    fireNotification({msg: 'لا يمكنك طرد رتية اعلى .'});
    return false;
  }
  if (user.type == "admin" || user.room_manage == user.room_id || user.group.manage_room == 1) {
    out_room_user.room_id = '';
    var data = {
      message: '(تم طرد المستخدم من الغرفة)',
      user: out_room_user,
      room_id:   $('.room_wall').attr('room_id'),
      room_name: $('.room_wall').attr('room_name'),
      room_img: $('.room_wall').attr('room_img'),
      type: 'out_room',
    }
    user.logout_count +=1;
    var response = incrementCount('logout');
    if (response == 0) {
      fireNotification({msg: 'لقد تعديت الحد الاقصي المسموح به يوميا .'});
    }else{
      socket.emit('roomMsg', data, function(response){
        // console.log(response);
      });
      addLog('طرد من  الغرفة ', out_room_user.id)
    }
  }
});

// change room
$('body').on('click', 'a.open_room', function () {
  if(user.room_id != undefined){
    var room = rooms.find(room => room.id == user.room_id);
  }
  var room_id = $(this).attr('room_id');
  var new_room = rooms.find(room => room.id == room_id);
  var room_name = new_room.name;
  var password = new_room.password;
  var image = '/images/rooms/'+new_room.image;
  var welcome = new_room.welcome;
  var room_capacity = parseInt(new_room.max);
  if (user.room_id != null && room_id == user.room_id) {
    return false;
  }
  if (room != undefined && room.owner == user.username && room.active == 'no') {
    delete_room(room.id);
  }
  if ($.inArray(room_id, deleted_rooms) != -1) {
    fireNotification({msg:'تم ايقاف الغرفة من  الاداره  .'});
    return false;
  }
  if ($.inArray(parseInt(room_id), out_rooms) != -1) {
    fireNotification({msg:'تم طردك من الغرفة'});
    return false;
  }
  if (room_capacity <= parseInt($('.room_count_'+room_id).html()) ) {
    fireNotification({msg: 'عفوا الغرفة ممتلئة .'});
    return false;
  }
  if (password != '' ) {
    var user_password = prompt("من فضلك ادخل كلمة المرور ", "");
    if (user_password == "" || user_password == null) {
      return false;
    }
    if (user_password.trim() == "") {
      return false;
    }
    if (password !== user_password) {
      alert('كلمة المرور غير صحيحه ');
      return false;
    }
  }

  $('li.active').removeClass('active');
  $(this).closest('li').addClass('active');
  $('.room_wall').attr('room_id', room_id);
  $('.chat_message').css('background-color','transparent');
  $('.room_wall').attr('room_name', room_name);
  $('.room_wall').attr('password', password);

  var old_room = user.room_id;
  user.room_id = room_id;
  user.room_name = room_name;
  user.room_img = image;

  if (user.room_id == user.room_manage||user.group.manage_room == 1) {
    $('.manage_room').css('display', 'block');
  }else {
    if (user.type != 'admin' || user.group.manage_room == 0) {
      $('.manage_room').css('display', 'none');
    }
  }

  disable_msgs = 0;
  var data = {
    message: '<a class="fa fa-sign-out open_room" style="background-color: #000000;padding:3px;color:#FFFFFF; border-radius:5px;" room_id="'+room_id+'" room_name="'+room_name+'" password="'+password+'" image="'+image+'" welcome="'+welcome+'" room_capacity="'+room_capacity+'">'+room_name+'</a>' + ' هذا المستخدم انتقل الي ',
    new_room_msg: '<a class="fa fa-sign-out open_room" style="background-color: #000000;padding:3px;color:#FFFFFF; border-radius:5px;" room_id="'+room_id+'" room_name="'+room_name+'" password="'+password+'" image="'+image+'" welcome="'+welcome+'" room_capacity="'+room_capacity+'">'+room_name+'</a>' + 'هذا المستخدم قد دخل ',
    user: user,
    room_id: old_room,
    new_room_id: room_id,
    room_name: room_name,
    room_img: image,
    type: 'change_room',
  };

  socket.emit('roomMsg', data, function(response){
    if (welcome != '' || image != '') {
      fireWelcomeMsg(welcome, image);
    }
  });

  $.get(base_url + '/change/room/session/' + room_id, function(response, status) {
    // console.log(response);
  });
});

//create room
$('.createRoom').click(function(){
  $.post(base_url+'/room/store',
  {
    'name': $('.r_name').val(),
    'description': $('.r_description').val(),
    'welcome': $('.r_welcome').val(),
    'max': $('.r_max').val(),
    'password': $('.r_password').val(),
    'active': ($('input[name="r_active"]:checked').length > 0)? 'yes':'no',
  },
  function(response,status){
    if (response.status == 0) {
      fireNotification({'msg': response.msg});
      // alert();
    } else {
      var room = response.room;
      $('.r_name').val("");
      $('.r_description').val("");
      $('.r_welcome').val("");
      $('.r_max').val("");
      $('.r_password').val("");
      $('#myModalRoomAdd').modal('hide');
      socket.emit('addRoom', room, function(response){
        alert('تم انشاء الغرفة بنجاح .');
        open_room(room.id);
      });
    }
  });
});

function open_room(id){
  hideUserModal();
  $('#room_'+id).click();
}
//get room with managers
function room_manage(){
  if (user.type == 'admin' || user.room_manage == user.room_id || user.group.manage_room ==1) {
    $.get(base_url+'/room/show/'+user.room_id, function(response,status){
      $('.update_room_id').val(user.room_id);
      $('.room_name').val(response.room.name);
      $('.room_description').val(response.room.description);
      $('.room_welcome').val(response.room.welcome);
      $('.room_max').val(response.room.max);
      $('.room_password').val(response.room.password);
      $('.rdelete').attr('data-id', response.room.id);
      if (response.room.active == 'yes') {
        $('.room_active').attr('checked', true);
      }
      var managers_ui='';
      response.managers.forEach(function(manager){
        var name = (manager.fake_name=="")?manager.username:manager.fake_name;
        var gift =  (manager.gift=="")? "": '<img class="fl ustat" style="width:4px;height:22px; " src="'+base_url+"/images/gifts/"+manager.gift+'">';
        if (manager.type == 'visitor'&&manager.image=="") {
          var image = "/images/site/"+site_data.image;
        } else {
          var image =  (manager.image=="")? "/images/site/" + site_data.image : "/images/users/"+manager.image;
        }
        managers_ui += '<div class="fl  uzr manager_'+manager.id+'_room_'+user.room_id+'" style="margin: 3px; width: 100%; background-color: white;">'+gift+
        '<img style="width: 24px; height: 24px; background-image: url('+base_url+image+');" class="fitimg fl hand u-pic ">'+
        '<div style="width: 70%;" class="fl">'+
        '<div style="width:100%;margin-top:0px;" class="fl">'+
        '<img class="fl u-ico" alt="">'+
        '<div class="fl" style="width:90%;"><span style="max-width:100%;padding: 1px 8px;border-radius: 3px;" class="corner nosel u-topic dots">'+name+'</span></div>'+
        '</div>'+
        '</div>'+
        '<a onclick="remove_manger('+manager.id+');" class="fa fa-times">إزاله</a>'+
        '</div>';
      });
      $('.room_managers').html(managers_ui);
      $('#roomIInfo').modal('show');
    });
  }
}

//update room
$('.updateRoom').click(function(){
  $.post(base_url+'/room/update',
  {
    'id': $('.update_room_id').val(),
    'name': $('.room_name').val(),
    'description': $('.room_description').val(),
    'welcome': $('.room_welcome').val(),
    'max': $('.room_max').val(),
    'password': $('.room_password').val(),
    'active': ($('input[name="r_active"]:checked').length > 0)? 'yes':'no',
  },
  function(response,status){
    if (response.status == 0) {
      alert('حدث خطأ في تعديل البيانات ');
    } else {
      // console.log(response);
      $('#roomIInfo').modal('hide');
      socket.emit('updateRoom', response.room, function(response){
        // console.log(response);
      });
      addLog('تعديل غرفه	', user.id)
    }
  });
});


function disableMessages()
{
  var old_room = user.room_id;
  disable_msgs = 1;
  user.room_id =  0;
  user.room_name =  "";
  user.room_img =  "";

  var data = {
    message: ' هذا المستخدم  قد غادر الغرفة',
    user: user,
    room_id: old_room,
    new_room_id: 0,
    room_name: "",
    room_img: "",
    type: 'change_room',
  };
  socket.emit('roomMsg', data, function(response){
    // console.log(response);
  });

  $.get(base_url + '/change/room/session/0', function(response, status) {
    // console.log(response);
  });

  $('li.active').removeClass('active');
  $('.chat_message').css('background-color','lightgray');
}

socket.on('appendRoom', function(data){
  var icon = (data.password==undefined || data.password=='')? '': '<img src="'+base_url+'/images/lock.png" style="margin:2px;margin-top:4px;" class="fl">';

  var room_ui = '<li class="single-conversation text-left" id="li_room_'+data.id+'" room_id="'+data.id+'" data-registerd="0">'+
  '<a class="open_room" id="room_'+data.id+'" room_id="'+data.id+'" room_name="'+data.name+'" welcome="'+data.welcome+'" image="/images/rooms/'+data.image+'" password="'+data.password+'" room_capacity="'+data.max+'" style="cursor: pointer">'+
  '<div class="user-avatar pull-left" style="width:32px;height:32px;margin-right:4px;"><img src="'+base_url+'/images/rooms/'+data.image+'" class="userIMG" style="width:32px;height:32px;margin-right:4px;" class="fl u-pic"></div>'+
  '<div class="corner fa fa-user label label-primary fr uc br" style="padding: 4px; margin-right: -1px;"><span class="room_count room_count_'+data.id+'">0</span><span>/'+data.max+'</span></div>'+
  '<div style="width:64%;" class="fl"><div style="width:100%;margin-top:-1px;" class="fl"><div style="width:78%;" class="u-topic ui-corner-all dots">'+icon+data.name+'</div></div><div style="width:100%;color:#888;margin-top:-8px;" class="fl mini u-msg">'+data.description+'</div></div>'+
  '</a>'+
  '</li>';
  $('.room_update').append(room_ui);
  var rooms_count = parseInt($('.rooms_count').html()) +1;
  $('.rooms_count').html(rooms_count);
  rooms.push(data);
});

socket.on('appendUpdateRoom', function(data){
  var icon = (data.password==undefined || data.password=='')? '': '<img src="'+base_url+'/images/lock.png" style="margin:2px;margin-top:4px;" class="fl">';

  var room_count = $('.room_count_'+data.id).html();
  var room_ui =  '<a class="open_room" id="room_'+data.id+'" room_id="'+data.id+'" room_name="'+data.name+'" welcome="'+data.welcome+'" image="'+base_url+'/images/rooms/'+data.image+'" password="'+data.password+'" room_capacity="'+data.max+'" style="cursor: pointer">'+
  '<div class="user-avatar pull-left" style="width:32px;height:32px;margin-right:4px;"><img src="'+base_url+'/images/rooms/'+data.image+'" class="userIMG" style="width:32px;height:32px;margin-right:4px;" class="fl u-pic"></div>'+
  '<div class="corner fa fa-user label label-primary fr uc br" style="padding: 4px; margin-right: -1px;"><span class="room_count room_count_'+data.id+'">'+room_count+'</span><span>/'+data.max+'</span></div>'+
  '<div style="width:64%;" class="fl"><div style="width:100%;margin-top:-1px;" class="fl"><div style="width:78%;" class="u-topic ui-corner-all dots">'+icon+data.name+'</div></div><div style="width:100%;color:#888;margin-top:-8px;" class="fl mini u-msg">'+data.description+'</div></div>'+
  '</a>';
  $('#li_room_'+data.id).html(room_ui);
});
