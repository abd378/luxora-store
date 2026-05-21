import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      shop: "Shop",
      supermarket: "Supermarket",
      services: "Services",
      wishlist: "Wishlist",
      contact: "Contact",
      admin: "Admin",
      login: "Login",
      logout: "Logout",
      heroBadge: "Ultra Premium E-Commerce",
      heroTitle: "Luxury shopping experience with real backend & premium UI.",
      heroText:
        "Real products, supermarket products, services, orders, payment info, users and admin dashboard connected with Supabase.",
      shopNow: "Shop Now",
      ourServices: "Our Services",
      featuredCategories: "Featured Categories",
    },
  },
  ar: {
    translation: {
      home: "الرئيسية",
      shop: "المتجر",
      supermarket: "السوبرماركت",
      services: "الخدمات",
      wishlist: "المفضلة",
      contact: "تواصل معنا",
      admin: "الأدمن",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      heroBadge: "متجر إلكتروني فاخر",
      heroTitle: "تجربة تسوّق فاخرة مع نظام حقيقي وتصميم احترافي.",
      heroText:
        "منتجات حقيقية، سوبرماركت، خدمات مواقع، طلبات، دفع، مستخدمين ولوحة أدمن متصلة مع Supabase.",
      shopNow: "تسوّق الآن",
      ourServices: "خدماتنا",
      featuredCategories: "الأقسام المميزة",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("luxoraLang") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;