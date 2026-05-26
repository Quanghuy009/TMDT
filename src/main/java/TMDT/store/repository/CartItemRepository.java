package TMDT.store.repository;

import TMDT.store.entity.Cart;
import TMDT.store.entity.CartItem;
import TMDT.store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}