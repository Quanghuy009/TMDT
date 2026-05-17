package TMDT.store.controller.user;

import TMDT.store.dto.response.BannerResponse;
import TMDT.store.service.BannerService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<BannerResponse> getBanners() {

        return bannerService.getActiveBanners();
    }
}
