import React, { createContext, useContext, useEffect, useState } from 'react';
import Img1 from "../assets/common/dress1.jpg"
import Img2 from "../assets/common/e7.webp";
import Img3 from "../assets/common/e3.jpg";
import Img4 from "../assets/shirt/shirt.png";
import Img5 from "../assets/common/e6.jpg";
import Img6 from "../assets/shirt/shirt.png";
import Img7 from "../assets/shirt/shirt2.png";
import Img8 from "../assets/shirt/shirt3.png";

import phn1 from "../assets/phone/phn1.jpg";
import phn2 from "../assets/phone/phn2.jpg";
import phn3 from "../assets/phone/phn3.jpg";


import fur1 from "../assets/furniture/fur2.jpg";
 import fur2 from "../assets/furniture/fur2.jpg";
 import fur3 from "../assets/furniture/fur3.jpg";
 import fur4 from "../assets/furniture/fur4.jpg";
 import fur5 from "../assets/furniture/fur5.jpg";

 import kit1 from "../assets/kitchenappli/kit1.jpg";
 import kit2 from "../assets/kitchenappli/kit3.jpg";
 import kit3 from "../assets/kitchenappli/kit3.jpg";
 import kit4 from "../assets/kitchenappli/kit4.jpg";
 import kit5 from "../assets/kitchenappli/kit5.jpg";

import lap1 from "../assets/laptop/lap1.jpg";
import lap2 from "../assets/laptop/lap2.jpg";

