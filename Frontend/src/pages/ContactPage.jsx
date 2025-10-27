import React from 'react';

const ContactPage = () => {
  return (
    <div className="p-6 mt-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl max-w-6xl mx-auto border border-orange-100">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-8 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent animate-pulse-slow">
        ช่องทางการติดต่อ
      </h1>
      
      <div className="grid md:grid-cols-2 gap-10 mb-10">
        {/* ส่วนข้อมูลติดต่อ */}
        <div className="space-y-6">
          <ul className="space-y-5 text-gray-700 text-base">
            <li className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
              <span className="text-2xl text-orange-500">📧</span> 
              <span>อีเมล: </span>
              <a href="mailto:support@geonode.nu.ac.th" className="text-blue-600 underline hover:text-blue-800 transition duration-300 font-medium">
                support@geonode.nu.ac.th
              </a>
            </li>
            <li className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
              <span className="text-2xl text-orange-500">🎥</span> 
              <span>TikTok: </span>
              <a href="https://www.tiktok.com/@gistnu" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition duration-300 font-medium">
                tiktok.com/@gistnu
              </a>
            </li>
            <li className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
              <span className="text-2xl text-orange-500">📞</span> 
              <span>โทรศัพท์: </span>
              <span className="font-medium text-orange-700">055-123-4567</span>
            </li>
            <li className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
              <span className="text-2xl text-orange-500">🌐</span> 
              <span>เว็บไซต์: </span>
              <a href="https://www.nu.ac.th/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition duration-300 font-medium">
                https://www.nu.ac.th/
              </a>
            </li>
            <li className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
              <span className="text-2xl text-orange-500">📍</span> 
              <span>ที่อยู่: </span>
              <span className="font-medium text-gray-800">มหาวิทยาลัยนเรศวร, ถนนพหลโยธิน, ตำบลท่าโพธิ์, อำเภอเมืองพิษณุโลก, จังหวัดพิษณุโลก 65000</span>
            </li>
          </ul>
          <button className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
            <a href="mailto:support@geonode.nu.ac.th" className="block">ติดต่อเราเลย!</a>
          </button>
        </div>

        {/* ส่วนแผนที่ */}
        <div className="bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-semibold text-orange-600 mb-4">แผนที่มหาวิทยาลัยนเรศวร</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.977613958952!2d100.19370437508013!3d16.74302688403844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30dfbea2ae8ac66d%3A0xbd6f8f18a85e7f27!2z4Liq4LiW4Liy4LiZ4Lig4Li54Lih4Li04Lig4Liy4LiE4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Lit4Lin4LiB4Liy4Lio4LmB4Lil4Liw4Lig4Li54Lih4Li04Liq4Liy4Lij4Liq4LiZ4LmA4LiX4Lio4Lig4Liy4LiE4LmA4Lir4LiZ4Li34Lit4LiV4Lit4LiZ4Lil4LmI4Liy4LiHIOC4oeC4q-C4suC4p-C4tOC4l-C4ouC4suC4peC4seC4ouC4meC5gOC4o-C4qOC4p-C4ow!5e1!3m2!1sth!2sth!4v1758786074034!5m2!1sth!2sth"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="แผนที่มหาวิทยาลัยนเรศวร"
            className="rounded-lg border border-orange-200"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// เพิ่ม animation keyframes ใน CSS-in-JS หรือไฟล์ CSS แยก
const styles = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.9; }
  }
  .animate-pulse-slow {
    animation: pulse-slow 2s infinite;
  }
`;

// ถ้าใช้ CSS-in-JS (เช่น styled-components) สามารถเพิ่ม styles ได้
// หรือเพิ่มในไฟล์ CSS global เช่น App.css
export default ContactPage;