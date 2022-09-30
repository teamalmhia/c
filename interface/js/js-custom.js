// open emotions
$(".emo").on("click", function(e) {
    $("#emoWrapper").toggleClass("show");
});

$('.public_message').on("click", function(e) {
    $('#emoDiv').css('display', 'none');
});

$(".private_chat_emo").on("click", function(e) {
    if ($('#private_chat_emo_div').is(':visible')) {
        $("#private_chat_emo_div").css('display', 'none');
    } else {
        $("#private_chat_emo_div").css('display', 'block');
    }
});
// Close Emotions in private
$(document).click(function(e) {

    // Check if click was triggered on or within #menu_content
    if ($(e.target).closest(".private_emotions").length > 0 || $(e.target).closest(".private_chat_emo").length > 0) {
        return false;
    }
    $("#private_chat_emo_div").css('display', 'none');
});
$(".add_wall_emotion").on("click", function(e) {
    $("#emoDiv").removeClass('show');

});

$(".wallEmo").on("click", function(e) {
    $("#emoDiv").toggleClass("show");
});
// Close Emotions
$(document).click(function(e) {

    // Check if click was triggered on or within #menu_content
    if ($(e.target).closest("#emoDiv").length > 0) {
        return false;
    }

    if ($(e.target).closest(".emotions").length > 0) {
        return false;
    }

    // Otherwise
    $("#emoDiv").removeClass('show');
});


$(document).click(function(e) {

    // Check if click was triggered on or within #gift
    if ($(e.target).closest("#gift").length > 0) {
        return false;
    }
    if ($(e.target).closest(".gift-btn").length > 0) {
        return false;
    }




    // Otherwise
    $("#gift").css('display', 'none');
});
// open room users
$(".onlineTrigger").on("click", function(e) {
    $("#conversations").removeClass("slideshow");
    $("#rooms").removeClass("slideshow");
    $("#settings").removeClass("slideshow");
    $('.singleUserPanel').removeClass("slideshow");
    $('#public').removeClass("slideshow");
    $('#openUserCaht').val('0');
    $(".private_chat").removeClass("displayPrivate");
    $("#onlineUsers").toggleClass("slideshow");
});

// open conversations
$(".convsTrigger").on("click", function(e) {
    $('.convsTrigger').attr('style', 'background:#fed766;cursor: pointer;border-radius: 15px;');
    $("#rooms").removeClass("slideshow");
    $("#settings").removeClass("slideshow");
    $("#onlineUsers").removeClass("slideshow");
    $('.singleUserPanel').removeClass("slideshow");
    $('#public').removeClass("slideshow");
    $('#openUserCaht').val('0');
    $(".private_chat").removeClass("displayPrivate");
    $("#conversations").toggleClass("slideshow");
});

// open rooms
$(".roomsTrigger").on("click", function(e) {
    $("#settings").removeClass("slideshow");
    $("#onlineUsers").removeClass("slideshow");
    $("#conversations").removeClass("slideshow");
    $('.singleUserPanel').removeClass("slideshow");
    $('#public').removeClass("slideshow");
    $('#openUserCaht').val('0');
    $(".private_chat").removeClass("displayPrivate");
    $("#rooms").toggleClass("slideshow");
});

// open settings
$(".settingsTrigger").on("click", function(e) {
    $("#onlineUsers").removeClass("slideshow");
    $("#conversations").removeClass("slideshow");
    $("#rooms").removeClass("slideshow");
    $('.singleUserPanel').removeClass("slideshow");
    $('#public').removeClass("slideshow");
    $('#openUserCaht').val('0');
    $(".private_chat").removeClass("displayPrivate");
    $("#settings").toggleClass("slideshow");
});

// open settings
$(".publicTrigger").on("click", function(e) {
    $("#onlineUsers").removeClass("slideshow");
    $("#conversations").removeClass("slideshow");
    $("#rooms").removeClass("slideshow");
    $('.singleUserPanel').removeClass("slideshow");
    $("#settings").removeClass("slideshow");
    $('#openUserCaht').val('0');
    $(".private_chat").removeClass("displayPrivate");
    $('#public').toggleClass("slideshow");
});

$('.input_username').slideUp();

