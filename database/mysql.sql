CREATE TABLE IF NOT EXISTS `product`  (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(64) NOT NULL,
    img varchar(128) NOT NULL,
    price double(11, 2) NOT NULL,
    description TEXT NOT NULL,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS `cart`  (
    productId int NOT NULL,
    userId int NOT NULL,
    amount int NOT NULL DEFAULT 1,
    primary key (productId, userId)
);

ALTER TABLE `cart`
    ADD CONSTRAINT `fk_cart_productId`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`);