import { Ticket, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Cinema Connect",
      links: [
        { name: "Về chúng tôi", href: "/about" },
        { name: "Liên hệ", href: "/contact" },
        { name: "Tuyển dụng", href: "/careers" },
        { name: "Tin tức", href: "/news" }
      ]
    },
    {
      title: "Dịch vụ",
      links: [
        { name: "Đặt vé online", href: "/booking" },
        { name: "Lịch chiếu phim", href: "/showtimes" },
        { name: "Rạp chiếu phim", href: "/theaters" },
        { name: "Khuyến mãi", href: "/promotions" }
      ]
    },
    {
      title: "Hỗ trợ",
      links: [
        { name: "Hướng dẫn đặt vé", href: "/help/booking" },
        { name: "Chính sách hoàn tiền", href: "/help/refund" },
        { name: "Câu hỏi thường gặp", href: "/help/faq" },
        { name: "Điều khoản sử dụng", href: "/terms" }
      ]
    },
    {
      title: "Đối tác",
      links: [
        { name: "CGV Cinemas", href: "/partners/cgv" },
        { name: "Galaxy Cinema", href: "/partners/galaxy" },
        { name: "Lotte Cinema", href: "/partners/lotte" },
        { name: "BHD Star", href: "/partners/bhd" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/cinemaconnect" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/cinemaconnect" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/cinemaconnect" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/cinemaconnect" }
  ];

  const contactInfo = [
    { icon: Phone, text: "Hotline: 1900 6000", href: "tel:19006000" },
    { icon: Mail, text: "Email: support@cinemaconnect.vn", href: "mailto:support@cinemaconnect.vn" },
    { icon: MapPin, text: "Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM", href: "#" }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Ticket size={32} className="text-orange-400" />
              <span className="text-xl font-bold text-white">Cinema Connect</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Nền tảng đặt vé xem phim hàng đầu Việt Nam. Trải nghiệm điện ảnh tuyệt vời với hàng ngàn bộ phim hay và dịch vụ chuyên nghiệp.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-400 hover:text-orange-400 transition-colors"
                >
                  <item.icon size={16} />
                  <span className="text-sm">{item.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Theo dõi chúng tôi:</span>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm whitespace-nowrap">Đăng ký nhận tin:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-0"
                />
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg transition-colors">
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cinema Brands */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h4 className="text-white font-semibold mb-4 text-center">Đối tác rạp chiếu phim</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 text-sm font-medium">CGV</div>
            <div className="text-gray-400 text-sm font-medium">Galaxy Cinema</div>
            <div className="text-gray-400 text-sm font-medium">Lotte Cinema</div>
            <div className="text-gray-400 text-sm font-medium">BHD Star</div>
            <div className="text-gray-400 text-sm font-medium">Beta Cinemas</div>
            <div className="text-gray-400 text-sm font-medium">Cinestar</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Cinema Connect. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">
                Điều khoản dịch vụ
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-orange-400 transition-colors">
                Chính sách Cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;