$('.edit_info_form').submit(function(e) {
    e.preventDefault();
    $.post(base_url + '/info', {
        font_size: $('.font_size').val(),
        name_color: $('.name_color').val(),
        name_background: $('.name_background').val(),
        font_color: $('.font_color').val(),
        fake_name: $('.fake_name').val(),
        status: $('.user_status').val(),
    }, function(data, status) {
        // console.log(data);
        if (data.status == 0) {
            alert('حدث خطأ في تعديل البيانات');
        } else {
            var user_data = all_users.find(user_data => user_data.id == data.user.id);
            data.user.room_id = user_data.room_id;
            socket.emit('updateUser', data.user, function(response) {
                // console.log(response);
            });
        }
    });
});

$('.font_size').on('change', function(e) {
    $.post(base_url + '/info', {
        font_size: $('.font_size').val(),
        name_color: $('.name_color').val(),
        name_background: $('.name_background').val(),
        font_color: $('.font_color').val(),
        fake_name: $('.fake_name').val(),
        status: $('.user_status').val(),
    }, function(data, status) {
        if (data.status == 0) {
            alert('حدث خطأ في تعديل البيانات');
        } else {
            $('body').css('zoom', data.user.font_size);
        }
    });
});


// submit chat form
function submitPrivate() {
    if ($('.private_chat_message').val() == "") {
        return false;
    }
    if (user.likes < site_data.private_likes) {
        $('.private_chat_message').val('');
        fireNotification({
            msg: 'المحادثات الخاصه تتطلب منك الحصول على ' + site_data.private_likes + 'إعجاب'
        });
        return false;
    }
    var reciever_user = all_users.find(reciever_user => reciever_user.id == $('input[name=to_id]').val());
    if (reciever_user == undefined || reciever_user == '') {
        return false;
    }
    if (reciever_user.disable_private == 1 && user.group.send_private == 0) {
        fireNotification({  msg: 'هذا المستخدم لا يقبل  محادثة خاصة الان'});
        return false;
    }
    var send_data = {
        from_id: $('input[name=from_id]').val(),
        to_id: $('input[name=to_id]').val(),
        message: $('.private_chat_message').val(),
        type: 'text'
    }
    $('.private_chat_message').val('');
    $.post(base_url + '/chat_private', send_data, function(data) {
        if (data.status == 0) {
            $('.private_chat_data').html('<div class="clearfix"></div><br><div class="alert alert-danger">لا يمكنك التحدث مع هذا العضو لانه مسوي لك حظر</div>');
        }
        if (data.status == 2) {
            $('.private_chat_data').html('<div class="clearfix"></div><br><div class="alert alert-danger">عفوا تستخدم كلمات محظورة</div>');
        } else {
            $('.private_chat_message').val('');
            $('.private_chat_image_file').val('');
            var receiver = all_users.find(receiver => receiver.id == data.chat.to_id);
            var chat_data = {
                chat: data.chat,
                conversation_id: data.conversation_id,
                sender: user,
                receiver: receiver
            };
            // console.log("conversation id: " + data.conversation_id);
            chat_data.user_id = data.chat.to_id;
            socket.emit('privateMsg', chat_data, function(response) {
                // console.log(response);
            });
        }
    });
}

// change info data
$('.edit_info li').click(function() {
    if ($(this).hasClass('remove_image')) {
        $.get(base_url + "/remove_image", function(data) {
            user.image = '';
            socket.emit('updateUser', user, function(response) {
                // console.log(response);
            });
        });
    }
    if ($(this).hasClass('change_image')) {
        $('.image_file').click();
    }
});

$('.image_file').change(function() {
    var form = $(".edit_info_form");
    var formData = new FormData(form[0]);
    $.ajax({
        url: base_url + '/update/image',
        type: 'POST',
        data: formData,
        async: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
        },
        success: function(data) {
            if (data.status == 0) {
                alert('حدث خطأ في تغيير الصورة')
            } else {
                if (data.user.image != "") {
                    $('.profile_pic').attr('src', base_url + "/images/users/" + data.user.image);
                }
                data.user.room_id = user.room_id;
                socket.emit('updateUser', data.user, function(response) {
                    // console.log(response);
                });
            }
        },
        error: function(data) {
            alert('ERRORS: ' + JSON.stringify(data));
        },
        crossDomain: true,
        cache: false,
        contentType: false,
        processData: false
    });
});

