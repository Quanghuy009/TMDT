package TMDT.store.controller.user;

import TMDT.store.service.HomepageSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/homepage-sections")
@RequiredArgsConstructor
public class HomepageSectionController {

    private final HomepageSectionService homepageSectionService;

    @GetMapping
    public Map<String, Boolean> getSectionStatusMap() {
        return homepageSectionService.getSectionStatusMap();
    }
}