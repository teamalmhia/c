// send connected user message


//update user data
socket.on('findUser', function(data){
  updateUserData(data);
  var user_data = data.user;
  var name = (user_data.fake_name=="")?user_data.username:user_data.fake_name;
  var image =  (user_data.image=="")? "/images/site/" + site_data.image : "/images/users/"+user_data.image;
  var gift =  (user_data.gift=="")? "": base_url+"/images/gifts/"+user_data.gift;
  if (user_data.group == undefined || user_data.group=="") {
    user_data.group = groups.find(group=> group.id == user_data.group_id);
  }
  var group_icon = (user_data.group.image == "")? "": base_url+'/images/gifts/'+user_data.group.image;
  var icon = (user_data.group_id==2)?gift:group_icon;
  var user_connection_status = 's0.png';
  if (user_data.holding == 1) {
    user_connection_status = 's1.png';
  }
  if (user_data.disable_private == 1) {
    user_connection_status = 's2.png';
  }
  if (icon !== "") {
    $('div.user-gift-'+user_data.id).empty().append('<img class="fl u-ico" src="'+icon+'">');
  }
  $('.user-img-'+user_data.id).attr('src', base_url+image);
  $('.user-connection-'+user_data.id).attr('src', base_url+'/images/'+user_connection_status);
  $('.user-name-'+user_data.id).html(name);
  $('.user-name-'+user_data.id).addClass('user-name');
  $('.user-name-'+user_data.id).css('background-color', '#'+user_data.name_background);
  $('.user-name-'+user_data.id).css('color', '#'+user_data.name_color);
  $('.user-status-'+user_data.id).html(user_data.status);
  if (user_data.id == user.id) {
    $('.fake_name').val(name);
    $('#profile-pic').attr('src',base_url+ image);
    updateUserGroup(user_data.group);
  }
});

//logout user
socket.on('logoutUser', function(data){
  if (data.logout_user.id == user.id) {
    user.logout = data.logout_user.logout;
    var msg = "";
    if (data.logout_user.logout == 1) {
      msg = "تم طردك من الشات";
      // document.cookie ="msg= تم طردك من الشات;";
    }
    if (data.logout_user.logout == 5) {
      msg = "تم حذف عضويتك" ;
      // document.cookie ="msg= تم حذف عضويتك ;";
    }
    disable_msgs = 1;
    if (msg != "") {
      data.msg = msg;
      fireNotification(data);
    }
    socket.emit('reload', {logout_user: data.logout_user}, function(response){});
    var time = (data.logout_user.logout==6)? 0:2;
    setTimeout( function(){
      window.location.replace(base_url);
    }, time*1000 );
  }
});

socket.on('reconnect', function(logout_user){
  if (logout_user.id == user.id) {
    user.logout = 4;
    document.cookie ="msg= تم طردك من الشات;";
    window.location.replace(base_url);
  }
});

//user conversations
socket.on('displayConversation', function(data){
  if ($.inArray(parseInt(data.chat.from_id), ignore_users) != -1) {
    return false;
  }
  if (parseInt(data.chat.to_id) == user.id || parseInt(data.chat.from_id) == user.id) {
    if (conversations[data.conversation_id] == undefined) {
      conversations[data.conversation_id] = [data];
    } else {
      conversations[data.conversation_id].push(data);
    }
    appendConversation(data);
  }
  if (parseInt(data.chat.to_id) == user.id && parseInt(data.chat.from_id) != user.id) {
    data.user_id = data.chat.from_id;
    if (!$('#conversations').hasClass('slideshow') && $('#conversation_'+data.conversation_id).attr('data-seen')==0) {
      if (!$('#private_chat').hasClass('displayPrivate')) {
        $('#conversation_'+data.conversation_id).attr('data-seen',1);
        privateChatAert();
      }
      if ($('#private_chat').hasClass('displayPrivate') && $('.private_chat_data').attr('conversation-id') != data.conversation_id) {
        $('#conversation_'+data.conversation_id).attr('data-seen',1);
        privateChatAert();
      }
    }
  }
});

//disconnecteduser
socket.on('userDisconnected', function(data){
  var index = all_users.findIndex(elem => elem.id == data.user.id);
  if (index != -1) {
    all_users.splice(index, 1);
  }
  userListOrder();
});

socket.on('removeUserRooms', function(data){
  var user_rooms = rooms.filter(obj => {
    return obj.owner == data.user.username;
  });
  for (var i = 0; i < user_rooms.length; i++) {
    if ( user_rooms[i]['active'] == 'no') {
      delete_room(user_rooms[i]['id']);
    }
  }
});

//ban user
socket.on('banUser', function(data){
  if (data.ban_user.id == user.id) {
    user.logout = 2;
    socket.emit('reload', {logout_user: user}, function(response){});
    data.msg = 'تم حظرك من الشات ';
    fireNotification(data);
    setTimeout( function(){
      window.location.replace(base_url);
    }, 2000 );
  }
});

//create for every connect user modal
socket.on('appendUser', function(data){
  all_users=data.users;
  userListOrder();
});

socket.on('allUser', function(data){
  all_users = data;
  userListOrder(all_users);
});


var IDLE_TIMEOUT = 60*3; //seconds
var _idleSecondsCounter = 0;
document.onclick = function() {
    _idleSecondsCounter = 0;
    checkHolding();
};
document.onmousemove = function() {
    _idleSecondsCounter = 0;
    checkHolding();
};
document.onkeypress = function() {
    _idleSecondsCounter = 0;
    checkHolding();
};
window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
    _idleSecondsCounter++;
    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
      holdUser();
    }
}

function checkHolding(){
  if (user.holding == 1) {
    user.holding = 0;
    socket.emit('updateUser', user, function(response) {
      // console.log(response);
    });
  }
}

function holdUser(){
  if (user.holding == 0) {
    user.holding = 1;
    socket.emit('updateUser', user, function(response) {
      // console.log(response);
    });
  }
}