$('.gift-img').on('click', function() {
    if (user.group.gifts_num <= user.gifts_count) {
        fireNotification({
            msg: 'لقد تعديت الحد الاقصي المسموح به يوميا .'
        });
        return false;
    }
    $('.gifts-div').css('display', 'none');
    var post_data = {
        user_id: $(this).attr('user-id'),
        gift: $(this).attr('img-src'),
    };
    $.post(base_url + '/update/gift', post_data, function(data) {
        // console.log(data);
        if (data.status == 0) {
            fireNotification({
                msg: 'لقد تعديت الحد الاقصي المسموح به يوميا .'
            });
        } else {
            user.gifts_count += 1;
            var user_data = all_users.find(user_data => user_data.id == data.user.id);
            data.user.room_id = user_data.room_id;
            socket.emit('updateUser', data.user, function(response) {
                // console.log(response);
            });
            addLog('ارسال هديه', post_data.user_id, '');
        }
    });

});

function removeGift(element) {
    $('.gifts-div').css('display', 'none');
    var user_id = element.attr('user-id');
    $.get(base_url + '/remove/gift/' + user_id, function(data) {
        if (data.status == 1) {
            socket.emit('updateUser', data.user, function(response) {
                // console.log(response);
            });
            addLog('سحب الهديه', user_id, '');
        }
    });
}

$('.change_type').on('click', function() {
    $.post(base_url + '/update/type', {
        user_id: $(this).attr('user-id')
    }, function(data, status) {
        socket.emit('updateUser', data, function(response) {
            // console.log(response);
        });
    });
});

function logoutUser(id) {
    var logout_user = all_users.find(logout_user => logout_user.id == id);
    if (user.group.power < logout_user.group.power) {
        alert('لا يمكنك طرد رتبة اعلى ');
        return false;
    } else {
        logout_user.logout = 1;
        socket.emit('logoutUserAction', {
            user: user,
            logout_user: logout_user
        }, function(response) {
            hideUserModal();
        });
        addLog('طرد', id, '');
    }
}


function logout(id) {
    user.logout = 6;
    socket.emit('logoutUserAction', {
        user: user,
        logout_user: user
    }, function(response) {});
}


function banUser(id) {
    var ban_user = all_users.find(ban_user => ban_user.id == id);
    if (ban_user.group == undefined || ban_user.group == "") {
        ban_user.logout = 2;
        ban_user.group = groups.find(group => group.id == ban_user.group_id);
    }
    if (user.group.power < ban_user.group.power) {
        alert("لا يمكنك حظر سوبر اعلى");
        return false;
    } else {
        hideUserModal();
        socket.emit('banUserAction', {ban_user:ban_user, user:user}, function(response) {
            $.post(base_url + '/ban/user', {
                user_id: ban_user.id,
                device: ban_user.device
            }, function(data, status) {});
        });
        addLog('باند', id, '');
    }
}

$('body').on('click', 'a.remove_img', function() {
    hideUserModal();
    var user_data = all_users.find(user_data => user_data.id == $(this).attr('user-id'));
    if (user_data.group.power > user.group.power) {
      fireNotification({msg: 'لا يمكنك حذف صورة سوبر اعلى .'});
    }else {
      $.post(base_url + '/user/remove/img', {
        user_id: user_data.id
      }, function(data, status) {
        user_data.image = '';
        socket.emit('updateUser', user_data, function(response) {
          // console.log(response);
        });
        var notify = {
          msg: 'تم حذف صورتك الشخصية .',
          user_id: user_data.id,
          type: 'notification',
          user: user
        }
        socket.emit('alert', notify, function(response) {
          // console.log(response);
        });
        addLog(' حذف الصورة', user_data.id, '');
      });
    }
});

function changeFakeName(user_id) {
    $.post(base_url + '/update/fake_name', {
        user_id: user_id,
        fake_name: $('textarea.fake_name').val(),
    }, function(response, status) {
        var user_data = all_users.find(user_data => user_data.id == user_id);
        user_data.fake_name = $('textarea.fake_name').val();
        socket.emit('updateUser', user_data, function(response) {
            // console.log(response);
        });
        var data = {
            msg: 'تم تغيير الزخرفة .',
            user_id: user_id,
            type: 'notification',
            user: user
        }
        socket.emit('alert', data, function(response) {
            // console.log(response);
        });
        addLog('زخرفه', user_id, '');
    });
}

