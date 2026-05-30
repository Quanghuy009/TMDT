package TMDT.store.dto.response;

import java.math.BigDecimal;

public class AdminProductResponse {

    private Integer id;
    private String name;
    private String image;
    private String category;
    private String categoryCode;
    private String brand;
    private BigDecimal price;
    private Integer quantity;

    public AdminProductResponse() {
    }

    public AdminProductResponse(
            Integer id,
            String name,
            String image,
            String category,
            String categoryCode,
            String brand,
            BigDecimal price,
            Integer quantity
    ) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.category = category;
        this.categoryCode = categoryCode;
        this.brand = brand;
        this.price = price;
        this.quantity = quantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}