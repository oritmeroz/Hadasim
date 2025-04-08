import { AxiosResponse } from 'axios';
import apiClient from '../api/apiClient';

interface AuthResponse {
  token: string;
  message?: string;
}

const LoginService = async (mail: string, password: string) => {
  try {
    // יצירת URLSearchParams עבור נתוני התחברות
    const formData = new URLSearchParams();
    formData.append("Email", mail);
    formData.append("Password", password);

    // שליחת הבקשה לשרת לצורך התחברות
    const response: AxiosResponse<AuthResponse> = await apiClient.post('/Login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    // אם לא התקבל טוקן או שהיתה שגיאה, נזרוק שגיאה
    if (response.data && response.data.message) {
      throw new Error(response.data.message);
    }

    const token = response.data.token;

    
    // החזרת הטוקן, ה-SupplierId, וה-role
    const roleResponse: AxiosResponse<string> = await apiClient.get(`/Login/${token}/getRole`);

    return { token, role: roleResponse.data};
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export default LoginService;




// const LoginService = {
//   login: async (email: string, password: string) => {
//     try {
//       // יצירת נתונים בפורמט של FormData או URLSearchParams
//       const formData = new URLSearchParams();
//       formData.append('email', email);
//       formData.append('password', password);

//       // שליחת בקשה לשרת
//       const response = await axios.post('https://localhost:7193/api/Login', formData, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded', // ציון סוג תוכן
//         },
//       });

//       // אם התקבל טוקן, שומרים אותו
//       if (response.data.token) {
//         localStorage.setItem('authToken', response.data.token);
//         return response.data.token;
//       } else {
//         throw new Error('Failed to authenticate.');
//       }
//     } catch (error: any) {
//       if (error.response) {
//         // שגיאה שהתקבלה מהשרת
//         console.error('Response error:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//       } else if (error.request) {
//         // שגיאה אם לא התקבלה תשובה מהשרת
//         console.error('Request error:', error.request);
//       } else {
//         // שגיאה כללית
//         console.error('Login error:', error.message);
//       }
//       throw new Error('מייל או סיסמה לא נכונים');
//     }
//   },
// };

// export default LoginService;
