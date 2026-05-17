package TMDT.store.controller.user;

import TMDT.store.dto.response.FlashSaleResponse;
import TMDT.store.service.FlashSaleService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flash-sale")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    @GetMapping("/current")
    public FlashSaleResponse getCurrentFlashSale() {
        return flashSaleService.getCurrentFlashSale();
    }
}