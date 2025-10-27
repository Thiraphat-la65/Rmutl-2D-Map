import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import login from '../services/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.redirectPath || '/';
    const [isLoggedIn, setIsLoggedIn] = useState(false); // เริ่มต้นเป็น false จนกว่าล็อกอินสำเร็จ

    useEffect(() => {
        // ตรวจสอบสถานะล็อกอินเมื่อโหลดหน้า
        const storedRole = localStorage.getItem('userRole');
        if (storedRole && !isLoggedIn) {
            setIsLoggedIn(true);
            navigate(redirectPath, { state: { showMessage: true, name: JSON.parse(localStorage.getItem('user'))?.name, role: storedRole } });
        }
    }, [navigate, redirectPath, isLoggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const credentials = { email, password };
            const response = await login(credentials);

            if (!response || !response.user || !response.user.role || !response.user.id) {
                throw new Error('ข้อมูลการตอบกลับไม่ถูกต้องจากเซิร์ฟเวอร์');
            }

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('userId', response.user.id);
            setIsLoggedIn(true); // อัปเดตสถานะหลังล็อกอินสำเร็จ

            navigate(redirectPath, { state: { showMessage: true, name: response.user.name, role: response.user.role } });
        } catch (error) {
            setError(error.message || 'เกิดข้อผิดพลาดในการล็อกอิน');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> เข้าสู่ระบบ
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            อีเมล
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="กรอกอีเมล"
                                required
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            รหัสผ่าน
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="กรอกรหัสผ่าน"
                                required
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className={`w-full ${loading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'} text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
                        disabled={loading}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                    <p className="text-center text-gray-700 mt-4">
                        ยังไม่มีบัญชี?{' '}
                        <Link to="/register" className="text-orange-600 hover:text-orange-800 font-medium">
                            สมัครสมาชิก
                        </Link>
                    </p>
                    <p className="text-center text-gray-700 mt-4">
                        <Link to={!isLoggedIn ? '/' : redirectPath} className="text-orange-600 hover:text-orange-800 font-medium">
                            ย้อนกลับ
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;