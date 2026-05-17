package TMDT.store.service.impl;

import TMDT.store.dto.response.BannerResponse;
import TMDT.store.repository.BannerRepository;
import TMDT.store.service.BannerService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<BannerResponse> getActiveBanners() {

        return bannerRepository.findByActiveTrue()
                .stream()
                .map(banner -> BannerResponse.builder()
                        .id(banner.getId())
                        .title(banner.getTitle())
                        .image(banner.getImage())
                        .build())
                .toList();
    }
}
