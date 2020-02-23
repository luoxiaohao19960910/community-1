/*获取源码未登录提示*/
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

/*根据传递的类型提交评论*/
function submit_comment_by_type(parent_id, type, content) {
    if (!content) {
        alert("不能输入空的内容哦~");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/comment",
        contentType: "application/json",
        data: JSON.stringify({
            "parentId": parent_id,
            "content": content,
            "type": type
        }),
        dataType: "json",
        success: function (result) {
            if (result.code === 2000) {
                window.location.reload();
                $("#comment_frame").hide();
            } else {
                if (result.code === 2004) {
                    const confirm = window.confirm(result.message);
                    if (confirm) {
                        window.open("https://github.com/login/oauth/authorize?client_id=aeb0d5116950de9541ab&redirect_uri=http://localhost:8887/callback&scope=user&state=1");
                        localStorage.setItem('closable', '1');//0：不关闭 1：关闭
                    }
                } else {
                    alert(result.message);
                }
            }
        }
    });
}

/*提交问题的评论*/
function submit_question_comment() {
    const id = $("#question_parent_id").val();
    const content = $("#question_comment_content").val();
    submit_comment_by_type(id, 1, content);
}

/*提交回复的评论*/
function submit_comment_comment(e) {
    const id = e.getAttribute("data-id");//获得回复的id
    const content = $("#input-" + id).val();//根据id获得评论内容
    submit_comment_by_type(id, 2, content);
}

/*显示或收起回复的评论*/
function show_or_close_subComment(e) {
    const id = e.getAttribute("data-id");//获取评论id
    $('#sub_comment_btn-' + id).toggleClass("active");
    var subCommentContainer = $('#comment-' + id);
    subCommentContainer.toggleClass("in");

    if(subCommentContainer.hasClass("in") && subCommentContainer.children().length === 1){
        $.getJSON("/comment/" + id, function (data) {
            $.each(data.data.reverse(), function (index, comment) {
                var mediaLeftElement = $("<div/>", {
                    "class": "media-left"
                }).append($("<a/>", {
                    "href": "#"
                })).append($("<img/>", {
                    "class": "media-object img-rounded user_avatar",
                    "src": comment.user.avatarUrl == null ? '' : comment.user.avatarUrl
                }));

                var mediaBodyElement = $("<div/>", {
                    "class": "media-body"
                }).append($("<span/>", {
                    "class": "media-heading question_text",
                    "html": comment.user.name
                })).append($("<br/>")).append($("<span/>", {
                    "html": comment.content
                }));

                var mediaElement = $("<div/>", {
                    "class": "media"
                }).append(mediaLeftElement).append(mediaBodyElement);

                var operatingElement = $("<div/>", {
                    "class": "comment_operating"
                }).append($("<span/>", {
                    "class": "glyphicon glyphicon-thumbs-up btn"
                })).append($("<span/>", {
                    "class": "question_text time",
                    "html": moment(comment.gmtCreate).format('YYYY-MM-DD')
                }));

                var lineElement = $("<hr/>", {
                    "class" : "comment_cut_line"
                });

                var commentElement = $("<div/>")
                    .append(mediaElement)
                    .append(operatingElement)
                    .append(lineElement);

                subCommentContainer.prepend(commentElement);
            });
        });
    }
}

let count = 0;//选择的标签数
/*添加标签*/
function selectTag(e) {
    const value = e.getAttribute("data-tag");//获取标签的值
    const previous = $("#tags_input").val();//获取输入框的值
    //防止字串干扰
    let arr = previous.split(',');
    if(arr.indexOf(value) === -1 ){
        if(++count > 5){
            alert("最多选择5个标签");
            return;
        }
        $('#all-'+value).addClass("publish-tag-selected");
        if(previous){
            $("#tags_input").val(previous+ ',' +value);
        }else{
            $("#tags_input").val(value);
        }
    }else{
        alert('不要再点啦，我已经选过了')
    }
}
/*删除标签*/
function deleteTag(e) {
    const removeValue = e.getAttribute("data-tag");//获取待删除的值
    const previous = $("#tags_input").val();//获取输入框的值
    //防止字串干扰
    let arr = previous.split(',');
    if(arr.indexOf(removeValue) > -1){
        for(let i = 0; i < arr.length; i++){
            if(arr[i] === removeValue){
                arr.splice(i, 1);
                $('#all-'+removeValue).removeClass("publish-tag-selected");
                count--;
                break;
            }
        }
        $("#tags_input").val(arr.join(','));
    }else{
        alert('不要再点啦，我还没被选呢');
    }
}

function showSelectTag() {
    $("#tag-list").show();
}
function closeSelectTag() {
    $("#tag-list").hide();
}