import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import register from '../services/auth.js';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
            return;
        }
        try {
            const userData = { name, email, password };
            const response = await register(userData);

            // เก็บ token และข้อมูลผู้ใช้
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            alert(`สมัครสมาชิกสำเร็จ, ยินดีต้อนรับ ${response.user.name}!`);
            navigate('/login');
        } catch (error) {
            alert('สมัครสมาชิกล้มเหลว: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
                    <i className="fas fa-user-plus mr-2"></i> สมัครสมาชิก
                </h2>
                <div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            ชื่อ
                        </label>
                        <div className="relative">
                            <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="กรอกชื่อ"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            อีเมล
                        </label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="กรอกอีเมล"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            รหัสผ่าน
                        </label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="กรอกรหัสผ่าน"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                            ยืนยันรหัสผ่าน
                        </label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="ยืนยันรหัสผ่าน"
                                required
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                        สมัครสมาชิก
                    </button>
                    <p className="text-center text-gray-700 mt-4">
                        มีบัญชีแล้ว?{' '}
                        <Link to="/login" className="text-orange-600 hover:text-orange-800 font-medium">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                    <p className="text-center text-gray-700 mt-4">
                        <Link to="/" className="text-orange-600 hover:text-orange-800 font-medium">
                            ย้อนกลับ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;