function showUserRecord(elem) {
    hideUserModal();
    $('.user-record').css('display', 'block');
    $.get(base_url + '/user/' + elem.attr('username') + '/record', function(response, status) {
        var final = "";
        response.record.forEach(record => {
            final += '<div class="u-div break light"><div class="borderg"><label class="label label-info">العضو<br></label><div">' + record.name + '</div><label class="label label-info">الزخرفه<br></label><div>' + record.fake_name + '</div><label class="label label-info">الآي بي<br></label><div>' + record.ip + '</div><label class="label label-info">الجهاز<br></label><div>' + record.device + '</div></div></div>'
        });
        $('.record-body').html(final);
    });
}

// add emotions
$('.add_emotion').click(function() {
    var code = $(this).attr('code');
    var message = $('.chat_message').val() + "ف" + code + " ";
    $('.chat_message').val(message);
    $('#emoWrapper').removeClass("show");
});

// add emotions
$('.add_wall_emotion').click(function() {
    var code = $(this).attr('code');
    var message = $('.public_message').val() + "ف" + code + " ";
    $('.public_message').val(message);
    $('#emoDiv').removeClass("show");
});

// add emotions
$('.add_private_chat_emotion').click(function() {
    var code = $(this).attr('code');
    var message = $('.private_chat_message').val() + "ف" + code + " ";
    $('.private_chat_message').val(message);
    $('#private_chat_emo_div').css('display', 'none');
});

// close all when chat
$('.chat_message').click(function() {
    $("#onlineUsers").removeClass("slideshow");
    $("#conversations").removeClass("slideshow");
    $("#rooms").removeClass("slideshow");
    $('.singleUserPanel').removeClass("slideshow");
    $("#settings").removeClass("slideshow");
    $('#public').removeClass("slideshow");
    $("#emoWrapper").removeClass("show");
    $('#openUserCaht').val('0');
});

$('.jscolor').change(function() {
    $("#settings").addClass("slideshow");
});

// open visitor details
$('body').on('click', '.single-user-panel', function() {
    var selected_user = all_users.find(elem => elem.id == $(this).attr('visitor_id'));
    userModal(selected_user);
});
$('body').on('click', '.single-user-close', function() {
    var id = $(this).attr('visitor_id');
    $("#singleUserPanel" + id).removeClass("slideshow");
    $('#openUserCaht').val(0);
    return false;
});

// ignore visitor
$('.ignore_button').click(function() {
    var ignore = $(this);
    var user_id = ignore.attr('visitor_id');
    var ignore_id = ignore.attr('ignore_id');
    if (ignore.is(':checked')) {
        var link = base_url + "/ignore?action=add&user_id=" + user_id + "&ignore_id=" + ignore_id;
    } else {
        var link = base_url + "/ignore?action=remove&user_id=" + user_id + "&ignore_id=" + ignore_id;
    }
    $.ajax({
        type: "GET",
        url: link
    });
});

// like visitor
function addLike(element) {
    var id = element.attr('user-id');
    var index = likes.indexOf(id);
    if (index == -1) {
        likes.push(id);
        var data = {
            msg: 'حصلت على اعجاب',
            type: 'like',
            user_id: id,
            user: user
        };
        socket.emit('alert', data, function(response) {
            // console.log(response);
        });
        $.ajax({
            type: "GET",
            url: base_url + "/add_like/" + id,
            success: function(data) {
              var likes = parseInt(data);
              if (likes > 999999999) {
                likes = 'le+'+ parseInt(likes/999999999);
              }
              $('.likes_number').html(likes)
              element.removeClass('add_like');
            }
        });
        setTimeout(function() {
            likes.splice(index, 1);
        }, 60 * 1000);
    } else {
        fireNotification({
            msg: 'يمكنك ارسال إعجاب مره واحده في الدقيقه'
        });
    }
}

socket.on('appendAlert', function(data) {
    if (data.type == 'notification' && $.inArray(data.user.id, ignore_users) != -1) {
        return false;
    }
    if (data.user_id == user.id) {
        if (data.type == 'like') {
            user.likes += 1;
        }
        fireNotification(data);
    }
});

// open chat with visitor
$('body').on('click', '.chat_visitor', function() {
    var user_id = $(this).attr('user-id');
    $.get(base_url + '/check_conversation/' + user.id + '/' + user_id, function(conversation_id) {
        $('#userModal').modal('hide');
        $(".private_chat").addClass("displayPrivate");
        $('.private_chat_data').attr('conversation-id', conversation_id);
        openConversation(conversation_id, user_id);
    });

});

