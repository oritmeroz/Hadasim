import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // לדאוג להוסיף את ה-import
import UserService from "../Services/UserService";
import { User } from "../Models/types";

const RegisterUserPage = () => {
  const [user, setUser] = useState<User>({
    Id: 0,
    Name: "",
    Password: "",
    Email: "",
    Role: "User"
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);  // משתנה למסר הצלחה
  const [loading, setLoading] = useState<boolean>(false);  // משתנה להמתנה
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);  // מאפס את הודעת ההצלחה

    try {
      const newUser = await UserService.add(user);
      console.log("User added:", newUser);
      
      // הצגת הודעת הצלחה
      setSuccessMessage("ההרשמה הצליחה, מעביר לדף הבית...");
      
      // לאחר 2 שניות, לעבור לדף הבית
      setTimeout(() => {
        navigate("/home-page");  // ניווט לדף הבית (או דף אחר אם צריך)
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      setSuccessMessage("שגיאה בהרשמה. נסה שוב.");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">ההרשמה</h2>

        {/* הצגת הודעת הצלחה אם יש */}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="שם"
            value={user.Name}
            onChange={(e) => setUser({ ...user, Name: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={user.Password}
            onChange={(e) => setUser({ ...user, Password: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="אימייל"
            value={user.Email}
            onChange={(e) => setUser({ ...user, Email: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "שולח..." : "הירשם"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
