package TMDT.store.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "redirect:/pages/index.html";
    }

    @GetMapping("/category")
    public String category(@RequestParam String type) {
        return "redirect:/pages/product-category.html?type=" + type;
    }
}