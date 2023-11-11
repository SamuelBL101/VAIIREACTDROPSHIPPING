import React from 'react';
import '../css/style.css';

const Product = ({ imgSrc, altText, title, price }) => {
  return (
    <div className="product">
      <img src={imgSrc} alt={altText} className="product-image" />
      <h3>{title}</h3>
      <p>Cena: {price}</p>
      <button className="add-to-cart-button">Pridať do košíka</button>
    </div>
  );
};

const ProductList = () => {
  return (
    <div className="products">
      <Product
        imgSrc="data/img/produktyHLS/img.png"
        altText="Produkt 1"
        title="Keramický hrnček so vzorom"
        price="5.99€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_1.png"
        altText="Produkt 2"
        title="Kuchynske utierky (3 kusy)"
        price="3.49€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_2.png"
        altText="Produkt 3"
        title="Drevená krabica na šperky"
        price="7.99€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_3.png"
        altText="Produkt 4"
        title="Gélové pero s čiernym atramentom"
        price="1.99€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_4.png"
        altText="Produkt 5"
        title="Biela keramická váza"
        price="4.49€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_5.png"
        altText="Produkt 6"
        title="Ponožky (10 párov)"
        price="8.99€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_6.png"
        altText="Produkt 7"
        title="Plážový slnečník"
        price="6.29€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_7.png"
        altText="Produkt 8"
        title="Svietiaca LED sviečka"
        price="2.79€"
      />
      <Product
        imgSrc="data/img/produktyHLS/img_8.png"
        altText="Produkt 9"
        title="Malá taška s remienkom"
        price="9.49€"
      />
    </div>
  );
};

export default ProductList;
