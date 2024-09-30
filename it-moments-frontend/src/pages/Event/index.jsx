export default function Event() {
    const events = [
        {
            name: "Hội thảo Công nghệ 2024",
            date: "25 tháng 10, 2024",
            image: "https://via.placeholder.com/150",
            description: "Hội thảo về các xu hướng mới nhất trong công nghệ và chuyển đổi số."
        },
        {
            name: "Sự kiện Kết nối Doanh nghiệp",
            date: "10 tháng 11, 2024",
            image: "https://via.placeholder.com/150",
            description: "Cơ hội gặp gỡ và giao lưu giữa các doanh nghiệp khởi nghiệp và nhà đầu tư."
        },
        {
            name: "Workshop Thiết kế UI/UX",
            date: "5 tháng 12, 2024",
            image: "https://via.placeholder.com/150",
            description: "Khóa học chuyên sâu về thiết kế giao diện và trải nghiệm người dùng."
        },
        {
            name: "Triển lãm Sản phẩm Sáng tạo",
            date: "20 tháng 12, 2024",
            image: "https://via.placeholder.com/150",
            description: "Triển lãm các sản phẩm sáng tạo từ các doanh nghiệp hàng đầu."
        },
        {
            name: "Chương trình Đào tạo Lãnh đạo",
            date: "15 tháng 1, 2025",
            image: "https://via.placeholder.com/150",
            description: "Khóa đào tạo giúp các nhà lãnh đạo tương lai phát triển kỹ năng quản lý."
        },
        {
            name: "Ngày hội Khởi nghiệp",
            date: "28 tháng 2, 2025",
            image: "https://via.placeholder.com/150",
            description: "Sự kiện tôn vinh và hỗ trợ các dự án khởi nghiệp sáng tạo."
        }
    ];

    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex items-center justify-center py-12">
            <div className="container mx-auto px-6 py-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Danh Sách Sự Kiện</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Dưới đây là các sự kiện sắp tới của chúng tôi, bạn có thể chọn tham dự để tìm hiểu và kết nối với các chuyên gia trong ngành.
                </p>

                {/* Hiển thị các sự kiện theo dạng lưới 3 cột */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl">
                            <img
                                src={event.image}
                                alt={event.name}
                                className="rounded-lg w-full h-32 object-cover mb-4 shadow-md"
                            />
                            <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                            <p className="text-gray-600">{event.date}</p>
                            <p className="text-gray-500 mt-2">{event.description}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a
                        href="/contact"
                        className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Liên hệ với chúng tôi
                    </a>
                </div>
            </div>
        </div>
    );
}
