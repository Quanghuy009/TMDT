package TMDT.store.service;

import TMDT.store.dto.response.BannerResponse;

import java.util.List;

public interface BannerService {

    List<BannerResponse> getActiveBanners();
}
