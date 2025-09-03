// imports
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserCard() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser) return;

            const token = storedUser.accessToken;
            const userId = storedUser.id;

            if (!token || !userId) return;

            const res = await axios.get(`http://localhost:4000/api/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            setUser(res.data);
        } catch (err) {
            console.error("Error fetching user profile:", err);
        }
        };

    fetchProfile();
  }, []);

  if (!user) return null;

  // pill style for constraints
    const pillStyle = {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        fontSize: "14px",
        padding: "6px 12px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
    };
  // helper to render any constraint list
  const renderConstraints = (title, constraints) => (
    <div style={{ marginBottom: "16px" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: "#1f2937",
          margin: "0 0 10px 0",
          marginLeft: "26px",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingLeft: "32px" }}>
        {constraints?.length > 0 ? (
          constraints.map((c) => (
            <span key={c._id} style={pillStyle}>
              {c.constraint}
            </span>
          ))
        ) : (
          <p style={{ fontSize: "16px", color: "#9ca3af", margin: 0 }}>
            None listed
          </p>
        )}
      </div>
    </div>
  );

    return(

        <div style={{ display: "flex", gap: "16px", height: "100%", width: "100%" }}>
  {/* Left Side: User Info */}
  <div
    style={{
      width: "50%",
      height: "50%",
      padding: "30px 34px",
      margin: "16px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    {/* Header */}
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "72px", padding: "8px", color: "#2563eb" }}>
          👤
        </span>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#1f2937",
            margin: 0,
          }}
        >
          {user.firstName} {user.lastName}
        </h2>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#1f2937",
              margin: "0",
            }}
          >
            ✉️ Email:
          </h3>
          <p style={{ fontSize: "18px", color: "#6b7280", margin: "0" }}>
            {user.email}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 500,
              color: "#1f2937",
              margin: "0",
            }}
          >
            📞 Phone:
          </h3>
          <p style={{ fontSize: "18px", color: "#6b7280", margin: "0" }}>
            {user.phone}
          </p>
        </div>
      </div>
    </div>

    {/* Change Password Button */}
    <button
      style={{
        width: "35%",
        margin: "32px auto 0", // centers horizontally
        padding: "12px",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Change Password
    </button>
  </div>

  {/* Right Side: Food Constraints */}
  <div
    style={{
      width: "50%",
      height: "50%",
      padding: "30px 34px",
      margin: "20px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
      height: "fit-content",
    }}
  >
    <h3
      style={{
        fontSize: "22px",
        fontWeight: 500,
        color: "#1f2937",
        margin: "0 0 8px 0",
      }}
    >
      🍽️ Food Constraints:
    </h3>

    {renderConstraints("🌬️ Airborne Allergies", user.airborneAllergies)}
    {renderConstraints("🍴 Dietary Allergies", user.dietaryAllergies)}
    {renderConstraints("🚫 Dietary Restrictions", user.dietaryRestrictions)}
    {renderConstraints("👎 Preference Dislikes", user.preferenceDislikes)}
    {renderConstraints("👍 Preference Likes", user.preferenceLikes)}
  </div>
</div>

    )
}