export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-gray-600">

                {/* BRAND */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        DealGuard
                    </h3>
                    <p className="mt-4 leading-relaxed">
                        Nền tảng escrow cho giao dịch B2B,
                        giúp bảo vệ dòng tiền và giảm rủi ro thanh toán.
                    </p>
                </div>

                {/* PRODUCT */}
                <div>
                    <h4 className="font-semibold text-gray-900">
                        Sản phẩm
                    </h4>
                    <ul className="mt-4 space-y-2">
                        <li>Escrow B2B</li>
                        <li>Thanh toán an toàn</li>
                        <li>Quản lý giao dịch</li>
                    </ul>
                </div>

                {/* USE CASE */}
                <div>
                    <h4 className="font-semibold text-gray-900">
                        Ứng dụng
                    </h4>
                    <ul className="mt-4 space-y-2">
                        <li>Phế liệu</li>
                        <li>Nông sản</li>
                        <li>Nguyên vật liệu</li>
                    </ul>
                </div>

                {/* LEGAL */}
                <div>
                    <h4 className="font-semibold text-gray-900">
                        Pháp lý
                    </h4>
                    <ul className="mt-4 space-y-2">
                        <li>Điều khoản sử dụng</li>
                        <li>Chính sách bảo mật</li>
                        <li>Miễn trừ trách nhiệm</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} DealGuard. All rights reserved.
            </div>
        </footer>
    );
}
