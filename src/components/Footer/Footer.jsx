import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
  FaTwitter,
} from "react-icons/fa";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  { title: "Home", link: "/#" },
  { title: "Shop", link: "/view-all" },
  { title: "Contact", link: "/contactus" },
  { title: "Account", link: "/account" },
];


const PopularCategories = [
  { title: "Men's Wear", link: "/#menswear" },
  { title: "Women's Wear", link: "/#womenswear" },
  { title: "Electronics", link: "/#electronics" },
  { title: "Accessories", link: "/#accessories" },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white bg-black bg-opacity-80 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Company Details */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <img src={footerLogo} alt="Logo" className="w-10 h-10" />
              <span>Shopsy</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
            We understand the importance of approaching each work integrally and believe in the power of simple.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Quick Links</h2>
            <ul className="space-y-2 text-gray-300">
              {FooterLinks.map((link) => (
                <li
                  className="cursor-pointer hover:text-blue-500 hover:underline transition-all"
                  key={link.title}
                >
                  <a href={link.link}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Popular Categories
            </h2>
            <ul className="space-y-2 text-gray-300">
              {PopularCategories.map((category) => (
                <li
                  className="cursor-pointer hover:text-blue-500 hover:underline transition-all"
                  key={category.title}
                >
                  <a href={category.link}>{category.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="flex gap-4 items-center">
              <a
                href="https://www.instagram.com/hexoinnovation/#"
                className="text-2xl hover:text-blue-500 transition-all"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/people/Hexo-Innovation/61556658466330/?mibextid=qi2Omg&rdid=YorYgG8aQW05ATYs&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FReFmZkbJu2NCFPeR%2F%3Fmibextid%3Dqi2Omg"
                className="text-2xl hover:text-blue-500 transition-all"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.linkedin.com/company/hexo-innovation/"
                className="text-2xl hover:text-blue-500 transition-all"
              >
                <FaLinkedin />
              </a>
              {/* <a
                href="#"
                className="text-2xl hover:text-blue-500 transition-all"
              >
                <FaTwitter />
              </a> */}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-xl text-blue-500" />
                <p>122 A Railway Feeder Road ,Sattur-626203
                Tamilnadu -India</p>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt className="text-xl text-blue-500" />
                <p>91-6382572739</p>
                <p>+91-8807974521</p>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h2 className="text-lg font-semibold text-white">
                Subscribe to our Newsletter
              </h2>
              <div className="flex mt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-3 w-full rounded-l-lg bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-12 text-sm text-gray-400">
          <p>&copy; © 2025 Hexo Innovation –  All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
