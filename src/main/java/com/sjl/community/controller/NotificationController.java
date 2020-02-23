package com.sjl.community.controller;

import com.sjl.community.dto.NotificationDto;
import com.sjl.community.enums.NotificationStatusEnum;
import com.sjl.community.enums.NotificationTypeEnum;
import com.sjl.community.exception.CustomizeErrorCode;
import com.sjl.community.exception.CustomizeException;
import com.sjl.community.model.Notification;
import com.sjl.community.model.User;
import com.sjl.community.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletRequest;

/**
 * @author song
 * @create 2020/2/23 20:18
 */
@Controller
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/notification/{id}")
    public String readNotify(@PathVariable("id") Long id, HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        if(user == null){
            throw new CustomizeException(CustomizeErrorCode.USER_NOT_LOGIN);
        }
        Notification notification = this.notificationService.read(id, user);
        if(NotificationTypeEnum.REPLY_COMMENT.getType() == notification.getType() ||
        NotificationTypeEnum.REPLY_QUESTION.getType() == notification.getType()){
            return "redirect:/question/" + notification.getTargetId();
        }else{
            return "redirect:/";
        }
    }
}
