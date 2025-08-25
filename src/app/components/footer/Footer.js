"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="w-full bg-gradient-to-r from-pink-50 to-rose-100 border-t mt-12"
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeOut" },
        },
      }}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Logo & mô tả */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center mb-4">
              <img
                src="/images/logo.png"
                alt="Lullaby"
                className="h-12 w-12 mr-2 bg-transparent"
              />
              <span className="text-2xl font-bold text-[#2d3a4e] tracking-wide">
                Lullaby
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4 max-w-md">
              Cung cấp tình yêu thương, sự ấm áp và dịch vụ tận tâm để mang đến
              cho người cao tuổi một gia đình thực sự.
              <br />
              <br />
              Để biết thêm chi tiết, vui lòng liên hệ qua các liên kết bên dưới.
            </p>
            <div className="flex space-x-4 mt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-800 hover:text-blue-600 transition-colors"
              >
                <svg
                  width="28"
                  height="28"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-800 hover:text-blue-600 transition-colors"
              >
                <svg
                  width="28"
                  height="28"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Các Gói */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">Các Gói</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a
                  href="/services"
                  className="hover:text-pink-600 transition-colors"
                >
                  Chăm sóc tại nhà
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="hover:text-pink-600 transition-colors"
                >
                  Điều dưỡng tại nhà
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="hover:text-pink-600 transition-colors"
                >
                  Liệu pháp tại nhà
                </a>
              </li>
            </ul>
          </div>

          {/* Chăm sóc Pro */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Chăm sóc Pro
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a
                  href="/team"
                  className="hover:text-pink-600 transition-colors"
                >
                  Chuyên làm y tá
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  className="hover:text-pink-600 transition-colors"
                >
                  Chuyên gia trị liệu
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  className="hover:text-pink-600 transition-colors"
                >
                  Công việc chăm sóc
                </a>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">Kết nối</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <a
                  href="#"
                  className="hover:text-pink-600 transition-colors"
                >
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-pink-600 transition-colors"
                >
                  Nghề nghiệp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="text-center text-gray-600 text-sm mt-10 border-t pt-6">
          © {new Date().getFullYear()} United Software Solutions. Mọi quyền được
          bảo lưu.
        </div>
      </div>
    </motion.footer>
  );
}