// open upload image for chat
$('.private_chat_upload').click(function() {
    $('.private_chat_image_file').click();
});

// chat with visitor
$('.private_chat_from').submit(function(e) {
    e.preventDefault();
    submitPrivate();
});
$('.private_chat_send').click(function() {
    submitPrivate();
});
var fileName;
$('.private_chat_image_file').change(function(e) {
    fileName = e.target.files[0].name;
    if (user.likes < site_data.upload_likes) {
        fireNotification({
            msg: 'إرسال الملفات يتطلب منك الحصول على ' + site_data.upload_likes + 'إعجاب'
        });
        return false;
    }
    var form = $(".private_chat_from");
    var formData = new FormData(form[0]);
    var reciever_user = all_users.find(reciever_user => reciever_user.id == $('input[name=to_id]').val());
    if (reciever_user.disable_private == 1 && user.group.notification == 0) {
        fireNotification({
            msg: 'هذا المستخدم لا يقبل  محادثة خاصة الان'
        });
        return false;
    }
    $('.private_chat_message').val('');

    $('.private_chat_image_file').val('');


    $.ajax({
      xhr: function() {
        xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete =parseInt(evt.loaded / evt.total * 100);
            //Do something with upload progress
            $('.update-status').html('%'+percentComplete);
          }
        }, false);
        return xhr;
      },
      beforeSend: function() {
        var progress_bar = '<p>' + fileName + '</p>';
        $('.update-bar').css('display','flex');
        $('.update-name').append(progress_bar);
      },
      url: form.attr('action'),
      type: 'POST',
      data: formData,
      async: true,
      success: function(data) {
        if (data.status == 0) {
          $('.private_chat_data').html('<div class="clearfix"></div><br><div class="alert alert-danger">لا يمكنك التحدث مع هذا العضو لانه مسوي لك حظر</div>');
        }
        if (data.status == 2) {
          $('.private_chat_data').html('<div class="clearfix"></div><br><div class="alert alert-danger">عفوا تستخدم كلمات محظورة</div>');
        } else {
          var receiver = all_users.find(receiver => receiver.id == data.chat.to_id);
          var chat_data = {
            chat: data.chat,
            conversation_id: data.conversation_id,
            sender: user,
            receiver: receiver
          };

          chat_data.user_id = data.chat.to_id;
          socket.emit('privateMsg', chat_data, function(response) {
            // console.log(response);
          });
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("Error: " + errorThrown);
      },
      complete: function(){
        $('.update-bar').css('display','none');
        $('.update-name').empty();
      },
      cache: false,
      contentType: false,
      processData: false
    });
});

// click image in public wall
$('.upload').click(function() {
    var type = $(this).attr('player');
    $('.public_image').click();
    $('.public_image').attr('file_type', type);
});


$('.private_chat_status').change(function() {
    var input = $(this);
    $.post(base_url + '/disable/private', {
            'status': input.val()
        },
        function(response, status) {
            input.val(response.chat);
        });
});


function fileBtn(id) {
    $('.btn-file-' + id).css('display', 'none');
    $('.post-' + id).css('display', 'block');
}

function videoBtn(element) {
    var id = element.attr('file-id');
    var video_id = element.attr('video-id');
    $('.btn-file-' + id).css('display', 'none');
    var url = "https://www.youtube.com/embed/" + video_id;
    $('.post-' + id).attr('src', url);
    $('.post-' + id).css('display', 'block');
}

function filePrivateBtn(type, id) {
    $('.btn-file-' + id).css('display', 'none');
    $('.chat-' + id).css({
        'display':'block',
        'max-width':'80%'});
}

function displayGift(user_id) {
    var selected_user = all_users.find(selected_user => selected_user.id == user_id);
    if (selected_user.type == 'admin' || selected_user.group_id != 2) {
        hideUserModal();
        fireNotification({
            msg: 'لا يمكن ارسال هديه للسوابر '
        });
    } else {
        $('.gift-img').attr('user-id', user_id);
        $('.remove-gift').attr('user-id', user_id);
        $('#gift').css('display', 'block');
    }
}

