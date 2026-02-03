import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="text-xl font-bold tracking-tight">
                    DealGuard
                </Link>

                {/* NAV */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
                    <Link href="#cach-hoat-dong" className="hover:text-black">
                        Cách hoạt động
                    </Link>
                    <Link href="#ung-dung" className="hover:text-black">
                        Ứng dụng
                    </Link>
                    <Link href="/dashboard" className="hover:text-black">
                        Bảng điều khiển
                    </Link>
                </nav>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/escrow/new"
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition"
                    >
                        Tạo giao dịch
                    </Link>
                </div>
            </div>
        </header>
    );
}
