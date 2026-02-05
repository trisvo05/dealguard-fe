import React from 'react';
import {
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Building2,
  Scale,
  Clock,
  AlertTriangle,
  FileText,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { LoginButton } from '@/components/LoginButton';

export default function DealGuardLanding() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#003366] selection:text-white">

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#003366] p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#003366] tracking-tight">DealGuard</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#problems" className="hover:text-[#003366] transition-colors">Vấn đề</a>
            <a href="#solution" className="hover:text-[#003366] transition-colors">Giải pháp</a>
            <a href="#how-it-works" className="hover:text-[#003366] transition-colors">Quy trình</a>
            <Link href="/dashboard" className="hover:text-[#003366] transition-colors">Dashboard</Link>
          </nav>

          <LoginButton />
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 h-100vh overflow-hidden mt-[calc(-50px)] relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#003366] text-xs font-bold uppercase tracking-wider border border-blue-100">
                <Lock className="w-3 h-3" /> Nền tảng Escrow B2B On-chain
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#003366] leading-[1.15]">
                Bảo vệ dòng vốn, <br />
                <span className="text-blue-600">Xóa bỏ rủi ro</span> pháp lý.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Thay thế quy trình xử lý tranh chấp cồng kềnh bằng Smart Contract. Tiền chỉ được giải ngân khi điều kiện nghiệm thu thực tế được thỏa mãn.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2">
                  Tạo giao dịch đảm bảo <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white border border-slate-300 hover:border-[#003366] text-slate-700 hover:text-[#003366] px-8 py-4 rounded-lg font-bold text-base transition-all flex justify-center items-center">
                  Xem Demo
                </button>
              </div>

              <div className="pt-6 flex items-center gap-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Minh bạch 100%
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Tự động hóa
                </div>
              </div>
            </div>

            {/* Right Content - Trust/Fintech UI Mockup */}
            <div className="lg:w-1/2 w-full relative">
              {/* Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

              {/* Main Card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 relative z-10 max-w-md mx-auto">
                {/* Header: Smart Contract Info */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-blue-100 text-[#003366] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Mainnet
                      </span>
                      <p className="text-xs text-slate-500 font-mono">0x7a1b...4f21</p>
                    </div>
                    <h3 className="text-[#003366] font-bold text-lg">Cung ứng thiết bị IoT - GĐ 1</h3>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                    <Lock className="w-3.5 h-3.5" />
                    Escrow Secured
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Value Section: Stablecoin Focus */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Shield className="w-12 h-12 text-[#003366]" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Tổng giá trị ký quỹ (TVL)</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl md:text-4xl font-bold text-[#003366] tracking-tight">
                        100.000
                      </p>
                      <span className="text-lg text-blue-600 font-bold">USDT</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium italic">
                      ≈ 2.540.000.000 VND (Oracle by Chainlink)
                    </p>
                  </div>

                  {/* Milestone Section: Proof of Work */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-slate-700">Milestone: 03/04</span>
                      <span className="text-xs font-bold py-1 px-2 bg-blue-50 text-blue-700 rounded-md">
                        Đang thẩm định
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full w-3/4 animate-pulse-slow"></div>
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Deposit
                      </span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> MS 1
                      </span>
                      <span className="text-[#003366] flex items-center gap-1 border-b-2 border-[#003366]">
                        MS 2
                      </span>
                      <span>Release</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Web3 Interactions */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button className="bg-white border border-red-200 text-red-500 text-sm font-bold py-3 rounded-lg hover:bg-red-50 transition-colors flex justify-center items-center gap-2">
                    <Scale className="w-4 h-4" /> Khiếu nại (Dispute)
                  </button>
                  <button className="bg-[#003366] text-white text-sm font-bold py-3 rounded-lg hover:bg-[#002244] shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center gap-2">
                    Phê duyệt giải ngân
                  </button>
                </div>

                {/* Footer Card: Trust Signal */}
                <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Hợp đồng được bảo mật bởi DealGuard Protocol
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section id="problems" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#003366] mb-4">Pháp lý truyền thống là chưa đủ</h2>
            <p className="text-slate-600 text-lg">
              Khi tranh chấp xảy ra, hợp đồng giấy chỉ là công cụ giải quyết hậu quả. <br className="hidden md:block" />
              Doanh nghiệp chịu thiệt hại lớn về dòng tiền và chi phí cơ hội.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Sai lệch */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-3">Sai lệch nghiệm thu</h3>
              <p className="text-slate-600 leading-relaxed">
                Hàng hóa không đúng quy chuẩn kỹ thuật nhưng tiền cọc đã chuyển. Việc thu hồi vốn trở nên bất khả thi.
              </p>
            </div>

            {/* Card 2: Tiến độ */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-3">Vi phạm tiến độ</h3>
              <p className="text-slate-600 leading-relaxed">
                Chậm trễ bàn giao các cột mốc (milestones) nhưng không có cơ chế phạt tức thời, dự án bị đình trệ.
              </p>
            </div>

            {/* Card 3: Thanh toán */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-yellow-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#003366] mb-3">Tranh chấp thanh toán</h3>
              <p className="text-slate-600 leading-relaxed">
                Người mua trì hoãn giải ngân dù điều kiện hoàn thành, khiến dòng vốn doanh nghiệp bị đóng băng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTION SECTION --- */}
      <section id="solution" className="py-24 bg-[#003366] text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
                Chuyển từ "Đối đầu pháp lý" sang <span className="text-blue-300">"Tuân thủ kỹ thuật"</span>
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed opacity-90">
                DealGuard sử dụng Smart Contract để đóng băng rủi ro. Tiền và Hàng hóa/Dịch vụ được trao đổi đồng thời dựa trên các điều kiện đã lập trình sẵn, không phụ thuộc vào ý chí chủ quan.
              </p>

              <ul className="space-y-5">
                {[
                  "Ký quỹ an toàn (Secure Deposit): Tiền được lock trên Blockchain.",
                  "Giải ngân theo cột mốc (Milestone-based release).",
                  "Giải quyết tranh chấp phi tập trung (nếu cần)."
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-slate-100 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-10 bg-white text-[#003366] px-8 py-3.5 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
                Tìm hiểu công nghệ <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="md:w-1/2 grid gap-6">
              <div className="bg-[#004488]/30 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/30 transition-colors">
                <Building2 className="w-10 h-10 text-blue-300 mb-4" />
                <h4 className="font-bold text-xl mb-2">Cho Người Mua (Buyer)</h4>
                <p className="text-sm text-blue-100 opacity-80">Chỉ trả tiền khi nhận được kết quả đúng cam kết. Không lo mất cọc.</p>
              </div>
              <div className="bg-[#004488]/30 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/30 transition-colors">
                <Wallet className="w-10 h-10 text-blue-300 mb-4" />
                <h4 className="font-bold text-xl mb-2">Cho Người Bán (Seller)</h4>
                <p className="text-sm text-blue-100 opacity-80">Đảm bảo nhận được tiền ngay khi hoàn thành công việc. Không bị nợ xấu.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#003366]">Quy trình hoạt động</h2>
            <p className="text-slate-600 mt-4">Đơn giản hóa quy trình phức tạp thành 4 bước minh bạch</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Line connector for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 z-0"></div>

            {[
              { step: "01", title: "Thỏa thuận", desc: "Tạo hợp đồng thông minh với các điều khoản và milestone cụ thể." },
              { step: "02", title: "Ký quỹ", desc: "Người mua gửi tiền (Stablecoin/Fiat) vào Smart Contract an toàn." },
              { step: "03", title: "Thực thi", desc: "Người bán thực hiện công việc và update bằng chứng lên chuỗi." },
              { step: "04", title: "Hoàn tất", desc: "Tiền tự động chuyển về ví người bán khi điều kiện thỏa mãn." },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 pt-8 rounded-xl shadow-sm border border-slate-200 relative z-10 group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-[#003366] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-md mx-auto md:mx-0 ring-4 ring-white">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-[#003366] mb-3 text-center md:text-left">{item.title}</h4>
                <p className="text-sm text-slate-600 text-center md:text-left leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#003366] rounded-2xl p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">

            {/* Abstract Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/3"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Đừng để rủi ro thanh toán cản trở doanh nghiệp
              </h2>
              <p className="text-blue-100 mb-10 text-lg">
                Tham gia cùng các doanh nghiệp tiên phong sử dụng DealGuard để bảo vệ dòng vốn ngay hôm nay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#003366] px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg">
                  Bắt đầu miễn phí
                </button>
                <button className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-lg font-bold text-white">DealGuard</span>
            </div>

            <div className="flex gap-8 font-medium">
              <a href="#" className="hover:text-white transition-colors">Về chúng tôi</a>
              <a href="#" className="hover:text-white transition-colors">Tài liệu API</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            </div>

            <div className="text-slate-500">
              &copy; 2024 DealGuard Protocol.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}