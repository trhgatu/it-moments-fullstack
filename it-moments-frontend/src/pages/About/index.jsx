import React, { useEffect } from 'react';

import "aos/dist/aos.css"; // Nhập CSS AOS
import AOS from "aos";
import slide1 from '../../assets/images/slider_1.jpg';
import slide2 from '../../assets/images/slider_2.jpg';
import slide3 from '../../assets/images/slider_3.jpg';

const About = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Thời gian hiệu ứng
        });
    }, []);

    const teamMembers = [
        // Mảng dữ liệu về thành viên đội ngũ lãnh đạo
        {
            image: "https://via.placeholder.com/150",
            name: "Trần Hoàng Anh Tú",
            role: "Nhóm Trưởng",
            description: "",
        },
        {
            image: "https://via.placeholder.com/150",
            name: "Nguyễn Quốc Thái",
            role: "Thành Viên",
            description: "",
        },
        {
            image: "https://via.placeholder.com/150",
            name: "Phạm Minh Tấn",
            role: "Thành Viên",
            description: "",
        },
    ];

    return (
        <div className="mx-auto pt-24">
            <section className="flex flex-col md:flex-row my-5 mx-auto bg-white rounded-lg shadow-lg w-full">
                <img
                    src={slide3} // Thay đường dẫn ảnh ở đây
                    alt="Về Khoa"
                    className="w-full md:w-1/2 object-cover rounded-l-lg h-85" // Thay đổi chiều cao để tạo hình vuông
                    data-aos="fade-right"
                />
                <div className="p-5 w-full md:w-1/2 "> {/* Thêm đường viền bên trái */}
                    <h2 className="text-blue-600 text-3xl font-semibold">Về Khoa Công Nghệ Thông Tin</h2>
                    <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                        Khoa Công Nghệ Thông Tin tại Trường Đại học Công thương TP.HCM tự hào là một trong những khoa hàng đầu trong lĩnh vực đào tạo CNTT.
                        Với đội ngũ giảng viên nhiệt huyết và chương trình đào tạo tiên tiến, chúng tôi cam kết mang đến môi trường học tập tốt nhất cho sinh viên, giúp các bạn phát triển tối đa năng lực và sáng tạo.
                    </p>
                </div>
            </section>

            <section className="flex flex-col md:flex-row my-5 mx-auto bg-white rounded-lg shadow-lg w-full">
                <div className="p-5 w-full md:w-1/2 "> {/* Thêm đường viền bên phải */}
                    <h2 className="text-blue-600 text-3xl font-semibold">Sứ Mệnh</h2>
                    <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                        Sứ mệnh của chúng tôi là cung cấp nền giáo dục chất lượng cao, đào tạo ra các thế hệ kỹ sư CNTT có khả năng đổi mới và đóng góp tích cực cho xã hội.
                        Khoa luôn nỗ lực phát triển nghiên cứu khoa học, ứng dụng công nghệ để nâng cao chất lượng cuộc sống và thúc đẩy sự phát triển của đất nước.
                    </p>
                </div>
                <img
                    src={slide2} // Thay đường dẫn ảnh ở đây
                    alt="Sứ Mệnh"
                    className="w-full md:w-1/2 object-cover rounded-r-lg h-85" // Thay đổi chiều cao để tạo hình vuông
                    data-aos="fade-left"
                />
            </section>

            <section className="flex flex-col md:flex-row my-5 mx-auto bg-white rounded-lg shadow-lg w-full">
                <img
                    src={slide3} // Thay đường dẫn ảnh ở đây
                    alt="Tầm Nhìn"
                    className="w-full md:w-1/2 object-cover rounded-l-lg h-85" // Thay đổi chiều cao để tạo hình vuông
                    data-aos="fade-right"
                />
                <div className="p-5 w-full md:w-1/2 "> {/* Thêm đường viền bên trái */}
                    <h2 className="text-blue-600 text-3xl font-semibold">Tầm Nhìn</h2>
                    <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                        Tầm nhìn của Khoa là trở thành một trong những đơn vị đào tạo và nghiên cứu hàng đầu trong lĩnh vực Công Nghệ Thông Tin tại Việt Nam, góp phần xây dựng một hệ sinh thái CNTT phát triển bền vững.
                        Chúng tôi luôn hướng đến việc kết nối sinh viên với thực tiễn và nhu cầu của doanh nghiệp, giúp các bạn sẵn sàng hội nhập và thành công trong môi trường toàn cầu hóa.
                    </p>
                </div>
            </section>





            <section className="my-10 mx-auto p-10 bg-white rounded-lg shadow-lg w-full">
                <h2 className="text-center text-blue-600 text-3xl mb-4">Thành Viên Thực Hiện</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="rounded-full w-60 h-60 mx-auto mb-4 shadow-md" // Thay đổi kích thước ảnh ở đây
                            />
                            <h3 className="text-center text-2xl font-semibold text-gray-800">{member.name}</h3>
                            <p className="text-center text-lg text-gray-600">{member.role}</p>
                            <p className="text-center text-md text-gray-500 mt-4">{member.description}</p>
                        </div>
                    ))}
                </div>
            </section>



        </div>
    );
};

export default About;