import cam1 from "../assets/camera/cam1.jpg";
 import cam2 from "../assets/camera/cam2.png";
 import cam3 from "../assets/camera/cam3.jpg";

 import book1 from "../assets/camera/book1.jpg";
 import book3 from "../assets/camera/book3.jpg";

 import book4 from "../assets/camera/book4.jpg";
 import book5 from "../assets/camera/book5.jpg";

 import ref1 from "../assets/camera/book1.jpg";
 import ref2 from "../assets/camera/book3.jpg";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      color: "Red",
      price: 999,
      description: "This is a sample product.",
      rating: 4,
      img: Img1, // main image
      images: [Img1, Img2, Img3],
      category: "Fashion",
      subcategory: "Womens"
    },
    {
      id: 2,
      name: "Product 2",
      color: "Blue",
      price: 1299,
      description: "This is another sample product.",
      rating: 4.5,
      img: Img2,
      images: [Img2, Img3, Img4],
      category: "Fashion",
      subcategory: "Womens"
    },
    {
      id: 3,
      name: "Product 3",
      color: "Green",
      price: 1799,
      description: "A green sample product.",
      rating: 4.2,
      img: Img3,
      images: [Img3, Img1, Img5],
      category: "Fashion",
      subcategory: "Mens"
    },
    {
      id: 4,
      name: "Product 4",
      color: "Black",
      price: 2499,
      description: "A stylish black product.",
      rating: 5.0,
      img: Img4,
      images: [Img2, Img3, Img4],
      category: "Fashion",
      subcategory: "Mens"
    },
    {
      id: 5,
      name: "Product 5",
      color: "Yellow",
      price: 1899,
      description: "A sample product with yellow color.",
      rating: 4.6,
      img: Img5,
      images: [Img3, Img1, Img5],
      category: "Fashion",
      subcategory: "Womens"
    },
    {
      id: 6,
      name: "OnePlus 9 Pro",
      color: "Morning Mist",
      price: 64999,
      description: "OnePlus flagship phone with fast performance.",
      rating: 4.6,
      img: phn1,
      images: [phn1, phn2, phn1],
      category: "Electronics",
      subcategory: "Phones"
    },
    {
      id: 7,
      name: "Product 7",
      color: "Brown",
      price: 1899,
      description: "A brown leather product.",
      rating: 4.3,
      img: Img2,
      images: [Img3, Img1, Img5],
      category: "Fashion",
      subcategory: "Womens"
    },
    {
      id: 8,
      name: "Product 8",
      color: "Silver",
      price: 3999,
      description: "A shiny silver product.",
      rating: 4.8,
      img: Img6,
      images: [Img2, Img3, Img6],
      category: "Fashion",
      subcategory: "Mens"
    },
    {
      id: 9,
      name: "Product 9",
      color: "Silver",
      price: 1999,
      description: "A shiny silver product.",
      rating: 4.8,
      img: Img7,
      images: [Img2, Img3, Img7],
      category: "Fashion",
      subcategory: "Mens"
    },
    {
      id: 10,
      name: "Xiaomi Mi 11",
      color: "Horizon Blue",
      price: 39999,
      description: "Xiaomi Mi series with top-notch features.",
      rating: 4.3,
      img: phn2,
      images: [phn1, phn2, phn3],
      category: "Electronics",
      subcategory: "Phones"
    },
    {
      id: 11,
      name: "iPhone 12 Pro Max",
      color: "Pacific Blue",
      price: 99999,
      description: "This is a sample iPhone.",
      rating: 4.7,
      img: phn1,
      images: [phn1, phn3, phn3],
      category: "Electronics",
      subcategory: "Phones"
    },
    {
      id: 12,
      name: "Samsung Galaxy S21",
      color: "Phantom Gray",
      price: 79999,
      description: "This is a Samsung Galaxy phone.",
      rating: 4.5,
      img: phn1,
      images: [phn1, phn3, phn3],
      category: "Electronics",
      subcategory: "Phones"
    },
    {
      id: 13,
      name: "OnePlus 9 Pro",
      color: "Morning Mist",
      price: 64999,
      description: "OnePlus flagship phone with fast performance.",
      rating: 4.6,
      img: phn2,
      images: [phn2, phn3, phn3],
      category: "Electronics",
      subcategory: "Phones"
    },
    {
      id: 14,
      name: "Google Pixel 6",
      color: "Stormy Black",
      price: 59999,
      description: "Google's flagship phone with an amazing camera.",
      rating: 4.8,
      img: cam2, // replace with actual image
      images:[cam1,cam2,cam2],
       category: "Electronics",
      subcategory: "Cameras"
    },
    {
      id: 15,
      name: "Xiaomi Mi 11",
      color: "Horizon Blue",
      price: 39999,
      description: "Xiaomi Mi series with top-notch features.",
      rating: 4.3,
      img: phn3, // replace with actual image
      images: [phn2,phn3,phn3],
       category: "Electronics",
      subcategory: "Phones"
    },
      {
        id: 16,
        name: "MacBook Pro 16-inch",
        color: "Space Gray",
        price: 239999,
        description: "Apple MacBook Pro with M1 Pro chip.",
        rating: 4.9,
        img: lap1, // Use the imported image
        images: [lap1, lap2, lap1], // Array of images for the product
         category: "Electronics",
      subcategory: "Laptops"
      },
      {
        id: 17,
        name: "Dell XPS 13",
        color: "Platinum Silver",
        price: 149999,
        description: "Dell XPS 13 with Intel Core i7 processor.",
        rating: 4.7,
        img: lap2, // Use the imported image
        images: [lap2, lap2, lap1],
         category: "Electronics",
      subcategory: "Laptops"
      },
      {
        id: 18,
        name: "HP Spectre x360",
        color: "Nightfall Black",
        price: 134999,
        description: "HP Spectre x360 with Intel i7, 16GB RAM.",
        rating: 4.6,
        img: lap1, // Use the imported image
        images: [lap1, lap2, lap1],
         category: "Electronics",
      subcategory: "Laptops"
      },
      {
        id: 19,
        name: "Lenovo ThinkPad X1 Carbon",
        color: "Black",
        price: 119999,
        description: "Lenovo ThinkPad X1 Carbon with Intel Core i5.",
        rating: 4.8,
        img: lap1, // Use the imported image
        images: [lap1, lap2, lap1],
         category: "Electronics",
      subcategory: "Laptops"
      },
      {
        id: 20,
        name: "Asus ROG Zephyrus G14",
        color: "Moonlight White",
        price: 149999,
        description: "Asus ROG Zephyrus G14, a gaming laptop with AMD Ryzen 9.",
        rating: 4.7,
        img: lap2, // Use the imported image
        images: [lap1, lap2, lap1],
         category: "Electronics",
      subcategory: "Laptops"
      },
        {
          id: 21,
          name: "Canon EOS 90D",
          color: "Black",
          price: 84999,
          description: "Canon EOS 90D DSLR Camera with 32.5 MP Sensor.",
          rating: 4.8,
          img: cam1, // Use the imported image
          images: [cam1, cam1, cam2], // List of images for the product
           category: "Electronics",
      subcategory: "Cameras"
        },
        {
          id: 22,
          name: "Nikon D850",
          color: "Black",
          price: 169999,
          description: "Nikon D850 DSLR Camera with 45.7 MP full-frame sensor.",
          rating: 4.9,
          img: cam2, // Use the imported image
          images: [cam2, cam1, cam2],
           category: "Electronics",
      subcategory: "Cameras"
        },
        {
          id: 23,
          name: "Sony Alpha 7 III",
          color: "Black",
          price: 149999,
          description: "Sony Alpha 7 III Mirrorless Camera with 24.2 MP sensor.",
          rating: 4.7,
          img: cam3, // Use the imported image
          images: [cam3, cam1, cam2],
           category: "Electronics",
      subcategory: "Cameras"
        },
        {
          id: 24,
          name: "Fujifilm X-T4",
          color: "Silver",
          price: 169999,
          description: "Fujifilm X-T4 Mirrorless Camera with 26.1 MP sensor.",
          rating: 4.6,
          img: cam2, // Use the imported image
          images: [cam2, cam1, cam3],
           category: "Electronics",
      subcategory: "Cameras"
        },
        {
          id: 25,
          name: "Panasonic Lumix GH5",
          color: "Black",
          price: 84999,
          description: "Panasonic Lumix GH5 Mirrorless Camera with 4K video recording.",
          rating: 4.5,
          img: cam1, // Use the imported image
          images: [cam1, cam2, cam3],
           category: "Electronics",
      subcategory: "Cameras"
        },
  {
    id: 26,
    name: "Casual Shirt - Blue",
    color: "Blue",
    price: 1999,
    description: "A comfortable blue casual shirt for everyday wear.",
    rating: 4.5,
    img: Img7, // use imported image
    images: [Img7, Img8, Img7], // Multiple images for this product
     category: "Fashion",
      subcategory: "Mens"
  },
  {
    id: 27,
    name: "Formal Shirt - White",
    color: "White",
    price: 2499,
    description: "A stylish formal white shirt perfect for office or events.",
    rating: 4.7,
    img: Img8,
    images: [Img8, Img7, Img8],
     category: "Fashion",
      subcategory: "Mens"
  },
  {
    id: 28,
    name: "Denim Shirt - Dark Wash",
    color: "Dark Blue",
    price: 1799,
    description: "A trendy denim shirt with a modern fit.",
    rating: 4.6,
    img: Img3,
    images: [Img3, Img5, Img4],
      category: "Fashion",
      subcategory: "Mens"
  },
  {
    id: 29,
    name: "Checked Shirt - Red",
    color: "Red",
    price: 2199,
    description: "A comfortable red checked shirt for casual outings.",
    rating: 4.3,
    img: Img4,
    images: [Img4, Img6, Img5],
      category: "Fashion",
      subcategory: "Mens"
  },
  {
    id: 30,
    name: "Slim Fit Shirt - Black",
    color: "Black",
    price: 1999,
    description: "A slim-fit black shirt for a sleek, modern look.",
    rating: 4.8,
    img: Img8,
    images: [Img8, Img7, Img8],
      category: "Fashion",
      subcategory: "Mens"
  },
  {
    id: 31,
    name: "Floral Dress - Pink",
    color: "Pink",
    price: 1599,
    description: "A beautiful floral dress perfect for summer days.",
    rating: 4.6,
    img: Img1, // use imported image
    images: [Img1, Img4, Img2], // Multiple images for this product
      category: "Fashion",
      subcategory: "Womens"
  },
  {
    id: 32,
    name: "A-Line Dress - Black",
    color: "Black",
    price: 2499,
    description: "An elegant A-line black dress for formal occasions.",
    rating: 4.8,
    img: Img8,
    images: [Img8, Img7, Img8],
      category: "Fashion",
      subcategory: "Mens"
  },
  {
    id: 33,
    name: "Casual Top - White",
    color: "White",
    price: 999,
    description: "A simple and stylish white top for casual wear.",
    rating: 4.4,
    img: Img2,
    images: [Img2, Img1, Img2],
      category: "Fashion",
      subcategory: "Womens"
  },
  {
    id: 34,
    name: "Maxi Dress - Red",
    color: "Red",
    price: 2299,
    description: "A stunning red maxi dress for special occasions.",
    rating: 4.7,
    img: Img1,
    images: [Img1, Img2, Img1],
      category: "Fashion",
      subcategory: "Womens"
  },
  {
    id: 35,
    name: "Peplum Top - Blue",
    color: "Blue",
    price: 1399,
    description: "A trendy peplum top in blue, great for office or outings.",
    rating: 4.5,
    img: Img5,
    images: [Img5, Img4, Img2],
      category: "Fashion",
      subcategory: "Womens"
  },
    {
      id: 36,
      name: "T-Shirt - Blue",
      color: "Blue",
      price: 799,
      description: "A comfortable blue T-shirt perfect for casual wear.",
      rating: 4.5,
      img: Img8,
    images: [Img8, Img6, Img8],
        category: "Fashion",
      subcategory: "Mens"
    },
    {
      id: 37,
      name: "Graphic T-Shirt - Red",
      color: "Red",
      price: 899,
      description: "A fun graphic T-shirt featuring a cool design for kids.",
      rating: 4.7,
      img: Img4,
    images: [Img4, Img6, Img5],
        category: "Fashion",
      subcategory: "Mens"
    },
    {
      id: 38,
      name: "Denim Shorts - Light Wash",
      color: "Light Blue",
      price: 999,
      description: "Stylish denim shorts for a trendy summer look.",
      rating: 4.6,
      img: Img3,
      images: [Img3, Img5, Img4],
        category: "Fashion",
      subcategory: "Womens"
    },
    {
      id: 39,
      name: "Summer Dress - Pink",
      color: "Pink",
      price: 1199,
      description: "A cute pink summer dress perfect for warm days.",
      rating: 4.3,
      img: Img1,
      images: [Img1, Img3, Img1],
        category: "Fashion",
      subcategory: "Womens"
    },
    {
      id: 40,
      name: "Cotton Hoodie - Grey",
      color: "Grey",
      price: 1299,
      description: "A cozy cotton hoodie for those cooler days.",
      rating: 4.8,
      img: Img5,
      images: [Img5, Img4, Img1],
        category: "Fashion",
      subcategory: "Womens"
    },
      {
        id: 41,
        name: "Wooden Dining Table",
        color: "Brown",
        price: 24999,
        description: "A sturdy wooden dining table perfect for family gatherings.",
        rating: 4.7,
        img: fur1,
        images: [fur1, fur4, fur5],
          category: "Home",
      subcategory: "Furniture"
      },
      {
        id: 42,
        name: "Leather Sofa",
        color: "Black",
        price: 39999,
        description: "A comfortable leather sofa for your living room.",
        rating: 4.5,
        img: fur2,
        images: [fur2, fur4, fur5],
         category: "Home",
      subcategory: "Furniture"
      },
      {
        id: 43,
        name: "Wooden Coffee Table",
        color: "Dark Oak",
        price: 14999,
        description: "A beautiful wooden coffee table to enhance your living space.",
        rating: 4.6,
        img: fur3,
        images: [fur3, fur5, fur4],
         category: "Home",
      subcategory: "Furniture"
      },
      {
        id: 44,
        name: "Armchair - Modern",
        color: "Gray",
        price: 8999,
        description: "A stylish modern armchair for a comfortable sitting experience.",
        rating: 4.8,
        img: fur4,
        images: [fur4, fur5, fur3],
         category: "Home",
      subcategory: "Furniture"
      },
      {
        id: 45,
        name: "Recliner Chair",
        color: "Beige",
        price: 12999,
        description: "A relaxing recliner chair perfect for unwinding after a long day.",
        rating: 4.3,
        img: fur5,
        images: [fur5, fur4, fur1],
         category: "Home",
      subcategory: "Furniture"
      },
        {
          id: 46,
          name: "Modern Vase",
          color: "Gold",
          price: 2499,
          description: "A stylish gold vase for contemporary home decor.",
          rating: 4.7,
          img: Img1,
          images: [Img1, Img4, Img5],
           category: "Home",
      subcategory: "Home Decor"
        },
        {
          id: 47,
          name: "Decorative Wall Clock",
          color: "Silver",
          price: 3499,
          description: "A beautiful silver wall clock for your living room.",
          rating: 4.5,
          img: Img2,
          images: [Img2, Img4, Img5],
          category: "Home",
      subcategory: "Home Decor"
        },
        {
          id: 48,
          name: "Set of Pillows",
          color: "Beige",
          price: 1499,
          description: "A set of cozy beige pillows to enhance your sofa.",
          rating: 4.6,
          img: Img3,
          images: [Img3, Img5, Img4],
          category: "Home",
      subcategory: "Home Decor"
        },
        {
          id: 49,
          name: "Decorative Mirror",
          color: "Bronze",
          price: 4999,
          description: "A stunning bronze decorative mirror for your hallway.",
          rating: 4.8,
          img: Img4,
          images: [Img4, Img5, Img3],
          category: "Home",
      subcategory: "Home Decor"
        },
        {
          id: 50,
          name: "Table Lamp",
          color: "White",
          price: 1999,
          description: "A modern white table lamp for your study or bedroom.",
          rating: 4.3,
          img: Img5,
          images: [Img5, Img4, Img1],
          category: "Home",
      subcategory: "Home Decor"
        },
          {
            id: 51,
            name: "Premium Dinner Set",
            color: "White",
            price: 2999,
            description: "Elegant 16-piece dinner set for stylish dining experiences.",
            rating: 4.7,
            img: Img1,
            images: [Img1, Img5, Img4],
            category: "Home",
      subcategory: "Kitchen & Dining"
          },
          {
            id: 52,
            name: "Cookware Set - 7 Pieces",
            color: "Black",
            price: 3999,
            description: "Durable cookware set for your everyday cooking needs.",
            rating: 4.5,
            img: Img2,
            images: [Img2, Img4, Img5],
            category: "Home",
      subcategory: "Kitchen & Dining"
          },
          {
            id: 53,
            name: "Wooden Dining Table",
            color: "Brown",
            price: 8999,
            description: "A beautifully crafted wooden dining table that seats 6.",
            rating: 4.6,
            img: fur2,
            images: [fur2, fur1, fur5],
            category: "Home",
      subcategory: "Furniture"
          },
          {
            id: 54,
            name: "Ceramic Coffee Mug Set",
            color: "Blue",
            price: 1299,
            description: "Set of 4 premium ceramic coffee mugs in blue color.",
            rating: 4.8,
            img: Img4,
            images: [Img4, Img5, Img3],
            category: "Home",
      subcategory: "Kitchen & Dining"
          },
          {
            id: 55,
            name: "Stainless Steel Cutlery Set",
            color: "Silver",
            price: 1799,
            description: "A complete 24-piece stainless steel cutlery set for your dining table.",
            rating: 4.3,
            img: Img5,
            images: [Img5, Img4, Img2],
            category: "Home",
      subcategory: "Kitchen & Dining"
          }, 
          
            {
              id: 61,
              name: "Premium Blender",
              color: "Red",
              price: 2999,
              description: "High-performance blender for smoothies, shakes, and more.",
              rating: 4.7,
              img: kit1,
              images: [kit1, kit5, kit4],
              category: "Appliances",
      subcategory: "Kitchen Appliances"
            },
            {
              id: 62,
              name: "Coffee Maker",
              color: "Black",
              price: 1999,
              description: "Brew your favorite coffee with this efficient coffee maker.",
              rating: 4.5,
              img: kit2,
              images: [kit2, kit4, kit5],
              category: "Appliances",
      subcategory: "Kitchen Appliances"
            },
            {
              id: 63,
              name: "Electric Toaster",
              color: "Silver",
              price: 1599,
              description: "Toast your bread perfectly every time with this electric toaster.",
              rating: 4.6,
              img: kit3,
              images: [kit3, kit5, kit1],
              category: "Appliances",
      subcategory: "Kitchen Appliances"
            },
            {
              id: 64,
              name: "Air Fryer",
              color: "White",
              price: 4999,
              description: "Cook crispy and healthy meals with little or no oil.",
              rating: 4.8,
              img: kit4,
              images: [kit4, kit5, kit3],
              category: "Appliances",
      subcategory: "Kitchen Appliances"
            },
            {
              id: 65,
              name: "Microwave Oven",
              color: "Silver",
              price: 6499,
              description: "Efficient microwave oven for fast cooking and reheating.",
              rating: 4.3,
              img: kit5,
              images: [kit5, kit4, kit2],
              category: "Appliances",
      subcategory: "Kitchen Appliances"
            },
              {
                id: 66,
                name: "Vacuum Cleaner",
                color: "Red",
                price: 5999,
                description: "High-power vacuum cleaner for efficient cleaning.",
                rating: 4.7,
                img: Img1,
                images: [Img1, Img5, Img4],
                category: "Appliances",
      subcategory: "Cleaning Appliances"
              },
              {
                id: 67,
                name: "Air Purifier",
                color: "White",
                price: 8999,
                description: "Purify your indoor air with this advanced air purifier.",
                rating: 4.5,
                img: Img2,
                images: [Img2, Img4, Img5],
                category: "Appliances",
      subcategory: "Home Appliances"
              },
              {
                id: 68,
                name: "Ceiling Fan",
                color: "Silver",
                price: 2499,
                description: "High-efficiency ceiling fan for cooling your home.",
                rating: 4.6,
                img: Img3,
                images: [Img3, Img5, Img1],
                category: "Appliances",
      subcategory: "Home Appliances"
              },
              {
                id: 69,
                name: "Dehumidifier",
                color: "Black",
                price: 4999,
                description: "Compact dehumidifier for maintaining ideal humidity levels.",
                rating: 4.8,
                img: Img4,
                images: [Img4, Img5, Img3],
                category: "Appliances",
      subcategory: "Home Appliances"
              },
              {
                id: 70,
                name: "Room Heater",
                color: "Silver",
                price: 3499,
                description: "Efficient room heater for a warm and cozy home.",
                rating: 4.3,
                img: Img5,
                images: [Img5, Img4, Img2],
                category: "Appliances",
      subcategory: "Home Appliances"
              },  
                {
                  id: 71,
                  name: "Vacuum Cleaner",
                  color: "Black",
                  price: 7999,
                  description: "Powerful vacuum cleaner with multi-surface cleaning ability.",
                  rating: 4.7,
                  img: Img1,
                  images: [Img1, Img5, Img4],
                  category: "Appliances",
      subcategory: "Cleaning Appliances"
                },
                {
                  id: 72,
                  name: "Carpet Cleaner",
                  color: "Red",
                  price: 5999,
                  description: "Efficient carpet cleaner for deep cleaning of your rugs.",
                  rating: 4.5,
                  img: Img2,
                  images: [Img2, Img4, Img5],
                  category: "Appliances",
      subcategory: "Cleaning Appliances"
                },
                {
                  id: 73,
                  name: "Steam Mop",
                  color: "White",
                  price: 4999,
                  description: "Steam mop for chemical-free cleaning and sanitizing.",
                  rating: 4.6,
                  img: Img3,
                  images: [Img3, Img5, Img1],
                  category: "Appliances",
      subcategory: "Cleaning Appliances"
                },
                {
                  id: 74,
                  name: "Window Cleaner",
                  color: "Silver",
                  price: 2999,
                  description: "Electric window cleaner for streak-free shine.",
                  rating: 4.8,
                  img: Img4,
                  images: [Img4, Img5, Img3],
                  category: "Appliances",
      subcategory: "Cleaning Appliances"
                },
                {
                  id: 75,
                  name: "Floor Scrubber",
                  color: "Blue",
                  price: 6999,
                  description: "Electric floor scrubber for easy and effective floor cleaning.",
                  rating: 4.3,
                  img: Img5,
                  images: [Img5, Img4, Img2],
                  category: "Appliances",
      subcategory: "Cleaning Appliances"
                }, 
                  {
                    id: 76,
                    name: "The Great Gatsby",
                    price: 499,
                    description: "A classic novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
                    rating: 4.8,
                    img: book1,
                    images: [book1, book1, book3],
                    category: "Books",
      subcategory: "Fiction"
                  },
                  {
                    id: 77,
                    name: "1984",
                  price: 399,
                    description: "A dystopian novel that delves into the dangers of totalitarianism and mass surveillance.",
                    rating: 4.6,
                    img: book3,
                    images: [book1, book3, book1],
                    category: "Books",
      subcategory: "Fiction"
                  },
                  {
                    id: 78,
                    name: "Pride and Prejudice",
                price: 299,
                    description: "A romantic novel that also critiques the social class and relationships in early 19th-century England.",
                    rating: 4.7,
                    img: book1,
                    images: [book3, book1, book1],
                    category: "Books",
      subcategory: "Fiction"
                  },
                  {
                    id: 79,
                    name: "The Catcher in the Rye",
                  price: 349,
                    description: "A novel about teenage angst, rebellion, and the search for identity.",
                    rating: 4.4,
                    img: book3,
                    images: [book3, book1, book3],
                    category: "Books",
      subcategory: "Fiction"
                  },
                  {
                    id: 80,
                    name: "Moby-Dick",
                    price: 799,
                    description: "An epic tale of obsession and the sea, following Captain Ahab's pursuit of the elusive white whale.",
                    rating: 4.5,
                    img: book1,
                    images: [book1, book3, book1],
                    category: "Books",
      subcategory: "Fiction"
                  },
                    {
                      id: 81,
                      name: "Sapiens: A Brief History of Humankind",
                      price: 699,
                      description: "An exploration of the history of humankind, from the emergence of Homo sapiens to the present day.",
                      rating: 4.9,
                      img: book4,
                      images: [book4, book4, book5],
                      category: "Books",
      subcategory: "Non-fiction"
                    },
                    {
                      id: 82,
                      name: "Educated: A Memoir",
                      price: 499,
                      description: "A memoir about a young woman’s struggle to reconcile her desire for education with her family’s strict beliefs.",
                      rating: 4.8,
                      img: book5,
                      images: [book5, book5, book4],
                      category: "Books",
      subcategory: "Non-fiction"
                    },
                    {
                      id: 83,
                      name: "Becoming",
                       price: 599,
                      description: "The former First Lady’s inspiring memoir about her personal journey from Chicago to the White House.",
                      rating: 4.7,
                      img: book4,
                      images: [book4, book4, book4],
                      category: "Books",
      subcategory: "Non-fiction"
                    },
                    {
                      id: 84,
                      name: "The Immortal Life of Henrietta Lacks",
                       price: 349,
                      description: "The story of Henrietta Lacks, whose cells were used for scientific breakthroughs without her consent.",
                      rating: 4.6,
                      img: book5,
                      images: [book5, book4, book4],
                      category: "Books",
      subcategory: "Non-fiction"
                    },
                    {
                      id: 85,
                      name: "The Wright Brothers",
                      price: 799,
                      description: "A biography of the Wright brothers, pioneers in the history of flight, and their invention of the airplane.",
                      rating: 4.5,
                      img: book4,
                      images: [book4, book5, book5],
                     category: "Books",
      subcategory: "Non-fiction"
                    },               
{
  id: 86,
  name: "Oxford English Dict ress",
  price: 1299,
  description: "The definitive dictionary of the English language, providing comprehensive coverage of words and their meanings.",
  rating: 4.9,
  img: ref1,
  images: [ref1, ref1, ref2],
  category: "Books",
      subcategory: "Reference"
},
{
  id: 87,
  name: "The Encyclopedia of S ",
  price: 999,
  description: "A complete reference book on scientific facts, discoveries, and innovations across the world.",
  rating: 4.8,
  img: ref2,
  images: [ref2, ref2, ref1],
  category: "Books",
      subcategory: "Reference"
},
{
  id: 88,
  name: "World ice: 799",
  description: "A comprehensive atlas featuring detailed maps of the world, countries, and regions.",
  rating: 4.7,
  img: ref1,
  images: [ref1, ref1, ref1],
  category: "Books",
      subcategory: "Reference"
},
{
  id: 89,
  name: "The Complete History  ",
  price: 1799,
  description: "A thorough reference book that explores the history of art from the Renaissance to contemporary movements.",
  rating: 4.6,
  img: ref2,
  images: [ref2, ref1, ref1],
  category: "Books",
      subcategory: "Reference"
},
{
  id: 90,
  name: "The Global Financial  ce: 1499",
  description: "An in-depth analysis of the global financial crisis, its causes, and the lessons learned.",
  rating: 4.5,
  img: ref1,
  images: [ref1, ref2, ref2],
  category: "Books",
      subcategory: "Reference"
},
  ])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming you're fetching products from an API
    const fetchProducts = async () => {
      const response = await fetch('/view-all');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
