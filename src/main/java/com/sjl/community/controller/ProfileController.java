package com.sjl.community.controller;

import com.sjl.community.dto.NotificationDto;
import com.sjl.community.dto.PaginationDto;
import com.sjl.community.dto.QuestionDto;
import com.sjl.community.dto.QuestionQueryDto;
import com.sjl.community.model.User;
import com.sjl.community.service.NotificationService;
import com.sjl.community.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

/**
 * @author song
 * @create 2020/2/18 15:39
 */
@Controller
public class ProfileController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/profile/{section}")
    public String profile(@PathVariable("section") String section,
                          Model model,
                          HttpServletRequest request,
                          @RequestParam(value = "pageNum", defaultValue = "1", required = false) Integer pageNum,
                          @RequestParam(value = "pageSize", defaultValue = "8", required = false) Integer pageSize) {

        //从session中获取user
        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            return "redirect:/";
        }

        if ("questions".equals(section)) {
            model.addAttribute("section", "questions");
            model.addAttribute("sectionName", "我的提问");
            //查询当前用户的问题列表
            QuestionQueryDto queryDto = new QuestionQueryDto();
            queryDto.setPageNum(pageNum);
            queryDto.setPageSize(pageSize);
            queryDto.setCreatorId(user.getId());
            PaginationDto<QuestionDto> pageInfo = questionService.findByCondition(queryDto);
            model.addAttribute("pageInfo", pageInfo);
        } else if ("replies".equals(section)) {
            model.addAttribute("section", "replies");
            model.addAttribute("sectionName", "最新回复");
            //获取分页通知信息
            PaginationDto<NotificationDto> pageInfo = notificationService.findByReceiverId(pageNum, pageSize, user.getId());
            model.addAttribute("pageInfo", pageInfo);
        }
        return "profile";
    }
}