function sendAlert(elem) {
    var reciever_user = all_users.find(reciever_user => reciever_user.id == elem.attr('user-id'));
    if (reciever_user.disable_notify == 1 && user.group.notification == 0) {
        fireNotification({
            msg: 'هذا المستخدم لا يقبل التنبيهات حاليآ '
        });
        return false;
    }
    if (user.likes < site_data.notification_likes) {
        fireNotification({
            msg: 'التنبيهات تتطلب منك الحصول على ' + site_data.notification_likes + 'إعجاب'
        });
        return false;
    }
    var notification = prompt("اكتب رسالتك ", "");
    if (notification == "" || notification == null) {
        return false;
    }
    if (notification.trim() == "") {
        return false;
    }
    $.post(base_url + '/filter/msg', {
        msg: notification
    }, function(response) {
        if (response.status == 0) {
            alert("عفوا تستخدم كلمات محظورة");
        } else {
            var data = {
                msg: response.msg,
                user_id: reciever_user.id,
                type: 'notification',
                user: user
            }
            socket.emit('alert', data, function(response) {
                // console.log(response);
            });
        }
    });

}

function manageRoom(user_id) {
    hideUserModal();
    $.post(base_url + '/manage/room', {
        user_id: user_id,
        room_id: user.room_id,
    }, function(data, status) {
        alert("تم ترقيه العضو ");
        var user_data = all_users.find(user_data => user_data.id == user_id);
        data.room_id = user_data.room_id;
        socket.emit('updateUser', data, function(response) {
            // console.log(response);
        });
        addLog('ترقية الي مراقب ', user_id, '');
    });
}

function changeGroup(user_id) {
    var group = groups.find(group => group.id == parseInt($('.user-group').val()));
    var user_data = {
        user_id: user_id,
        group_id: group.id,
        group_period: $('.user-group-period').val(),
    };
    $.post(base_url + '/user/change/group', user_data, function(data) {
        if (data.status == 0) {fireNotification({'msg': data.msg});
        } else {
            // console.log(data);
            hideUserModal();
            var user_data = all_users.find(user_data => user_data.id == data.user.id);
            data.user.room_id = user_data.room_id;
            socket.emit('updateUser', data.user, function(response) {
                // console.log(response);
            });
            addLog('تعديل صلاحيه', user_id, group.name);
        }
    });
}


$(document).ready(function() {
    setInterval(function(){
      $('span.tago').each(function(i, obj) {
        var time_ago = calculateTimeAgo(parseInt($(this).attr('ago')));
          $(this).html(time_ago);
      });
    }, 10000);

    var time = $('#chat_time').val();
    if (time == 0) {
        time = 3000;
    } else {
        time = time * 1000;
    }
    setInterval(function() {
        // return updateWall();
    }, time);
});

$('.wall').click(function() {
    wall_count = 0;
    $('span.new_posts').html('');
    $('.line-bottom ul li a').css('background-color', '#8F2F8C!important');
});

$('.conversations').click(function() {
    conversations_count = 0;
    $('li.single-conversation').attr('data-seen', 0);
    $('span.new_conversations').html('');
    $('.line-bottom ul li a').css('background-color', '#8F2F8C!important');
});

// append message to room chat view
socket.on('appendRoomMsg', function(data) {
    if (disable_msgs == 0) {
        if (user.room_id == data.room_id || data.room_id == 'all') {
            var check_msg = (data.type !== undefined && (data.type == 'change_room' || data.type == 'login_user' || data.type=='out_user')) ? "hmsg" : "";
            if (data.type == 'login_user') {
                fireRoomMessage(data, check_msg);
            } else {
                if (show_enter_msg == 1) {
                    fireRoomMessage(data, check_msg);
                }
            }
        }
    }
    if (data.type !== undefined) {
        var index = all_users.findIndex(elem => elem.id == data.user.id);
        all_users[index] = data.user;
        if (data.type == 'change_room') {
            if (user.room_id == data.new_room_id && disable_msgs == 0 && data.new_room_msg != undefined) {
                data.message = data.new_room_msg;
                fireRoomMessage(data, "hmsg");
            }
        }
        if (data.type == 'out_room' && data.user.id == user.id) {
            user.room_id = "";
            out_rooms.push(parseInt(data.room_id));
            fireNotification({
                msg: 'تم طردك من الغرفة'
            });
            $('li.active').removeClass('active');
            $('.chat_message').css('background-color', 'lightgray');
        }
        userListOrder();
    }
    updateRoomChatScroll();
    removeRoomChatElement();
});

