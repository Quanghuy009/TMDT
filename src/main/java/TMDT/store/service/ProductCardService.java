package TMDT.store.service;

import TMDT.store.dto.response.ProductCardResponse;
import TMDT.store.entity.Product;

public interface ProductCardService {

    ProductCardResponse toProductCard(Product product);
}