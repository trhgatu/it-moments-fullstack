import React from 'react';

const About = () => {
    const teamMembers = [
        {
            name: "Nguyễn Văn A",
            role: "Giám đốc điều hành",
            image: "https://via.placeholder.com/150",
            description: "Nguyễn Văn A là người sáng lập và giám đốc điều hành của công ty. Anh có nhiều năm kinh nghiệm trong ngành và luôn nỗ lực mang lại giá trị cho khách hàng."
        },
        {
            name: "Trần Thị B",
            role: "Trưởng phòng Marketing",
            image: "https://via.placeholder.com/150",
            description: "Trần Thị B là trưởng phòng Marketing, phụ trách các chiến lược truyền thông và quảng bá sản phẩm."
        },
        {
            name: "Lê Văn C",
            role: "Kỹ sư phần mềm",
            image: "https://via.placeholder.com/150",
            description: "Lê Văn C là kỹ sư phần mềm, chịu trách nhiệm phát triển và bảo trì hệ thống công nghệ thông tin của công ty."
        },
        {
            name: "Phạm Thị D",
            role: "Nhà thiết kế",
            image: "https://via.placeholder.com/150",
            description: "Phạm Thị D là nhà thiết kế, tạo ra các sản phẩm với giao diện hấp dẫn và trải nghiệm người dùng tốt nhất."
        }
    ];

    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex items-center justify-center py-12">
            <div className="container mx-auto px-6 py-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">Về Chúng Tôi</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Chúng tôi là một công ty tận tâm cung cấp những sản phẩm và dịch vụ tốt nhất cho khách hàng của mình.
                    Được thành lập vào năm 2020, chúng tôi đã nỗ lực không ngừng để phát triển và mở rộng.
                </p>
                <div className="flex justify-center mb-6">
                    <img
                        src="https://via.placeholder.com/600x400"
                        alt="About Us"
                        className="rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-105"
                    />
                </div>
                <h2 className="text-4xl font-semibold text-gray-800 mb-4">Tầm Nhìn</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Tầm nhìn của chúng tôi là trở thành một trong những công ty hàng đầu trong lĩnh vực của chúng tôi,
                    mang lại giá trị cho khách hàng và cộng đồng.
                </p>
                <h2 className="text-4xl font-semibold text-gray-800 mb-4">Sứ Mệnh</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Sứ mệnh của chúng tôi là cung cấp sản phẩm và dịch vụ chất lượng cao, với cam kết về sự hài lòng
                    của khách hàng và sự phát triển bền vững.
                </p>
                <h2 className="text-4xl font-semibold text-gray-800 mb-4">Giá Trị Cốt Lõi</h2>
                <ul className="list-disc list-inside mb-6">
                    <li className="text-lg text-gray-600">Chất lượng</li>
                    <li className="text-lg text-gray-600">Tin cậy</li>
                    <li className="text-lg text-gray-600">Sáng tạo</li>
                    <li className="text-lg text-gray-600">Trách nhiệm xã hội</li>
                </ul>

                {/* Phần Nhóm của chúng tôi */}
                <h2 className="text-4xl font-semibold text-gray-800 mb-4">Nhóm của Chúng Tôi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
                            />
                            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                            <p className="text-gray-600">{member.role}</p>
                            <p className="text-gray-500 mt-2">{member.description}</p>
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
};

export default About;
