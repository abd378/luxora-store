import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Trash2,
  Plus,
  Minus,
  LogOut,
  ShieldCheck,
  Eye,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";

function Navbar({
  user,
  cart,
  wishlist,
  logout,
  newOrdersCount,
  setNewOrdersCount,
}) {
  const { t, i18n } = useTranslation();

  function changeLanguage() {
    const nextLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("luxoraLang", nextLang);
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Link to="/" className="logo">LUXORA</Link>

      <div className="nav-links">
        <Link to="/">{t("home")}</Link>
        <Link to="/shop">{t("shop")}</Link>
        <Link to="/supermarket">{t("supermarket")}</Link>
        <Link to="/services">{t("services")}</Link>
        <Link to="/wishlist">{t("wishlist")}</Link>
        <Link to="/contact">{t("contact")}</Link>

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="admin-alert-link"
            onClick={() => setNewOrdersCount(0)}
          >
            {t("admin")}
            {newOrdersCount > 0 && (
              <span className="admin-badge">{newOrdersCount}</span>
            )}
          </Link>
        )}
      </div>

      <div className="nav-actions">
        <button type="button" onClick={changeLanguage} className="small-btn">
          {i18n.language === "en" ? "AR" : "EN"}
        </button>

        <Link to="/wishlist" className="icon-link">
          <Heart size={20} />
          <span>{wishlist.length}</span>
        </Link>

        <Link to="/cart" className="icon-link">
          <ShoppingBag size={20} />
          <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="icon-link">
              <User size={20} />
            </Link>

            <button onClick={logout} className="small-btn">
              <LogOut size={16} /> {t("logout")}
            </button>
          </>
        ) : (
          <Link to="/login" className="small-btn">{t("login")}</Link>
        )}
      </div>
    </motion.nav>
  );
}

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="hero-content">
          <p className="badge">{t("heroBadge")}</p>

          <h1>{t("heroTitle")}</h1>

          <p>{t("heroText")}</p>

          <div className="hero-buttons">
            <Link to="/shop">{t("shopNow")}</Link>
            <Link to="/services" className="outline">
              {t("ourServices")}
            </Link>
          </div>
        </div>

        <motion.div
          className="hero-card"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <span>Limited Edition</span>
          <h2>Golden Aura</h2>
          <p>Luxury perfume collection</p>
          <strong>$89</strong>
        </motion.div>
      </motion.section>

      <section className="section">
        <h2>{t("featuredCategories")}</h2>

        <div className="category-grid">
          {["Perfumes", "Watches", "Bags", "Skincare", "Accessories"].map(
            (cat, index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to="/shop" className="category-card">
                  {cat}
                </Link>
              </motion.div>
            )
          )}
        </div>
      </section>
    </>
  );
}

function Shop({ products, addToCart, toggleWishlist, wishlist }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category === "All" || product.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <section className="section">
      <div className="page-header">
        <h1>Shop Collection</h1>
        <p>Products loaded from Supabase with local backup.</p>
      </div>

      <div className="shop-tools">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="category-select"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Perfumes</option>
          <option>Watches</option>
          <option>Bags</option>
          <option>Skincare</option>
          <option>Accessories</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <h2 className="empty">No products found.</h2>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <motion.div
              className="product-card"
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12 }}
              transition={{ delay: index * 0.04 }}
            >
              <button
                className="heart-btn"
                onClick={() => toggleWishlist(product)}
              >
                <Heart
                  fill={
                    wishlist.find((item) => item.id === product.id)
                      ? "white"
                      : "none"
                  }
                />
              </button>

              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Link>

              <p className="category">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>

              <div className="card-bottom">
                <strong>${product.price}</strong>
                <span>⭐ {product.rating}</span>
              </div>

              <button onClick={() => addToCart(product)}>Add To Cart</button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();

  const product = products.find((item) => Number(item.id) === Number(id));

  if (!product) {
    return <h1 className="empty">Product not found</h1>;
  }

  return (
    <motion.section
      className="details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <img src={product.image} alt={product.name} />

      <div>
        <p className="badge">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <h2>${product.price}</h2>
        <h3>⭐ {product.rating} Premium Rating</h3>
        <button onClick={() => addToCart(product)}>Add To Cart</button>
      </div>
    </motion.section>
  );
}

