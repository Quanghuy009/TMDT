package TMDT.store.service.impl;

import TMDT.store.dto.response.ProductDetailResponse;
import TMDT.store.exception.BadRequestException;
import TMDT.store.mapper.ProductDetailMapper;
import TMDT.store.repository.ProductDetailRepository;
import TMDT.store.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductDetailServiceImpl implements ProductDetailService {

    private final ProductDetailRepository productDetailRepository;

    private final ProductDetailMapper productDetailMapper;

    @Override
    public ProductDetailResponse getProductDetail(Integer id) {
        return productDetailRepository.findProductDetailById(id)
                .map(productDetailMapper::toProductDetailResponse)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy sản phẩm có id: " + id));
    }
}