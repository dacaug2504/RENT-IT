import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { billService } from "../services/api";

const CustomerBills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await billService.getCustomerBills();
        setBills(response.data || []);
      } catch {
        setError("Failed to load bills");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  return (
    <div className="dashboard" style={{ fontSize: "16px" }}>

      {/* NAVBAR */}
      <div
        style={{
          background: "var(--pastel-green-light)",
          borderBottom: "2px solid var(--border-color)",
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--pastel-green-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            📋
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                color: "var(--text-dark)",
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              My Bills
            </h3>
            <span style={{ fontSize: "1rem", color: "var(--text-light)" }}>
              {bills.length} {bills.length === 1 ? "invoice" : "invoices"}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "white",
            border: "2px solid var(--border-color)",
            borderRadius: "12px",
            padding: "10px 22px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* BODY */}
      <div className="dashboard-content">
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "14px",
                padding: "18px",
                color: "#dc2626",
                fontSize: "1.05rem",
                marginBottom: "24px",
              }}
            >
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div className="spinner-border"></div>
              <p style={{ fontSize: "1.1rem", marginTop: "14px" }}>
                Loading your bills…
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && bills.length === 0 && (
            <div
              style={{
                minHeight: "50vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "70px 30px",
              }}
            >
              <div style={{ fontSize: "6.5rem", marginBottom: "22px" }}>
                📄
              </div>
              <h3 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "12px" }}>
                No Bills Yet
              </h3>
              <p style={{ fontSize: "1.2rem", maxWidth: "480px" }}>
                Your invoices will show up here once you place an order.
              </p>
              <button
                onClick={() => navigate(-1)}
                style={{
                  marginTop: "24px",
                  padding: "14px 36px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "40px",
                  border: "none",
                  background: "var(--pastel-green-light)",
                  color: "var(--text-dark)",
                  cursor: "pointer",
                }}
              >
                Browse Items
              </button>
            </div>
          )}

          {/* BILLS LIST */}
          {!loading && bills.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {bills.map((bill) => (
                <div
                  key={bill.billNo}
                  className="card"
                  style={{
                    padding: "26px",
                    cursor: "pointer",
                    fontSize: "1.05rem",
                  }}
                  onClick={() => navigate(`/bill/${bill.billNo}`)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                    }}
                  >
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>
                      📄 Invoice #{bill.billNo}
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 600 }}>
                      View →
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                        Item
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                        {bill.item}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                        Owner
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                        {bill.owner}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                        Date
                      </div>
                      <div style={{ fontSize: "1.05rem" }}>
                        {bill.billDate
                          ? new Date(bill.billDate).toLocaleDateString("en-IN")
                          : "-"}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                        Amount
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                        ₹{Number(bill.amount).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBills;