function Supermarket({ supermarketProducts, addToCart }) {
  const categories = [
    ...new Set(supermarketProducts.map((item) => item.category)),
  ];

  return (
    <section className="section">
      <div className="page-header">
        <h1>Supermarket Store</h1>
        <p>Supermarket products loaded from Supabase with local backup.</p>
      </div>

      <motion.div
        className="supermarket-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="badge">Fresh Daily Deals</p>
          <h2>
            Order supermarket products online with a premium shopping
            experience.
          </h2>
          <p>Groceries, mini markets, delivery stores and daily products.</p>
          <Link to="/contact">Request Supermarket Website</Link>
        </div>
      </motion.div>

      <div className="supermarket-stats">
        <div>
          <strong>{supermarketProducts.length}+</strong>
          <span>Products</span>
        </div>

        <div>
          <strong>{categories.length}</strong>
          <span>Categories</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Online Orders</span>
        </div>

        <div>
          <strong>Fast</strong>
          <span>Delivery Ready</span>
        </div>
      </div>

      <div className="super-category-row">
        {categories.map((cat) => (
          <span key={cat}>{cat}</span>
        ))}
      </div>

      {supermarketProducts.length === 0 ? (
        <h2 className="empty">No supermarket products found.</h2>
      ) : (
        <div className="product-grid">
          {supermarketProducts.map((item, index) => (
            <motion.div
              className="product-card supermarket-card"
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ delay: index * 0.03 }}
            >
              <span className="deal-badge">{item.badge}</span>

              <img src={item.image} alt={item.name} />

              <p className="category">{item.category}</p>
              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="card-bottom">
                <strong>${item.price}</strong>
                <span>⭐ {item.rating}</span>
              </div>

              <button onClick={() => addToCart(item)}>Add To Cart</button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
function Services({ services }) {
  const packages = [
    {
      name: "Starter",
      price: "$100",
      features: [
        "1 page website",
        "Responsive design",
        "Contact section",
        "Fast delivery",
      ],
    },
    {
      name: "Business",
      price: "$250",
      features: [
        "5 pages website",
        "Products/Menu",
        "Admin-ready layout",
        "Premium design",
      ],
    },
    {
      name: "Premium",
      price: "$400+",
      features: [
        "Full e-commerce",
        "Auth + Orders",
        "Database",
        "Admin dashboard",
      ],
    },
  ];

  return (
    <section className="section">
      <div className="page-header">
        <h1>Website Services</h1>
        <p>Services loaded from Supabase with local backup.</p>
      </div>

      <motion.div
        className="services-hero"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Need a real website for your business?</h2>
        <p>
          We build modern websites for restaurants, supermarkets, shops,
          clinics, portfolios and online businesses.
        </p>
        <Link to="/contact">Start Your Website</Link>
      </motion.div>

      {services.length === 0 ? (
        <h2 className="empty">No services found.</h2>
      ) : (
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              className="service-card service-preview-card"
              key={service.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="preview-window">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <img src={service.image} alt={service.title} />

              <h3>{service.title}</h3>
              <p>{service.text}</p>

              <div className="service-meta">
                <span>{service.tech}</span>
                <strong>{service.price}</strong>
              </div>

              <div className="service-actions">
                <Link to={`/services/${service.id}`}>
                  <Eye size={17} /> Preview Design
                </Link>

                <Link to="/contact">Request Sample</Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="pricing-section">
        <h2>Website Packages</h2>

        <div className="pricing-grid">
          {packages.map((pack) => (
            <motion.div
              className="pricing-card"
              key={pack.name}
              whileHover={{ y: -10 }}
            >
              <h3>{pack.name}</h3>
              <strong>{pack.price}</strong>

              {pack.features.map((feature) => (
                <p key={feature}>✓ {feature}</p>
              ))}

              <Link to="/contact">Choose Plan</Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="services-cta">
        <h2>Want a website like this?</h2>
        <p>
          Contact us and we can build your own menu, store or business website.
        </p>
        <Link to="/contact">Get Started Now</Link>
      </div>
    </section>
  );
}

function ServicePreview({ services }) {
  const { id } = useParams();

  const sample = services.find((item) => item.id === id);

  if (!sample) {
    return <h1 className="empty">Preview not found</h1>;
  }

  const gallery = Array.isArray(sample.gallery) ? sample.gallery : [];
  const sections = Array.isArray(sample.sections) ? sample.sections : [];
  const descriptions = Array.isArray(sample.section_descriptions)
    ? sample.section_descriptions
    : [];

  return (
    <section className="section">
      <div className="preview-page-header">
        <Link to="/services">← Back to Services</Link>
        <h1>{sample.preview_title}</h1>
        <p>{sample.preview_text}</p>
      </div>

      <div className="website-preview-shell">
        <div className="preview-browser-top">
          <span></span>
          <span></span>
          <span></span>
          <p>www.{sample.id}.com</p>
        </div>

        <div
          className="preview-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.78)), url(${sample.image})`,
          }}
        >
          <div>
            <button
              className="live-preview-btn"
              onClick={() =>
                toast.success(`${sample.preview_title} live preview started!`)
              }
            >
              Live Sample Preview
            </button>

            <h2>{sample.preview_title}</h2>
            <p>{sample.preview_text}</p>

            <button
              onClick={() =>
                toast.success(`Starting ${sample.title} project request!`)
              }
            >
              Start Project
            </button>
          </div>
        </div>

        <div className="preview-gallery">
          {gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${sample.title} preview ${index + 1}`}
            />
          ))}
        </div>

        <div className="preview-mini-grid">
          {sections.map((section, index) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3>{section}</h3>

              <p>
                {descriptions[index] ||
                  "Professional business section designed for this website type."}
              </p>

              <button
                className="mini-preview-btn"
                onClick={() =>
                  toast.success(`${section} opened for ${sample.preview_title}`)
                }
              >
                Open Preview
              </button>
            </motion.div>
          ))}
        </div>

        <div className="preview-bottom-cta">
          <h2>Ready to build this website?</h2>
          <p>
            This preview is loaded from Supabase and can be customized for any
            real business.
          </p>
          <Link to="/contact">Request This Design</Link>
        </div>
      </div>
    </section>
  );
}

function Cart({
  cart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  checkout,
}) {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  return (
    <section className="section">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>Review your products before payment.</p>
      </div>

      {cart.length === 0 ? (
        <h2 className="empty">Your cart is empty.</h2>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <motion.div
                className="cart-item"
                key={item.cartKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <img src={item.image} alt={item.name} />

                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                </div>

                <div className="qty">
                  <button onClick={() => decreaseQty(item.cartKey)}>
                    <Minus size={16} />
                  </button>

                  <span>{item.qty}</span>

                  <button onClick={() => increaseQty(item.cartKey)}>
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  className="delete"
                  onClick={() => removeFromCart(item.cartKey)}
                >
                  <Trash2 />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="checkout-box">
            <h2>Total: ${total}</h2>
            <button onClick={checkout}>Proceed To Payment</button>
          </div>
        </>
      )}
    </section>
  );
}

function Payment({ cart, user, sessionUser, confirmOrder }) {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  async function handlePayment(e) {
    e.preventDefault();

    const phone = e.target.phone.value;
const location = e.target.location.value;
const paymentMethod = e.target.paymentMethod.value;
const paymentReference = e.target.paymentReference.value;
const paymentNote = e.target.paymentNote.value;

await confirmOrder({
  phone,
  location,
  paymentMethod,
  paymentReference,
  paymentNote,
});
  }

  if (!user || !sessionUser) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <h1>Login Required</h1>
          <p>Please login before payment.</p>
          <Link to="/login" className="small-btn">
            Go To Login
          </Link>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="auth-page">
        <div className="auth-card">
          <h1>Empty Cart</h1>
          <p>Your cart is empty. Add products first.</p>
          <Link to="/shop" className="small-btn">
            Back To Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="payment-page section">
      <div className="page-header">
        <h1>Payment & Delivery</h1>
        <p>Enter your phone number, delivery location and payment method.</p>
      </div>

      <div className="payment-layout">
        <motion.form
          className="payment-card"
          onSubmit={handlePayment}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Delivery Information</h2>

          <label>Phone Number</label>
          <input
            name="phone"
            type="tel"
            placeholder="+961 70 000 000"
            required
          />

          <label>Delivery Location</label>
          <textarea
            name="location"
            placeholder="City, street, building, floor..."
            required
          ></textarea>

          <label>Payment Method</label>
         <select name="paymentMethod" required>
  <option>Cash on Delivery</option>
  <option>Whish Money</option>
  <option>OMT</option>
  <option>Bank Transfer</option>
</select>

<label>Transaction ID (Optional)</label>
<input
  name="paymentReference"
  type="text"
  placeholder="Whish / OMT transaction number"
/>

<label>Payment Note</label>
<textarea
  name="paymentNote"
  placeholder="Any payment notes..."
></textarea>

          <button>Confirm Order</button>
        </motion.form>

        <motion.div
          className="payment-summary"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div className="payment-item" key={item.cartKey}>
              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>Qty: {item.qty}</p>
              </div>

              <strong>${Number(item.price) * item.qty}</strong>
            </div>
          ))}

          <div className="payment-total">
            <span>Total</span>
            <strong>${total}</strong>
          </div>

          <p className="payment-note">
            Orders are saved in Supabase with phone, location and payment
            method.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Login({ refreshSession }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    await refreshSession();

    toast.success("Logged in successfully!");
    setLoading(false);
    navigate("/shop");
  }

  return (
    <section className="auth-page">
      <motion.form
        onSubmit={handleLogin}
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Welcome Back</h1>

        <p>Login with your real Supabase account.</p>

        <input name="email" type="email" placeholder="Email address" required />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have account? <Link to="/signup">Create Account</Link>
        </p>
      </motion.form>
    </section>
  );
}

function Signup({ refreshSession }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const fullName = e.target.fullname.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        role: "user",
      });
    }

    await refreshSession();

    toast.success("Account created successfully!");
    setLoading(false);
    navigate("/shop");
  }

  return (
    <section className="auth-page">
      <motion.form
        onSubmit={handleSignup}
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Create Account</h1>

        <p>Create a real account saved in Supabase.</p>

        <input name="fullname" type="text" placeholder="Full name" required />

        <input name="email" type="email" placeholder="Email address" required />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </motion.form>
    </section>
  );
}
function Wishlist({ wishlist, toggleWishlist, addToCart }) {
  return (
    <section className="section">
      <div className="page-header">
        <h1>Wishlist</h1>
        <p>Your favorite luxury products.</p>
      </div>

      {wishlist.length === 0 ? (
        <h2 className="empty">No wishlist products yet.</h2>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <motion.div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>${product.price}</strong>

              <button onClick={() => addToCart(product)}>Add To Cart</button>

              <button
                className="outline-btn"
                onClick={() => toggleWishlist(product)}
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function Profile({ user, orders, submitFeedback }) {
  return (
    <section className="section">
      <div className="profile-card">
        <User size={60} />
        <h1>{user?.full_name || "Customer User"}</h1>
        <p>{user?.email}</p>
        <p>{user?.role === "admin" ? "Admin Account" : "Customer Account"}</p>
      </div>

      <div className="admin-table">
        <h2>My Real Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="feedback-card order-feedback-card" key={order.id}>
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total}</p>
              <p>Phone: {order.phone || "Not provided"}</p>
              <p>Location: {order.location || "Not provided"}</p>
              <p>Payment: {order.payment_method || "Cash on Delivery"}</p>
              <p>Payment Status: {order.payment_status || "Pending"}</p>
              <p>Date: {new Date(order.created_at).toLocaleString()}</p>

              <form
                onSubmit={(e) => submitFeedback(e, order.id)}
                className="lux-feedback-form"
              >
                <input
                  className="lux-rating-input"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating"
                  required
                />

                <textarea
                  className="lux-feedback-textarea"
                  name="message"
                  placeholder="Write feedback..."
                ></textarea>

                <button className="lux-feedback-btn">Submit Feedback</button>
              </form>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Admin({ adminOrders, feedbacks, updateOrderStatus }) {
  const totalRevenue = adminOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const completedOrders = adminOrders.filter(
    (order) => order.status === "Completed"
  ).length;

  const processingOrders = adminOrders.filter(
    (order) => order.status === "Processing"
  ).length;

  return (
    <section className="section">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Real analytics, orders, delivery info and feedback.</p>
      </div>

      <div className="admin-grid">
        <div>
          <ShieldCheck />
          <h2>${totalRevenue}</h2>
          <p>Total Revenue</p>
        </div>

        <div>
          <ShoppingBag />
          <h2>{adminOrders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div>
          <User />
          <h2>{processingOrders}</h2>
          <p>Processing</p>
        </div>

        <div>
          <Heart />
          <h2>{completedOrders}</h2>
          <p>Completed</p>
        </div>
      </div>

      <div className="admin-table">
        <h2>Real Orders Management</h2>

        <div className="orders-table">
          <div className="orders-head premium-orders-head payment-orders-head">
            <span>ID</span>
            <span>Customer</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Location</span>
            <span>Payment</span>
            <span>Total</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {adminOrders.map((order) => (
            <div
              className="orders-row premium-orders-row payment-orders-row"
              key={order.id}
            >
              <span>#{order.id}</span>
              <span>{order.customer_name}</span>
              <span>{order.customer_email}</span>
              <span>{order.phone || "-"}</span>
              <span>{order.location || "-"}</span>
              <span>{order.payment_method || "Cash"}</span>
              <span>${order.total}</span>

              <span
                className={
                  order.status === "Completed"
                    ? "status completed"
                    : "status processing"
                }
              >
                {order.status}
              </span>

              <button
                className="status-btn"
                onClick={() => updateOrderStatus(order.id)}
                disabled={order.status === "Completed"}
              >
                {order.status === "Completed" ? "Done" : "Mark Completed"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="feedback-grid">
        {feedbacks.map((fb) => (
          <div className="feedback-card" key={fb.id}>
            <h3>Order #{fb.order_id}</h3>
            <p>{fb.message}</p>
            <strong>⭐ {fb.rating}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="auth-page">
      <form className="auth-card">
        <h1>Contact Us</h1>
        <p>Send us your message or request a website sample.</p>

        <input type="text" placeholder="Your name" />
        <input type="email" placeholder="Your email" />
        <textarea placeholder="Your message"></textarea>

        <button type="button" onClick={() => toast.success("Message sent!")}>
          Send Message
        </button>
      </form>
    </section>
  );
}

function ProtectedAdmin({
  user,
  adminOrders,
  feedbacks,
  updateOrderStatus,
}) {
  if (user?.role === "admin") {
    return (
      <Admin
        adminOrders={adminOrders}
        feedbacks={feedbacks}
        updateOrderStatus={updateOrderStatus}
      />
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Admin Only</h1>
        <p>This page is only available for admin accounts.</p>
        <Link to="/login" className="small-btn">
          Login As Admin
        </Link>
      </div>
    </section>
  );
}

function App() {
  const [sessionUser, setSessionUser] = useState(null);
  const [user, setUser] = useState(null);

  const [products, setProducts] = useState(() =>
    JSON.parse(localStorage.getItem("luxoraProducts") || "[]")
  );

  const [supermarketProducts, setSupermarketProducts] = useState(() =>
    JSON.parse(localStorage.getItem("luxoraSupermarket") || "[]")
  );

  const [services, setServices] = useState(() =>
    JSON.parse(localStorage.getItem("luxoraServices") || "[]")
  );

  const [orders, setOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("luxoraCart") || "[]")
  );

  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("luxoraWishlist") || "[]")
  );

  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const [lastOrderId, setLastOrderId] = useState(
    Number(localStorage.getItem("luxoraLastOrderId") || 0)
  );

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dir =
      localStorage.getItem("luxoraLang") === "ar" ? "rtl" : "ltr";

    loadProducts();
    loadSupermarketProducts();
    loadServices();
    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshSession();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("luxoraCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("luxoraWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user?.role !== "admin") return;

    checkNewOrders();

    const interval = setInterval(() => {
      checkNewOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, lastOrderId]);

  function playNotificationSound() {
    const audio = new Audio("/notification.mp3");
    audio.volume = 1;

    audio.play().catch(() => {
      console.log("Click once on admin page to allow sound.");
    });
  }

  async function checkNewOrders() {
    if (user?.role !== "admin") return;

    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return;

    const newestId = Number(data[0].id);

    if (lastOrderId === 0) {
      setLastOrderId(newestId);
      localStorage.setItem("luxoraLastOrderId", newestId);
      return;
    }

    if (newestId > lastOrderId) {
      setLastOrderId(newestId);
      localStorage.setItem("luxoraLastOrderId", newestId);

      setNewOrdersCount((prev) => prev + 1);
      playNotificationSound();
      toast.success("New order received!");

      await loadAdminData();
    }
  }

  async function refreshSession() {
    const { data } = await supabase.auth.getSession();
    const currentUser = data.session?.user;

    if (!currentUser) {
      setSessionUser(null);
      setUser(null);
      setOrders([]);
      setAdminOrders([]);
      setFeedbacks([]);
      return;
    }

    setSessionUser(currentUser);

    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          id: currentUser.id,
          full_name: currentUser.email?.split("@")[0] || "Customer User",
          email: currentUser.email,
          role: "user",
        })
        .select()
        .single();

      profile = newProfile;
    }

    setUser(profile);
    await loadOrders(currentUser.id);

    if (profile?.role === "admin") {
      await loadAdminData();
    }
  }

  async function loadProducts() {
    const cached = localStorage.getItem("luxoraProducts");
    if (cached) setProducts(JSON.parse(cached));

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("Products error:", error);
      return;
    }

    if (data && data.length > 0) {
      setProducts(data);
      localStorage.setItem("luxoraProducts", JSON.stringify(data));
    }
  }

  async function loadSupermarketProducts() {
    const cached = localStorage.getItem("luxoraSupermarket");
    if (cached) setSupermarketProducts(JSON.parse(cached));

    const { data, error } = await supabase
      .from("supermarket_products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("Supermarket error:", error);
      return;
    }

    if (data && data.length > 0) {
      setSupermarketProducts(data);
      localStorage.setItem("luxoraSupermarket", JSON.stringify(data));
    }
  }

  async function loadServices() {
    const cached = localStorage.getItem("luxoraServices");
    if (cached) setServices(JSON.parse(cached));

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Services error:", error);
      return;
    }

    if (data && data.length > 0) {
      setServices(data);
      localStorage.setItem("luxoraServices", JSON.stringify(data));
    }
  }

  async function loadOrders(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Orders error:", error);
      return;
    }

    setOrders(data || []);
  }

  async function loadAdminData() {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: feedbackData } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    setAdminOrders(ordersData || []);
    setFeedbacks(feedbackData || []);
  }

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);
    setSessionUser(null);
    setOrders([]);
    setAdminOrders([]);
    setFeedbacks([]);

    toast.success("Logged out successfully!");
    navigate("/");
  }

  function normalizeProduct(product) {
    return {
      cartKey: `${product.category || "product"}-${product.id}`,
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      category: product.category,
      description: product.description,
      rating: product.rating,
      qty: 1,
    };
  }

  function addToCart(product) {
    if (!user) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      toast.error("Admin account cannot shop.");
      return;
    }

    const cartProduct = normalizeProduct(product);
    const exists = cart.find((item) => item.cartKey === cartProduct.cartKey);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.cartKey === cartProduct.cartKey
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, cartProduct]);
    }

    toast.success("Product added to cart!");
  }

  function increaseQty(cartKey) {
    setCart(
      cart.map((item) =>
        item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decreaseQty(cartKey) {
    setCart(
      cart
        .map((item) =>
          item.cartKey === cartKey ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(cartKey) {
    setCart(cart.filter((item) => item.cartKey !== cartKey));
    toast.success("Product removed.");
  }

  function toggleWishlist(product) {
    if (!user) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      toast.error("Admin account cannot use wishlist.");
      return;
    }

    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      toast.success("Removed from wishlist.");
    } else {
      setWishlist([...wishlist, product]);
      toast.success("Added to wishlist!");
    }
  }

  function checkout() {
    if (!user || !sessionUser) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    navigate("/payment");
  }

  async function confirmOrder({
  phone,
  location,
  paymentMethod,
  paymentReference,
  paymentNote,
}) {
    const { data } = await supabase.auth.getSession();
    const currentUser = data.session?.user;

    if (!currentUser || !user) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty.");
      navigate("/shop");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * item.qty,
      0
    );

  const { data: orderData, error } = await supabase
  .from("orders")
  .insert({
    user_id: currentUser.id,
    customer_name: user.full_name || currentUser.email,
    customer_email: user.email || currentUser.email,
    total,
    status: "Processing",
    items: cart,
    phone,
    location,
    payment_method: paymentMethod,
    payment_reference: paymentReference,
    payment_note: paymentNote,
    payment_status: "Pending",
  })
  .select()
  .single();;

    if (error) {
      toast.error("Order error: " + error.message);
      console.log(error);
      return;
    }
    try {
  await supabase.functions.invoke("send-order-email", {
    body: {
      customerEmail: user.email || currentUser.email,
      customerName: user.full_name || currentUser.email,
      orderId: orderData.id,
      total,
      phone,
      location,
      paymentMethod,
      items: cart,
    },
  });

  toast.success("Confirmation email sent!");
} catch (emailError) {
  console.log("Email error:", emailError);
}

    setCart([]);
    localStorage.removeItem("luxoraCart");

    await loadOrders(currentUser.id);

    if (user.role === "admin") {
      await loadAdminData();
    }

    toast.success("Order confirmed successfully!");
    navigate("/profile");
  }

  async function submitFeedback(e, orderId) {
    e.preventDefault();

    if (!sessionUser) {
      toast.error("Please login first.");
      return;
    }

    const { error } = await supabase.from("feedback").insert({
      user_id: sessionUser.id,
      order_id: orderId,
      rating: Number(e.target.rating.value),
      message: e.target.message.value,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Feedback submitted!");
    e.target.reset();
  }

  async function updateOrderStatus(orderId) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "Completed" })
      .eq("id", orderId);

    if (error) {
      toast.error(error.message);
      return;
    }

    await loadAdminData();

    if (sessionUser) {
      await loadOrders(sessionUser.id);
    }

    toast.success("Order marked as completed!");
  }

  return (
    <div className="site">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #d4af37",
          },
        }}
      />

      <Navbar
        user={user}
        cart={cart}
        wishlist={wishlist}
        logout={logout}
        newOrdersCount={newOrdersCount}
        setNewOrdersCount={setNewOrdersCount}
      />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/shop"
          element={
            <Shop
              products={products}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlist={wishlist}
            />
          }
        />

        <Route
          path="/supermarket"
          element={
            <Supermarket
              supermarketProducts={supermarketProducts}
              addToCart={addToCart}
            />
          }
        />

        <Route path="/services" element={<Services services={services} />} />

        <Route
          path="/services/:id"
          element={<ServicePreview services={services} />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails products={products} addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              removeFromCart={removeFromCart}
              checkout={checkout}
            />
          }
        />

        <Route
          path="/payment"
          element={
            <Payment
              cart={cart}
              user={user}
              sessionUser={sessionUser}
              confirmOrder={confirmOrder}
            />
          }
        />

        <Route
          path="/login"
          element={<Login refreshSession={refreshSession} />}
        />

        <Route
          path="/signup"
          element={<Signup refreshSession={refreshSession} />}
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              orders={orders}
              submitFeedback={submitFeedback}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdmin
              user={user}
              adminOrders={adminOrders}
              feedbacks={feedbacks}
              updateOrderStatus={updateOrderStatus}
            />
          }
        />

        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;