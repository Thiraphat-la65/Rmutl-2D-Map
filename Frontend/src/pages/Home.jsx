// src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">

      {/* ========== SECTION 1: HERO (ข้อความเด่นด้วยเงาเข้ม + Hover ขยายเงา) ========== */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col justify-end pb-20 snap-start overflow-hidden"
      >
        {/* วิดีโอพื้นหลัง */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/assets/videos/rmutl-video.mp4" type="video/mp4" />
          <div className="text-white text-center p-10 bg-gray-800">
            วิดีโอไม่สามารถเล่นได้
          </div>
        </video>

        {/* ข้อความ – เงาเข้ม + hover ขยาย */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 text-center text-white px-6 mb-10"
          whileHover={{ scale: 1.05 }}
          style={{
            filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.7))',
            textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.6)'
          }}
        >
          <h1
            className="text-5xl md:text-7xl font-bold mb-3 tracking-wide"
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.8))',
              transition: 'filter 0.3s ease'
            }}
          >
            RMUTL MAP
          </h1>
          <p
            className="text-lg md:text-2xl font-light"
            style={{
              filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.7))',
              transition: 'filter 0.3s ease'
            }}
          >
            มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา พิษณุโลก
          </p>
        </motion.div>
      </section>

      {/* ========== SECTION 2: แผนที่ ========== */}
      <motion.section
        id="map"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 snap-start py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center md:text-left">
            ค้นหาสถานที่ในมหาวิทยาลัย
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                ระบบแผนที่ดิจิทัลที่ช่วยนำทางคุณไปยังทุกอาคาร ห้องเรียน หอพัก
                และสิ่งอำนวยความสะดวกภายในวิทยาเขตพิษณุโลก
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">Check</span> ค้นหาอาคารด้วยชื่อหรือรหัส
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">Check</span> เส้นทางเดินเท้าที่สั้นที่สุด
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">Check</span> ข้อมูลจุดจอดรถและทางเข้า
                </li>
              </ul>

              {/* ปุ่มนี้กดแล้วไปหน้า InteractiveMap */}
              <Link
                to="/map"
                className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition duration-300"
              >
                เปิดแผนที่เลย
              </Link>
            </div>

            {/* ภาพแผนที่จริงที่คุณจะใส่ */}
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/images/แผนที่จริง.PNG"
                alt="แผนที่มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา พิษณุโลก"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ========== SECTION 3: เกี่ยวกับ ========== */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="min-h-screen bg-white snap-start py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
            เกี่ยวกับ RMUTL Map
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">Map</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">แม่นยำ</h3>
              <p className="text-gray-600">ข้อมูลอาคารและพิกัดที่อัปเดตทุกปี</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">Arrow</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">ใช้งานง่าย</h3>
              <p className="text-gray-600">ออกแบบมาเพื่อทุกคน ไม่ว่าจะใช้ครั้งแรก</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">Mobile</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">รองรับมือถือ</h3>
              <p className="text-gray-600">ใช้งานได้ทั้งคอมและโทรศัพท์</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700">
              พัฒนาโดย <strong>นักศึกษาภาควิชาเทคโนโลยีสารสนเทศ</strong><br />
              วิทยาเขตพิษณุโลก มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา
            </p>
          </div>
        </div>
      </motion.section>

      {/* ========== SECTION 4: ติดต่อเรา ========== */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white snap-start py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            ติดต่อเรา
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-semibold mb-6">ส่งข้อความถึงเรา</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="email"
                  placeholder="อีเมล"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <textarea
                  rows="4"
                  placeholder="ข้อความของคุณ"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                ></textarea>
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-300">
                  ส่งข้อความ
                </button>
              </form>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">ข้อมูลติดต่อ</h3>
              <div className="space-y-4 text-lg">
                <p className="flex items-center">
                  <span className="mr-3">Email</span> map@rmutl.ac.th
                </p>
                <p className="flex items-center">
                  <span className="mr-3">Phone</span> 055-XXXXXX
                </p>
                <p className="flex items-center">
                  <span className="mr-3">Address</span>
                  129 หมู่ 9 ต.ในเมือง อ.เมือง จ.พิษณุโลก 65000
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm opacity-80">
                  ติดต่อได้ทุกวันจันทร์ - ศุกร์ เวลา 08:30 - 16:30 น.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ========== FOOTER ========== */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 text-white py-12 px-6 snap-start"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-4">
            © 2025 RMUTL Map. พัฒนาโดย ภาควิชาเทคโนโลยีสารสนเทศ
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-blue-400 transition">เงื่อนไขการใช้งาน</a>
            <a href="#" className="hover:text-blue-400 transition">ติดต่อเรา</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;