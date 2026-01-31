import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Badge,
} from "react-bootstrap";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays, format } from "date-fns";
import { userService, cartService, orderService } from "../services/api";

const Cart = () => {
  const navigate = useNavigate();
  const user = userService.getCurrentUser();

  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalRentAmount, setTotalRentAmount] = useState(0);
  const [totalDepositAmount, setTotalDepositAmount] = useState(0);

  const [dateRanges, setDateRanges] = useState({});
  const [showCalendar, setShowCalendar] = useState(null);

  // 🎉 ENHANCED SUCCESS POPUP STATE
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleBack = () => navigate(-1);

  if (!user) {
    navigate("/login");
    return null;
  }

  const getDefaultDateRange = (cartId) => [
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: `selection-${cartId}`,
    },
  ];

  // Calculate total amount with separate rent and deposit totals
  const calculateTotalAmount = useCallback(() => {
    let totalRent = 0;
    let totalDeposit = 0;
    
    cartProducts.forEach((item) => {
      const range = dateRanges[item.cart_id]?.[0];
      if (range && range.startDate && range.endDate) {
        // Calculate days between dates
        const days = Math.ceil(
          (range.endDate - range.startDate) / (1000 * 60 * 60 * 24)
        ) + 1; // +1 to include both start and end date
        
        // Rent cost = days × rent_per_day
        const rentCost = days * parseFloat(item.rent_per_day);
        
        // Add deposit
        const deposit = parseFloat(item.deposit_amt);
        
        totalRent += rentCost;
        totalDeposit += deposit;
      }
    });
    
    setTotalRentAmount(totalRent);
    setTotalDepositAmount(totalDeposit);
    setTotalAmount(totalRent + totalDeposit);
  }, [cartProducts, dateRanges]);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await cartService.getCartProducts();
        const products = response.data || [];
        const initialDates = {};
        products.forEach((product) => {
          initialDates[product.cart_id] = getDefaultDateRange(product.cart_id);
        });
        setDateRanges(initialDates);
        setCartProducts(products);
      } catch (err) {
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCartProducts();
  }, []);

  // Recalculate total when cart or dates change
  useEffect(() => {
    calculateTotalAmount();
  }, [cartProducts, dateRanges, calculateTotalAmount]);

  // 🧾 PLACE ALL ORDERS
  const handlePlaceAllOrders = async () => {
    try {
      let successCount = 0;

      for (const item of cartProducts) {
        const range = dateRanges[item.cart_id][0];
        const startDate = format(range.startDate, "yyyy-MM-dd");
        const endDate = format(range.endDate, "yyyy-MM-dd");

        try {
          const response = await orderService.placeOrder(
            item.cart_id,
            startDate,
            endDate,
          );
          if (response.data.success) successCount++;
        } catch {}
      }

      if (successCount > 0) {
        setShowSuccess(true);

        // Start fade-out after 4s
        setTimeout(() => setFadeOut(true), 3000);
        // Remove popup + refresh
        setTimeout(() => {
          setShowSuccess(false);
          setFadeOut(false);
          window.location.reload();
        }, 4600);
      }
    } catch {
      alert("Failed to place orders");
    }
  };

  const toggleCalendar = (cartId) => {
    setShowCalendar(showCalendar === cartId ? null : cartId);
  };

  const handleDateChange = (ranges) => {
    if (!showCalendar) return;
    const selectionKey = `selection-${showCalendar}`;
    const updatedRange = ranges[selectionKey];
    if (updatedRange) {
      setDateRanges((prev) => ({
        ...prev,
        [showCalendar]: [updatedRange],
      }));
    }
  };

  const handleRemoveFromCart = (cartId, brand) => {
    setItemToRemove({ cartId, brand });
    setShowConfirm(true);
  };

  const handleConfirmRemove = async () => {
    try {
      await cartService.removeFromCart(itemToRemove.cartId);
      setCartProducts((prev) =>
        prev.filter((item) => item.cart_id !== itemToRemove.cartId),
      );
      setDateRanges((prev) => {
        const newDates = { ...prev };
        delete newDates[itemToRemove.cartId];
        return newDates;
      });
    } catch {
      setError("Failed to remove item");
    } finally {
      setShowConfirm(false);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirm(false);
    setItemToRemove(null);
  };

  return (
    <div className="dashboard">
      {/* 🚀 ULTIMATE CELEBRATION POPUP */}
      {showSuccess && (
        <div className={`ultimate-success ${fadeOut ? "fade-out" : ""}`}>
          {/* 🌈 RAINBOW BACKGROUND */}
          <div className="rainbow-bg"></div>
          
          {/* 🎆 FIREWORKS */}
          <div className="fireworks">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`firework firework-${i}`}>
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            ))}
          </div>

          {/* 🎊 CONFETTI EXPLOSION */}
          <div className="confetti-container">
            {[...Array(100)].map((_, i) => (
              <div 
                key={i} 
                className={`confetti-piece piece-${i % 8}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* ✨ FLOATING EMOJIS */}
          <div className="floating-emojis">
            {["🎉", "🎊", "✨", "🚀", "⭐", "🎈", "🎁"].map((emoji, i) => (
              <span 
                key={i}
                className={`emoji emoji-${i}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* 🎯 MAIN SUCCESS CARD */}
          <div className="mega-success-card">
            <div className="success-ring"></div>
            <div className="trophy">🏆</div>
            <h1 className="glitch" data-text="SUCCESS!">
              SUCCESS!
            </h1>
            <h2>Orders Placed 🎉</h2>
            <p className="glow-text">
              Your items are officially booked! 🚀
            </p>
          </div>

          {/* 🔄 LOADING RING */}
          <div className="success-loader">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* 🚀 ULTIMATE SUCCESS ANIMATION */
        .ultimate-success {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          overflow: hidden;
          animation: rainbowPulse 3s ease-in-out infinite;
        }

        .fade-out {
          animation: megaFadeOut 1s ease forwards;
        }

        /* 🌈 RAINBOW BACKGROUND */
        .rainbow-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120,219,255,0.3) 0%, transparent 50%);
          animation: rainbowShift 4s ease-in-out infinite;
        }

        /* 🎆 FIREWORKS */
        .fireworks {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .firework {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          animation: explode 1.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        .firework span {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: hsl(${Math.random() * 360}, 100%, 70%);
          top: 50%;
          left: 50%;
          margin: -2px;
          animation: fireworkStar 1.5s ease-out infinite;
        }
        .firework-0 { animation-delay: 0s; }
        .firework-1 { animation-delay: 0.1s; }
        .firework-2 { animation-delay: 0.2s; }
        .firework-3 { animation-delay: 0.3s; }
        .firework-4 { animation-delay: 0.4s; }
        .firework-5 { animation-delay: 0.5s; }
        .firework-6 { animation-delay: 0.6s; }
        .firework-7 { animation-delay: 0.7s; }
        .firework-8 { animation-delay: 0.8s; }
        .firework-9 { animation-delay: 0.9s; }
        .firework-10 { animation-delay: 1s; }
        .firework-11 { animation-delay: 1.1s; }

        /* 🎊 CONFETTI */
        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: hsl(${Math.random() * 360}, 100%, 70%);
          top: -10px;
          animation: confettiFall 3s linear infinite;
        }
        .piece-0 { transform: rotate(0deg); }
        .piece-1 { transform: rotate(45deg); }
        .piece-2 { transform: rotate(90deg); }
        .piece-3 { transform: rotate(135deg); }
        .piece-4 { transform: rotate(180deg); }
        .piece-5 { transform: rotate(225deg); }
        .piece-6 { transform: rotate(270deg); }
        .piece-7 { transform: rotate(315deg); }

        /* ✨ FLOATING EMOJIS */
        .floating-emojis {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .emoji {
          position: absolute;
          font-size: 3rem;
          pointer-events: none;
          animation: floatUp 3s ease-out infinite;
        }
        .emoji-0 { left: 20%; animation-delay: 0s; }
        .emoji-1 { left: 40%; animation-delay: 0.3s; }
        .emoji-2 { left: 60%; animation-delay: 0.6s; }
        .emoji-3 { left: 80%; animation-delay: 0.9s; }
        .emoji-4 { left: 10%; animation-delay: 1.2s; }
        .emoji-5 { left: 70%; animation-delay: 1.5s; }
        .emoji-6 { left: 30%; animation-delay: 1.8s; }

        /* 🎯 SUCCESS CARD */
        .mega-success-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 60px 50px;
          text-align: center;
          box-shadow: 0 40px 100px rgba(0,0,0,0.3);
          position: relative;
          max-width: 500px;
          width: 90%;
          animation: megaPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .success-ring {
          position: absolute;
          inset: -20px;
          border: 3px solid transparent;
          border-top-color: #4ade80;
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }
        .trophy {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }
        .glitch {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glitch 2s infinite, rainbow 3s ease infinite;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 10px;
          letter-spacing: 0.1em;
        }
        .mega-success-card h2 {
          color: #1e293b;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 15px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .glow-text {
          color: #475569;
          font-size: 1.3rem;
          margin-bottom: 25px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* 🔄 LOADING RING */
        .success-loader {
          position: absolute;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
        }
        .success-loader div {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #60a5fa;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .success-loader div:nth-child(2) { border-top-color: #34d399; animation-delay: -0.8s; }
        .success-loader div:nth-child(3) { border-top-color: #f59e0b; animation-delay: -0.6s; }
        .success-loader div:nth-child(4) { border-top-color: #ec4899; animation-delay: -0.4s; }

        /* 🎨 EMPTY CART DECORATIVE */
        .empty-cart {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 30px;
          margin: 40px 0;
          box-shadow: inset 0 20px 40px rgba(0,0,0,0.05);
        }
        .empty-cart-icon {
          font-size: 8rem;
          background: linear-gradient(45deg, #64748b, #94a3b8);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
          animation: emptyFloat 3s ease-in-out infinite;
        }
        .empty-cart h3 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #1e293b, #334155);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 15px;
          letter-spacing: -0.02em;
        }
        .empty-cart p {
          font-size: 1.3rem;
          color: #64748b;
          max-width: 500px;
          line-height: 1.7;
          margin-bottom: 40px;
        }
        .empty-cart-actions {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .empty-cart-actions button {
          padding: 15px 35px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .place-order-card {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 25px !important;
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.3) !important;
        }
        .total-card {
          border: 2px solid #d4edda !important;
          border-radius: 12px !important;
          background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
        }
        .total-card .btn-success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          padding: 12px 24px;
          font-size: 1.1rem;
        }
        .total-card .btn-success:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
        }

        /* ANIMATIONS */
        @keyframes megaPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes rainbowPulse {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(180deg) brightness(1.1); }
        }
        @keyframes rainbowShift {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-20px) rotate(-2deg); }
          75% { transform: translateX(20px) rotate(2deg); }
        }
        @keyframes explode {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
        }
        @keyframes fireworkStar {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(180deg); opacity: 0; }
        }
        @keyframes confettiFall {
          0% { 
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-12px); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes megaFadeOut {
          to { 
            opacity: 0; 
            transform: scale(0.8); 
            filter: blur(5px);
          }
        }
      `}</style>

      {/* REMOVE CONFIRMATION MODAL */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleCancelRemove}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Remove from Cart?</h4>
            <p>
              Are you sure you want to remove{" "}
              <strong>{itemToRemove?.brand}</strong>?
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleCancelRemove}
              >
                Cancel
              </Button>
              <Button
                variant="outline-danger"
                size="md"
                onClick={handleConfirmRemove}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR POPUP */}
      {showCalendar && dateRanges[showCalendar]?.[0] && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowCalendar(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h4>📅 Rental Period</h4>
              <Button
                variant="outline-secondary"
                size="md"
                onClick={() => setShowCalendar(null)}
              >
                ✕
              </Button>
            </div>

            <DateRange
              editableDateInputs={true}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={dateRanges[showCalendar]}
              minDate={new Date()}
              maxDate={addDays(new Date(), 90)}
              showSelectionPreview={true}
              dateDisplayFormat="dd/MM/yyyy"
            />

            <div className="mt-4 text-center p-3 bg-light rounded">
              <strong style={{ fontSize: "18px", color: "#007bff" }}>
                {format(dateRanges[showCalendar][0].startDate, "dd/MM/yyyy")} →{" "}
                {format(dateRanges[showCalendar][0].endDate, "dd/MM/yyyy")}
              </strong>
            </div>
          </div>
        </div>
      )}

      <Navbar bg="light">
        <Container>
          <Navbar.Brand>🛒 My Cart ({cartProducts.length} items)</Navbar.Brand>
          <Button variant="outline-primary" onClick={handleBack}>
            Back
          </Button>
        </Container>
      </Navbar>

      <Container className="dashboard-content">
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <p>Loading cart...</p>
        ) : cartProducts.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your Cart is Empty</h3>
            <p>
              No items yet. Start shopping to add amazing products to your cart
              and book them for rental!
            </p>
            <div className="empty-cart-actions">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleBack}
                className="bg-gradient-primary text-white shadow-lg"
              >
                🎪 Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-products-section">
              <Row xs={1} md={2} lg={3} className="g-4 mb-4">
                {cartProducts.map((item) => {
                  const range = dateRanges[item.cart_id]?.[0];
                  return (
                    <Col key={item.cart_id}>
                      <Card className="h-100 shadow-lg">
                        <Card.Body className="p-4">
                          <Card.Title>{item.brand}</Card.Title>
                          <Card.Text>
                            <strong>₹{item.rent_per_day}/day</strong>
                            <br />
                            Deposit: ₹{item.deposit_amt}
                          </Card.Text>
                          <Badge
                            bg={item.status === "AVAILABLE" ? "success" : "warning"}
                          >
                            {item.status}
                          </Badge>

                          <div className="d-flex gap-2 mt-4">
                            <Button
                              variant="outline-primary"
                              className="flex-fill"
                              onClick={() => toggleCalendar(item.cart_id)}
                            >
                              📅{" "}
                              {range
                                ? `${format(range.startDate, "dd/MM")} → ${format(
                                    range.endDate,
                                    "dd/MM"
                                  )}`
                                : "Select Dates"}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveFromCart(item.cart_id, item.brand)
                              }
                            >
                              Remove 🗑️
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* TOTAL AMOUNT + PLACE ORDER - UPDATED WITH BREAKDOWN */}
              <Card className="total-card shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                      <h4 className="mb-1">Breakdown</h4>
                      <small className="text-muted">
                        {cartProducts.length} item(s) • Rent + Deposits
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="h3 fw-bold text-success mb-1">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </div>
                      <small className="text-muted">Final payable amount</small>
                    </div>
                  </div>

                  {/* BREAKDOWN SECTION */}
                  <div className="breakdown-section mb-4 p-3 bg-white rounded-3 shadow-sm">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3" style={{width: '48px', height: '48px'}}>
                            <i className="bi bi-calendar3 text-info fs-5"></i>
                          </div>
                          <div>
                            <div className="fw-bold fs-5 text-primary">Total Rent</div>
                            <small className="text-muted">{cartProducts.length} items × rental days</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <div className="h4 fw-bold text-primary">
                          ₹{totalRentAmount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="row g-3 align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3" style={{width: '48px', height: '48px'}}>
                            <i className="bi bi-shield-check text-warning fs-5"></i>
                          </div>
                          <div>
                            <div className="fw-bold fs-5 text-warning">Total Deposit</div>
                            <small className="text-muted">Refundable security</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <div className="h4 fw-bold text-warning">
                          ₹{totalDepositAmount.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <hr className="my-3" />

                    <div className="row g-0 align-items-center bg-light p-3 rounded-2">
                      <div className="col-md-6">
                        <div className="h5 fw-bold text-dark mb-0">TOTAL</div>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <div className="h3 fw-bolder text-success mb-0">
                         
                          <span className=" ms-2">
                            ₹{totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="d-grid">
                    <Button 
                      variant="success" 
                      size="lg"
                      className="fw-bold shadow-lg"
                      onClick={handlePlaceAllOrders}
                    >
                      ✅ Place Order • ₹{totalAmount.toLocaleString("en-IN")}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Cart;