function fireRoomMessage(data, class_name = "") {
    var d = new Date();
    var n = d.getTime();
    var name = (data.user.fake_name == "") ? data.user.username : data.user.fake_name;
    var image = (data.user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + data.user.image;
    var gift = (data.user.gift == "") ? "" : '<img class="fl u-ico" src="' + base_url + "/images/gifts/" + data.user.gift + '">';
    var group_icon = (data.user.group.image == "") ? "" : '<span><img class="fl u-ico" src="' + base_url + '/images/gifts/' + data.user.group.image + '"></span>';
    var icon = (data.user.group_id == 2) ? gift : group_icon;
    var final = '<li class="single-chat-line text-left ' + class_name + ' room_msg" style="direction:ltr; cursor: pointer; border-bottom: 2px;"><div style="border: 1px solid #cacaca;" class="user-avatar pull-left"><a class="single-user-panel" visitor_id="' + data.user.id + '"><img src="' + base_url + image + '" class="userIMG"></a></div><h5 class="" visitor_id="' + data.user.id + '">' + icon + '<span class="dots" style="padding: 2px 8px 0px 8px; border-radius: 3px; color:#' + data.user.name_color + '; background:#' +
        data.user.name_background + '">' + name + '<span></span></span><span style="margin-top:2px;padding:0px 2px;margin-left:-20px;margin-right:4px;color:grey" class="fr minix tago" ago="' + n + '">الآن</span></h5><p style="font-size: 12px;color: #' + data.user.font_color + '">' + data.message + '</p></li>';
    $('.room_wall').append(final);
}

socket.on('appendIconUI', function(data) {
    // console.log(data);
    if (data.type == 'emotion') {
        $('ul.rooms_emotions').append('<li class="emo-' + data.icon.id + '"><a style="cursor: pointer;" class="add_emotion " code="' + data.icon.id + '"><img src="' + base_url + '/images/emotions/' + data.icon.image + '"></a></li>');
        $('ul.private_emotions').append('<li class="emo-' + data.icon.id + '"><a style="cursor: pointer;" class="add_emotion " code="' + data.icon.id + '"><img src="' + base_url + '/images/emotions/' + data.icon.image + '"></a></li>');
        $('#emoDiv').append('<a style="cursor: pointer;" class="add_wall_emotion emo-' + data.icon.id + '" code="' + data.icon.id + '"><img src="' + base_url + '/images/emotions/' + data.icon.image + '"></a>');
    }
    if (data.type == 'gift') {
        $('.gifts-icons').append('<img style="padding:5px;margin:4px;" class="btn hand borderg corner gift-img gift-' + data.icon.id + '" src="' + base_url + '/images/emotions/' + data.icon.image + '" user-id="" img-src="' + data.icon.image + '">');
    }
});

socket.on('removeIconUI', function(data) {
    // console.log(data);
    if (data.type == 'emotion') {
        $('.emo-' + data.id).remove();
    }
    if (data.type == 'gift') {
        $('.gift-' + data.id).remove();
    }
});

socket.on('updateSiteDataElem', function(data) {
    site_data = data;
});


// append message to room chat view
socket.on('appendAnnonce', function(data) {
    var d = new Date();
    var n = d.getTime();
    var name = (data.user.fake_name == "") ? data.user.username : data.user.fake_name;
    var image = (data.user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + data.user.image;
    var gift = (data.user.gift == "") ? "" : '<img class="fl u-ico" src="' + base_url + "/images/gifts/" + data.user.gift + '">';
    var group_icon = (data.user.group.image == "") ? "" : '<span><img class="fl u-ico" src="' + base_url + '/images/gifts/' + data.user.group.image + '"></span>';
    var icon = (data.user.group_id == 2) ? gift : group_icon;
    var final = '<li class="single-chat-line text-left pmsgc room_msg" style="direction:ltr; cursor: pointer; border-bottom: 2px;"><div class="user-avatar pull-left" style="border: 1px solid #cacaca;"><a class="single-user-panel" visitor_id="' + data.user.id + '"><img src="' + base_url + image + '" class="userIMG"></a></div><h5 class="" visitor_id="' + data.user.id + '">' + icon + '<span class="dots" style="padding: 2px 8px 0px 8px; border-radius: 3px; color:#' + data.user.name_color + '; background:#' +
        data.user.name_background + '">' + name + '<span></span></span><span style="margin-top:2px;padding:0px 2px;margin-left:-20px;margin-right:4px;color:grey" class="fr minix tago" ago="' + n + '">الآن</span></h5><p style="font-size: 12px;"><label style="margin-top:2px;color:blue" class="fl nosel fa fa-commenting">إعلان</label>' + data.message + '</p></li>'
    $('.room_wall').append(final);
    updateRoomChatScroll();
    removeRoomChatElement();
});

socket.on('updateGroup', function(group) {
    var index = groups.findIndex(select_group => select_group.id == group.id);
    if (index == -1) {
        groups.push(group);
    } else {
        groups[index] = group;
        if (user.group_id == group.id) {
            updateUserGroup(group);
        }
    }
});

socket.on('deleteGroupElem', function(data) {
    var index = groups.findIndex(select_group => select_group.id == data.deleted_group.id);
    if (index != -1) {
        groups.splice(index, 1);
        if (user.group_id == data.deleted_group.id) {
            updateUserGroup(data.default_group);
        }
    }
});


function updateUserGroup(group) {
    user.group_id = group.id;
    user.group = group;
    if (user.type == "admin" || user.room_mange == user.room_id || user.group.manage_room == 1) {
        $('li.manage_room').css('display', 'block');
    } else {
        $('li.manage_room').css('display', 'none');
    }

    if (user.type == "admin" || user.group.cp == 1) {
        $('li.cp').css('display', 'block');
    } else {
        $('li.cp').css('display', 'none');
    }

    if (user.type == "admin" || user.group.annonce_num > 0) {
        $('li.li_annoncement').css('display', 'block');
    } else {
        $('li.li_annoncement').css('display', 'none');
    }

    if (user.type == "admin" || user.group.delete_wall == 1) {
        $('button.delete_wall').css('display', 'block');
    } else {
        $('button.delete_wall').css('display', 'none');
    }

    if (user.type == "admin" || user.group.manage_room == 1) {
        $('.add_room').css('display', 'block');
    } else {
        $('.add_room').css('display', 'none');
    }
}

// Private chat settings btn
if ($('.private_chat_status').is(':checked')) {
    $('.private_chat_status_check').show();
} else {
    $('.private_chat_status_check').hide();

}

// Private chat settings btn
if ($('.notify').is(':checked')) {
    $('.notify_check').show();
} else {
    $('.notify_check').hide();

}

$('#private_chat_status_btn').click(function() {
    if ($('.private_chat_status').is(':checked')) {
        $('.private_chat_status_check').show();
        $('.private_chat_status').prop('checked', false);
        user.disable_private = 1;
    } else {
        $('.private_chat_status_check').hide();
        $('.private_chat_status').prop('checked', true);
        user.disable_private = 2;
    }
    socket.emit('updateUser', user, function(response) {
        // console.log(response);
    });
});

$('#notify_btn').click(function() {
    // console.log($('.notify').val());
    if ($('.notify').is(':checked')) {
        $('.notify_check').show();
        $('.notify').prop('checked', false);
        user.disable_notify = 1;
    } else {
        $('.notify_check').hide();
        $('.notify').prop('checked', true);
        user.disable_notify = 0;
    }
    socket.emit('updateUser', user, function(response) {
        // console.log(response);
    });
});

socket.on('removeUserdata', function(removed_user) {
    $.get(base_url + "/check_conversation/" + removed_user.id + "/" + user.id, function(conversation_id) {
        deleteConversation(conversation_id)
    });
});

$('#usearch').keyup(function() {
    var filter = this.value.toUpperCase();
    var li = $('.all_users_visitors li');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByClassName("user-name")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }

});

function isOnline(no, yes) {
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');
    xhr.onload = function() {
        if (yes instanceof Function) {
            yes();
        }
    }
    xhr.onerror = function() {
        if (no instanceof Function) {
            no();
        }
    }
    xhr.open("GET", base_url + '/connection/test', true);
    xhr.send();
}


setInterval(function() {
    isOnline(
        function() {
            user.logout = 1;
            window.location.replace(base_url);
        },
        function() {
            // alert("Succesfully connected!");
        }
    );
}, 3000);
