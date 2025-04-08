import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginService from '../Services/LoginService';
// import { getRoleFromToken } from '../Util/AuthService'; // ה-import לפונקציה שמחזירה את ה-role מהטוקן

const LoginPage: React.FC = () => {
  const [mail, setMail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // מאפס את השגיאה

    try {
      const data = await LoginService(mail, pass);
      localStorage.setItem('token', data.token); // שימור ה-token ב-localStorage

      // שולפים את ה-role מהטוקן
      // const role = getRoleFromToken();
      

      // אם ה-role הוא User
      if (data.role === "User") {
        console.log("Navigating to /orderUser-page");
        navigate('/Userorderpage'); // ניווט לדף ההזמנות של בעל המכולת
      } else if (data.role === 'Supplier') {
        navigate('/SupplierOrdersPage'); // ניווט לדף של הספק
      } 
    } catch (err: any) {
      setError(err.message || 'שגיאה לא מזוהה');
    }
  };

  const handleSupplierRegister = () => {
    navigate('/supplier-register');
  };

  const handleUserRegister = () => {
    navigate('/user-register');
  };

  return (
    <div>
      <h2>התחברות</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>אימייל</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>סיסמה</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>

        {error && <div>{error}</div>} {/* הצגת הודעת שגיאה */}

        <button type="submit">התחבר</button>
      </form>

      <div>
        <button onClick={handleSupplierRegister}>הוספת ספק</button>
        <button onClick={handleUserRegister}>הוספת בעל מכולת</button>
      </div>
    </div>
  );
};

export default LoginPage;
