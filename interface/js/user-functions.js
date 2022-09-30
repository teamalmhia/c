function userModal(selected_user) {
  if (selected_user != undefined || selected_user != null) {
    var name = (selected_user.fake_name == "") ? selected_user.username : selected_user.fake_name;
    var gift = (selected_user.gift == "") ? "" : '<img class="fl u-ico" src="' + base_url + "/images/gifts/" + selected_user.gift + '">';
    var image = (selected_user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + selected_user.image;
    if (selected_user.group == undefined || selected_user.group=="") {
      selected_user.group = groups.find(group=> group.id == selected_user.group_id);
    }
    var group_icon = (selected_user.group.image == "")? "": '<span><img class="fl u-ico" src="'+base_url+'/images/gifts/'+selected_user.group.image+'"></span>';
    var icon = (selected_user.group_id==2)?gift:group_icon;
    var modal = "";
    var likes = parseInt(selected_user.likes);
    if (likes > 999999999) {
      likes = 'le+'+ parseInt(likes/999999999);
    }

    modal += '<div class="modal-dialog modal-sm" role="document"><div class="modal-content light fl pro" style="width: 100%;direction: initial;overflow:auto;max-height: 100%;"><div onclick="hideUserModal()" style="direction: ltr;color: white; margin-top: -1px; border-radius: 15px;" class="modal-header label-primary"><button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close" style="background-color: #777;color:  white;width: 20px;height: 17px;border-radius: 15px;opacity: 1;">' +
    '<i class="fa fa-times"></i></button>' +
    '<label style="margin:1px;width:90%;" class="mini dots nosel modal-title"><div class="user-gift-' + selected_user.id + '">'+icon;

    modal += '</div><img class="user-img-' + selected_user.id + '" style="width:18px;height:18px;" src="' + base_url + image + '">' + '<span class="modal-user-name user-name-' + selected_user.id + '">' + name + '</span></label></div>';

    modal += '<div id="' + selected_user.id + '" user_id="' + selected_user.id + '"><div class="user-panel-img fitimg" style="text-align:center;background-image:url(\''+base_url+image+'\');height: 200px;  width: 100%;"></div>' +
    '<label style="width:100%;text-align:end;margin-bottom:0px;"><div style="width:100%;padding:2px;text-align: center;" class="fl u-msg">' + selected_user.status + '</div>' +
    '<div class="fl mini u-co" style="margin:4px;">' + selected_user.country + '<img class="fl" src="' + base_url + '/images/flags/' + selected_user.country + '.png"></div>';

    if (selected_user.room_id != undefined && selected_user.room_id != "") {
      var room = rooms.find(room => room.id == selected_user.room_id);
      var room_img = (room.image == "") ? "/images/site/" + site_data.image : "/images/rooms/" + room.image;
      modal += '<div onclick="open_room('+room.id+')" class="ui-corner-all ui-shadow fr u-room"><div class="fl btn btn-primary dots roomh border" style="padding:3px;max-width:180px;"><img style="height: 24px;width:24px;" src="' + base_url + room_img + '"><a style="color: white;"style="cursor: pointer">"' + room.name + '"</a></div></div>';
    }

    modal += '</label>';

    modal += '<ul class="list-unstyled">';

    if (user.type == 'visitor' && site_data.private_visitor == "no") {
      modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default"><a style="color:black;" class="chat_visitor" conversation-id=""  user-id="' + selected_user.id + '" chat="' + selected_user.chat + '"><i class="fa fa-comment"></i> محادثة خاصة</a></li>'
    } else if (site_data.private_all == "no") {
      modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default"><a style="color:black;display:flex;justify-content: center;" class="chat_visitor" conversation-id="" user-id="' + selected_user.id + '" chat="' + selected_user.chat + '"><i class="fa fa-comment"></i> محادثة خاصة</a></li>'
    }

    modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default">' +
    '<a style="cursor: pointer;color:black;display:flex;justify-content: center;" data-toggle="modal" onclick="sendAlert($(this))" user-id="' + selected_user.id + '"><i class="fa fa-envelope-o"></i> تنبيه</a></li>';

    modal += '<li style="color:black;display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer; color: red;" class="li_like add_like btn btn-default" onclick="addLike($(this))" user-id="' + selected_user.id + '"><div style="display:flex;justify-content: center;"><i class="fa fa-heart"></i><span class="likes_number">' + likes + '</span></div></li>';


    if (user.type == "admin" || user.group.gifts_num > 0) {
      modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default">' +
      '<a class="gift-btn" onclick="displayGift(' + selected_user.id + ')" style="color:blue; cursor: pointer;display:flex;justify-content: center;" visitor_id="' + selected_user.id + '"><i class="fa fa-diamond">ارسال هدية</i></a></li>';
    }

    if (user.type == "admin" || user.group.user_history==1) {
      modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default">' +
      '<a onclick="showUserRecord($(this))" username="' + selected_user.username + '" style="color:black; cursor: pointer;display:flex;justify-content: center;"><i class="fa fa-search"> كشف النكات</i></a></li>';
    }
    if (user.type == "admin" || user.group_id != 2 ) {
      modal += ' <li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default">' +
      '<a style="color:maroon; cursor: pointer;display:flex;justify-content: center;" class="remove_img" user-id="' + selected_user.id + '"><i class="fa fa-ban"></i> حذف الصورة</a></li>';
    }

    if (selected_user.type != "admin") {
      if (user.type == "admin" || user.room_manage == user.room_id || user.group.logout_num >0 ) {
        modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default">' +
        '<a class="out_room" onclick="hideUserModal()" style="color:darkorchid; cursor: pointer;display:flex" visitor_id="' + selected_user.id + '"><i class="fa fa-user-times">طرد من  الغرفة </i></a></li>';

        modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-ban">' +
        '<a style="color:crimson; cursor: pointer;display:flex;justify-content: center;" onclick="logoutUser(' + selected_user.id + ')" class="logout-user" user-id="' + selected_user.id + '"><i class="fa fa-ban"></i> طرد</a></li>';
      }

      if (user.type == "admin" || user.group.ban ==1) {
        modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-ban">' +
        '<a style="color:crimson; cursor: pointer;display:flex;justify-content: center;" onclick="banUser(' + selected_user.id + ')" class="ban-user" user-id="' + selected_user.id + '"><i class="fa fa-ban"></i> باند</a></li>';
      }

      if (user.type == "admin" || user.room_manage != 0) {
        if (selected_user.room_manage == 0) {
          modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default">' +
          '<a onclick="manageRoom(' + selected_user.id + ')" style="color:darkgreen; cursor: pointer;display:flex;justify-content: center;"><i class="fa fa-user-plus">ترقية الي مراقب </i></a></li>';
        }
      }
    }
    var ignore_link = ignore_users.includes(selected_user.id)?'<a style="color:crimson; cursor: pointer;" onclick="removeIgnore(' + selected_user.id + ')"><i class="fa fa-check">إلغاء التجاهل</i></a>':'<a style="color:crimson; cursor: pointer;" onclick="ignoreUser(' + selected_user.id + ')"><i class="fa fa-ban">تجاهل</i></a>';
    modal += '<li style="display: inline-block;padding: 3px;margin: 2px;border: 1px solid #D6E3E3;height: 29px;min-width: 105px;cursor: pointer;" class="btn btn-default li-ignore">' +ignore_link+'</li>';

    modal += '</ul></div>';
    var change_fake_name = '<div class="border nickbox fl" style="padding:4px;margin-top:2px;width:100%;">' +
    '<label class="label fl label-primary br" style="height: 32px; padding: 8px;">الزخرفه</label>' +
    '<textarea class="borderg corner  fl u-topic fake_name" style="height:32px;padding:4px;width:60%;resize:none;">' + name + '</textarea>' +
    '<label class="btn btn-primary fr fa fa-save change_fake_name" onclick="changeFakeName(' + selected_user.id + ')">تغير</label></div>';
    if (user.type=="admin"||user.group.change_users_fake_name == 1) {
      modal += change_fake_name;
    }else{
      if (user.id == selected_user.id && user.group.change_fake_name == 1) {
        modal += change_fake_name;
      }
    }


    if (user.type == "admin" ||user.group.subscribe_setting == 1) {
      modal+= '<div class="border fl powerbox" style="width:100%;padding:4px;margin-top:2px;">'+
      '<label>المجموعه</label><br>'+
      '<select style="width:200px;display:inline;" class="selbox form-control user-group">'+
      '<option value="2"></option>';
      for (var i = 0; i < groups.length; i++) {
        if (groups[i]['id'] != 2 && groups[i]['id'] != 52) {
          modal+='<option value="'+groups[i]['id']+'">'+groups[i]['name']+'</option>';
        }
      }
      modal+=  '</select><br>'+
      '<label>المده بالأيام</label><br>'+
      '<input type="number" class="user-group-period"><br>'+
      '<a class="fa fa-check btn ui-corner-all ui-shadow ui-btn ui-btn-inline upower border" style="margin:2px;" onclick="changeGroup('+selected_user.id+')">حفظ</a>'+
      '</div>';
    }

    modal += '</div></div>';

    $('#userModal').empty().append(modal);
    $('#userModal').modal('show');

  }
}

function userListOrder() {
  $('.online_users_count').html(all_users.length);
  $('.room_count').html(0);
  $('.current_room_online_user').html('');
  $('.current_room_online_visitor').html('');
  $('.other_room_online_user').html('');
  $('.other_room_online_visitor').html('');
  $('li.li-room').attr('data-registerd',0);
  if (user.room_id == "") {
    $('.current_room_users').css('display', 'none');
    $('.other_room_users').css('display', 'none');
  }else {
    $('.current_room_users').css('display', 'block');
    $('.other_room_users').css('display', 'block');
  }
  for (var i = 0; i < all_users.length; i++) {
    all_users[i]['group'] = groups.find(group=> group.id == all_users[i]['group_id']);
  }
  all_users.sort((a, b) => parseInt(b.group.power)-parseInt(a.group.power));
  all_users.forEach(function(one_user) {
    var username = (one_user.fake_name == "") ? one_user.username : one_user.fake_name;
    var image = (one_user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + one_user.image;
    var group_icon = (one_user.group.image == "")? "": '<span><img class="fl u-ico" src="'+base_url+'/images/gifts/'+one_user.group.image+'"></span>';
    var gift = (one_user.gift == "")?'':'<img class="fl u-ico" src="' + base_url + "/images/gifts/" + one_user.gift + '">';
    var icon = (one_user.group_id==2)?gift:group_icon;
    var user_connection_status = 's0.png';
    var ignore = ignore_users.includes(one_user.id)?'<i class="color-red user-ignore-'+one_user.id+' fa fa-ban"></i>':'<i class="color-red user-ignore-'+one_user.id +'"></i>';
    if (one_user.holding == 1) {
      user_connection_status = 's1.png';
    }
    if (one_user.disable_private == 1) {
      user_connection_status = 's2.png';
    }
    var final = '<li style="text-align:left;background-color:white;border-radius:0px!important;width:99%;margin: 0px 1px -1px 2px!important;padding:1px;" class="single-online-user text-left online single-user-panel" visitor_id="' + one_user.id + '"><img class="fl ustat user-connection-'+one_user.id+'" style="width:3px;height:36px;margin-left: 1px;" src="' +
    base_url + '/images/'+user_connection_status+'"><div Style="width: 36px; height: 36px; margin-left: 1px; " class="fitimg fl u-pic user-avatar pull-left"><img class="user-img-' + one_user.id + '" src="' + base_url + image + '" alt="' + username + '"></div><div style="width:72%;" class="fl"><div style="width:100%;margin-top:-2px;" class="fl"><div class="fl" style="width:100%;"><div class="user-gift-' + one_user.id + '">'+icon+'</div><span style="margin-top: -8px; border-radius: 3px;" class="corner u-topic dots"><h5>'+ignore+'<span style="margin-top: 1px;padding: 2px 8px 0px 8px; border-radius: 3px; color:' + one_user.name_color + ';background-color:' + one_user.name_background + ';" class="dotsuser user-name user-name-' + one_user.id + '">' + username + '</span></h5></span></div></div><div style="width:100%;color:#888;" class="user-status-' + one_user.id + '">' + one_user.status + '</div></div> <label class="fl muted fa" style="color:indianred;">&nbsp;</label><img class="fr co" style="width:16px;border-radius:1px;" src="' + base_url + '/images/flags/' + one_user.country +
    '.png"></li>';

    var users_count = parseInt($('.room_count_' + one_user.room_id).html()) + 1;
    $('.room_count_' + one_user.room_id).html(users_count);
    $('#li_room_'+one_user.room_id).attr('data-registerd',users_count);

    if (user.room_id == "") {
      (one_user.type=='visitor')? $('.current_room_online_visitor').append(final): $('.current_room_online_user').append(final);
    }else {
      if (user.room_id == one_user.room_id) {
        (one_user.type=='visitor')? $('.current_room_online_visitor').append(final): $('.current_room_online_user').append(final);
      } else {
        (one_user.type=='visitor')? $('.other_room_online_visitor').append(final): $('.other_room_online_user').append(final);
      }
    }
  });
  sortRooms();
}

function sortRooms(){
  $("ul.room_update li").sort(sort_li).appendTo('ul.room_update');
  function sort_li(a, b) {
    return parseInt($(b).attr('data-registerd')) > parseInt($(a).attr('data-registerd'))? 1 :-1;
  }
}

function updateUserData(data) {
  all_users = data.users;
  userListOrder();
  if (data.user.id == user.id) {
    user=data.user;
  }
}

function fireNotification(data) {
  var user_data = "";
  if (data.user != undefined) {
    var name = (data.user.fake_name == "") ? data.user.username : data.user.fake_name;
    var gift = (data.user.gift == "") ? "" : '<img class="u-ico fl " style="max-height:18px;" src="' + base_url + "/images/gifts/" + data.user.gift + '">';
    var group_icon = (data.user.group.image == "")? "": '<span><img class="fl u-ico" src="'+base_url+'/images/gifts/'+data.user.group.image+'"></span>';
    var icon = (data.user.group_id==2)?gift:group_icon;

    var image = (data.user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + data.user.image;
    user_data = '<div class="fl borderg corner uzr" style="width:100%;"><img src="' + base_url + image + '" style="width:24px;height:24px;" class="corner borderg fl">'+icon+'<div style="max-width: 80%; color:#'+data.user.name_color+';background-color:#'+
    data.user.name_background + '"class="dots corner u-topic fl">' + name + ' </div></div>'
  }
  var alert = ' <div onclick="$(this).remove()" class="alert-div" style="min-width: 180px; max-width: 260px; border: 1px solid black; z-index: 10000; background-color: rgb(239, 239, 239); position: fixed; top: 30%; margin-right: 45%; padding: 5px;" class="hand corner  "><center><div class="corner border label label-primary" style="margin-top: -10px; padding-top: 10px; padding-left: 15px; width: 50%; padding-right: 15px; border-radius: 15px;">تنبيه</div></center>' + user_data +
  '<div style="width:100%;display:block;padding:0px 5px;" class="break fl">' + data.msg + '</div></div>';
  $('body').append(alert);
}


function hideUserModal() {
  $('#userModal').modal('hide');
}


function appendConversation(data) {
  var conv_user = (user.id == data.sender.id) ? data.receiver : data.sender;

  if ($.inArray(conv_user.id, ignore_users) != -1) {
    return false;
  }
  if ($('#private_chat').hasClass('displayPrivate') == true && $('.private_chat_data').attr('conversation-id') == data.conversation_id) {
    appendMessage(data);
  }

  if (data.chat.type == "text") {
    var message = data.chat.message;
  } else if (data.chat.type == "image") {
    var message = "صورة";
  } else if (data.chat.type == "audio") {
    var message = "صوت";
  } else if (data.chat.type == "video") {
    var message = "فيديو";
  }

  if ($('#conversation_' + data.conversation_id).length == 0) {
    // console.log(conv_user);
    // console.log(user);
    var name = (conv_user.fake_name == "") ? conv_user.username : conv_user.fake_name;
    var gift = (conv_user.gift == "") ? "" : '<img class="u-ico fl " style="max-height:18px;" src="' + base_url + "/images/gifts/" + conv_user.gift + '">';
    var group_icon = (conv_user.group.image == "")? "": '<span><img class="fl u-ico" src="'+base_url+'/images/gifts/'+conv_user.group.image+'"></span>';
    var icon = (conv_user.group_id==2)?gift:group_icon;
    if (conv_user.type == 'visitor' && conv_user.image == "") {
      var image = "/images/site/" + site_data.image;
    } else {
      var image = (conv_user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + conv_user.image;
    }

    var li_content = '<div class="hand nosel fl uzr border" onclick="slidedownConversation()" style="text-align: left; background-color: white; width: 76%; padding: 1px; border-radius: 0px !important; margin: 0px 1px -1px 2px !important; "><div class="user-avatar pull-left" ><img  src="' + image + '"class="userIMG user-img-' + conv_user.id + '"></div><div class="user-gift-' + conv_user.id + '"><div style="width:79%;" class="fl"><div style="width:100%;margin-top:-2px;" class="fl"><h5>' + icon + '<span class="dotscon user-name-' + conv_user.id + '" style="padding: 2px 8px 0px 8px; border-radius: 3px;color:' + conv_user.name_color + '; background-color:#' +
    conv_user.name_background + '">' + name + '</span></h5></div><p class="fl mini u-msg dots" style="width: 100%; color: #888; margin-top: -2px;" id="conversation_data_' + data.conversation_id + '" >' + message + '</p></div></div></div>';

    var final = '<li id="conversation_' + data.conversation_id + '" conversation-id="' + data.conversation_id + '" onclick="openConversation(' + data.conversation_id + ', ' + conv_user.id + ')" user-id="' + conv_user.id + '" class=" single-conversation text-left chat_visitor" style="cursor: pointer;" data-seen="0">' + li_content + '<div onclick="deleteConversation(' + data.conversation_id + ')"  style="padding-bottom:6%;margin-top:3px;margin-right:2px;" class="label border mini label-danger fr fa fa-times">حذف</div></li>';
    $('.conversations_chat').append(final);

  } else {
    $('#conversation_data_' + data.conversation_id).html(message);
  }

}

function privateChatAert(){
  conversations_count += 1;
  $('span.new_conversations').html(conversations_count);
  $('.conversations_a').attr('style', 'background-color:#fed766!important;');
}

function slidedownConversation(){
  $('#conversations').removeClass('slideshow');
}


function appendMessage(data) {
  var time_ago = '';
  if (data.chat.time == undefined) {
    var d = new Date();
    data.chat.time = d.getTime();
    time_ago ='<span style="margin-top:2px;padding:0px 2px;margin-left:-20px;margin-right:4px;color:grey" class="fr minix tago pull-right loaded_msg" ago="' + data.chat.time + '">الآن</span>';
  }else {
    time_ago ='<span style="margin-top:2px;padding:0px 2px;margin-left:-20px;margin-right:4px;color:grey" class="fr minix tago pull-right" ago="' + data.chat.time + '">'+calculateTimeAgo(data.chat.time)+'</span>';
  }
  var sender = data.sender;
  var name = (sender.fake_name == "") ? sender.username : sender.fake_name;
  var gift = (sender.gift == "") ? "" : '<img class="u-ico fl " style="max-height:18px;" src="' + base_url + "/images/gifts/" + sender.gift + '">';
  var image = (sender.image == "") ? "/images/site/" + site_data.image : "/images/users/" + sender.image;
  var group_icon = (sender.group.image == "")? "": '<span><img class="fl u-ico" src="'+base_url+'/images/gifts/'+sender.group.image+'"></span>';
  var icon = (sender.group_id==2)?gift:group_icon;
  var msg = "";
  if (data.chat.type == "image") {
    msg = "<button onclick='filePrivateBtn(" + data.chat.id + ")' file-id=" + data.chat.id + " class='btn-file-" + data.chat.id + " btn fa fa-image'>عرض الصوره</button> <a href='" + base_url + "/images/private_chat/" + data.chat.message + "' target='_blank' > <img style='display:none;max-width: 200px; max-height: 200px;' class='img-responsive chat-" + data.chat.id + "' src='" + base_url + "/images/private_chat/" + data.chat.message + "'></a>";
  } else if (data.chat.type == "video") {
    msg = "<button onclick='filePrivateBtn(" + data.chat.id + ")' file-id=" + data.chat.id + " class='btn-file-" + data.chat.id + " btn fa fa-youtube-play'>عرض الفيديو</button> <video class='chat-" + data.chat.id + "' style='display:none; max-height: 200px; ' controls><source src='"+ base_url + "/images/private_chat/" + data.chat.message + "' type='video/mp4'></video>";
  } else if (data.chat.type == "audio") {
    msg = "<button onclick='filePrivateBtn(" + data.chat.id + ")' file-id=" + data.chat.id + " class='btn-file-" + data.chat.id + " btn fa fa-youtube-play'>مقطع الصوت</button><audio class='chat-" + data.chat.id + "' style='display:none; width:240px; margin:0 auto;' controls><source src='" + base_url + "/images/private_chat/" + data.chat.message + "' type='audio/mpeg'></audio>";
  } else if (data.chat.type == "youtube") {
    msg = "<button onclick='filePrivateBtn(" + data.chat.id + ")' file-id=" + data.chat.id + " class='btn-file-" + data.chat.id + " youtube-btn btn fa fa-youtube'><img src='http://img.youtube.com/vi/" + data.chat.message + "/0.jpg' alt='[youtube]' style='width:80px;'/></button><iframe style='display:none;' class='chat-" + data.chat.id + "' src='https://www.youtube.com/embed/" + data.chat.message + "' frameborder='0' encrypted-media allowfullscreen></iframe>";
  } else {
    msg = data.chat.message;
  }
  var final = '<div class="uzr fl corner borderg mm single-chat-line text-left" style="border-radius:5px;margin-bottom:-2px;width:99.5%;padding:0px; background-color:white;" ><div class="user-avatar pull-left" style="padding-right:5px;"><img src="' + image + '" style="width: 36px; height: 38px; margin-left: 1px; margin-top: 1px;"></div><h5 class="single-user-panel" style="margin-top: 0px;"><div class="user-gift-' + sender.id + '">' + icon + '</div><span class="pull-left dots" style="padding: 2px 8px 0px 8px; border-radius: 3px;max-width:100%;color:' + sender.name_color + '; background-color:#' +
  sender.name_background + '">' + name + '</span>'+time_ago+'</h5><div class="uzr fl" style="padding: 0px; width:80%;"><p class=" u-msg   break  fl" style="margin-top: 1px; padding: 0px; width: 100%;color:' + sender.font_color + '">' + msg + '</div>';
  $('div.private_chat_data').append(final);
  $(".private_chat_data").animate({ scrollTop: $('.private_chat_data').prop("scrollHeight") }, 0);
  setCurrentTime();
}

function openConversation(id, user_id) {
  $('.private_chat_data').attr('conversation-id', id);
  $('.private_chat_data').html('');
  if (conversations[id] != undefined) {
    var conversation = conversations[id];
    if(conversation.length != 0){
          // console.log(conversation);
    var sender = conversation[conversation.length - 1].sender;
    var receiver = conversation[conversation.length - 1].receiver;
    if (user.id == sender.id) {
      chatModal(receiver);
    } else {
      chatModal(sender);
    }
    conversation.forEach(function(chat) {
      appendMessage(chat);
    });
	return;
    }
  }
  var chat_user = all_users.find(chat_user => chat_user.id == user_id);
  chatModal(chat_user);
}

function chatModal(chat_user) {
  // var chat_user = all_users.find(chat_user => chat_user.id == user_id);
  var name = (chat_user.fake_name == "") ? chat_user.username : chat_user.fake_name;
  if (chat_user.type == 'visitor' && chat_user.image == "") {
    var image = "/images/site/" + site_data.image;
  } else {
    var image = (chat_user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + chat_user.image;
  }
  var gift = (chat_user.gift == "") ? "" : '<img style="width:20px;height:20px;" src="' + base_url + "/images/gifts/" + chat_user.gift + '">';
  $('.private_chat_visitor').html(name);
  $('.user-imgs').html(gift);
  $('.user-imgs').html('<img style="width:20px;height:20px;" src="' + base_url + image + '">');
  $.get(base_url + '/user/' + chat_user.id, function(response, status) {
    if (response.chat == "no") {
      $('.private_chat_message').hide();
      $('.private_chat_data').html('<div class="clearfix"></div><br><div class="alert alert-danger">الخاص مغلق</div>');
    } else {
      var form = $(".private_chat_from");
      $('.private_chat_from input[name="to_id"]').remove();
      form.append('<input type="hidden" name="to_id" value="' + chat_user.id + '">');
    }
  });
}

function deleteConversation(id) {
  if (id == $('.private_chat_data').attr('conversation-id')) {
    $('#private_chat').removeClass('displayPrivate');
  }
  conversations[id] = [];
  $('#conversation_' + id).remove();
}

function incrementCount(column){
  $.post(base_url+'/increment/count', {
    column: column
  }, function(data) {
    return data.status;
  });
}

function ignoreUser(id){
  ignore_users.push(parseInt(id));
  $('.user-ignore-'+id).addClass('fa fa-ban');
  $('.li-ignore').html('<a style="color:crimson; cursor: pointer;" onclick="removeIgnore('+id +')"><i class="fa fa-check">إلغاء التجاهل</i></a>');
}

function removeIgnore(id){
  var index = ignore_users.indexOf(parseInt(id));
  if (index != -1) {
    ignore_users.splice(index, 1);
  }
  $('.user-ignore-'+id).removeClass('fa fa-ban');
  $('.li-ignore').html('<a style="color:crimson; cursor: pointer;" onclick="ignoreUser('+id +')"><i class="fa fa-ban">تجاهل</i></a>')
}

function sendAnnonce(){
  var message = prompt("اكتب نص الإعلان", "");
  if (message == "" || message == null) {
    return false;
  }
  if (message.trim() == "") {
    return false;
  }
  if (user.group.annonce_num <= user.annonce_count) {
    fireNotification({msg: 'لقد تعديت الحد الاقصي المسموح به يوميا .'});
    return false;
  }
  var response = incrementCount('annonce');
  if (response == 0) {
    fireNotification({msg: 'لقد تعديت الحد الاقصي المسموح به يوميا .'});
  }else{
    user.annonce_count += 1;
    $.post(base_url+'/filter/msg', {msg: message}, function(response){
      if (response.status == 0) {
        alert("عفوا تستخدم كلمات محظورة");
      }else{
        var data = {
          message: response.msg,
          user: user
        }
        socket.emit('sendAnnonce', data, function(response) {
          // console.log(response);
        });
        $('.annoce_content').val('');
      }
    });
  }
}
function abortRequest(){
  console.log("abort");
  xhr.abort();
  $('.update-bar').css('display','none');
  $('.update-name').empty();
}
