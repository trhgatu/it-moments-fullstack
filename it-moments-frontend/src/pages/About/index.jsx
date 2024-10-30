import React, { useEffect } from 'react';
import { ArrowRight, Users, Target, Eye, BookOpen, Award, ArrowLeft } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import slide1 from '../../assets/images/slider_1.jpg';
import slide2 from '../../assets/images/slider_2.jpg';
import slide3 from '../../assets/images/slider_3.jpg';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
      offset: 100,
    });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const highlights = [
    {
      icon: BookOpen,
      title: "Chương trình đào tạo",
      description: "Chương trình học hiện đại, cập nhật theo xu hướng công nghệ mới nhất"
    },
    {
      icon: Users,
      title: "Đội ngũ giảng viên",
      description: "Giảng viên có trình độ cao, nhiều kinh nghiệm thực tiễn"
    },
    {
      icon: Target,
      title: "Cơ hội việc làm",
      description: "Kết nối trực tiếp với doanh nghiệp, tỷ lệ việc làm cao"
    },
    {
      icon: Award,
      title: "Môi trường học tập",
      description: "Cơ sở vật chất hiện đại, không gian sáng tạo"
    }
  ];

  const teamMembers = [
    {
      image: "https://via.placeholder.com/150",
      name: "Trần Hoàng Anh Tú",
      role: "Nhóm Trưởng",
      description: "Chuyên gia về phát triển web và quản lý dự án",
      social: {
        email: "tu.than@example.com",
      }
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Nguyễn Quốc Thái",
      role: "Thành Viên",
      description: "Chuyên gia về UI/UX và front-end development",
      social: {
        email: "thai.nguyen@example.com",
      }
    },
    {
      image: "https://via.placeholder.com/150",
      name: "Phạm Minh Tấn",
      role: "Thành Viên",
      description: "Chuyên gia về back-end và cơ sở dữ liệu",
      social: {
        email: "tan.pham@example.com",
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-80" />
        <img
          src={slide1}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      <div className="relative container mx-auto px-6 h-full flex items-center justify-end">
    <div className="max-w-2xl text-white" data-aos="fade-right">
        <h1 className="text-6xl font-bold mb-6">Khoa Công Nghệ Thông Tin</h1>
        <p className="text-xl mb-8 opacity-90">
        Đào tạo những nhà lãnh đạo công nghệ tương lai, thúc đẩy đổi mới và sáng tạo trong kỷ nguyên số.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 group absolute right-0">
            <ArrowLeft className="w-5 h-5 transform -translate-x-1 group-hover:translate-x-0 transition-transform" />
            Tìm hiểu thêm
        </button>

    </div>
</div>

      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 -mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <item.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Content */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <img
              src={slide2}
              alt="About"
              className="rounded-xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>
          <div data-aos="fade-left" className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800">Về Khoa Công Nghệ Thông Tin</h2>
            <p className="text-gray-600 leading-relaxed">
              Khoa Công Nghệ Thông Tin tại Trường Đại học Công thương TP.HCM tự hào là một trong những khoa hàng đầu trong lĩnh vực đào tạo CNTT.
              Với đội ngũ giảng viên nhiệt huyết và chương trình đào tạo tiên tiến, chúng tôi cam kết mang đến môi trường học tập tốt nhất cho sinh viên.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg" data-aos="fade-up">
                <Target className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sứ Mệnh</h3>
                <p className="text-gray-600">
                  Đào tạo nguồn nhân lực chất lượng cao, đáp ứng nhu cầu xã hội trong thời đại số.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg" data-aos="fade-up">
                <Eye className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tầm Nhìn</h3>
                <p className="text-gray-600">
                  Trở thành đơn vị đào tạo CNTT hàng đầu tại Việt Nam và khu vực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-[400px] overflow-hidden my-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90" />
        <img
          src={slide3}
          alt="Parallax background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative container mx-auto px-6 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl text-white" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-6">Đào Tạo Chất Lượng Cao</h2>
            <p className="text-xl opacity-90">
              Chúng tôi cam kết đào tạo sinh viên thành những chuyên gia công nghệ hàng đầu,
              sẵn sàng đáp ứng nhu cầu của thị trường lao động trong kỷ nguyên số.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Thành Viên Thực Hiện</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đội ngũ tài năng và đầy nhiệt huyết của chúng tôi luôn sẵn sàng đồng hành cùng bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
              <img src={member.image} alt={member.name} className="rounded-full w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center">{member.name}</h3>
              <p className="text-gray-600 text-center">{member.role}</p>
              <p className="text-gray-500 text-center mb-4">{member.description}</p>
              <a href={`mailto:${member.social.email}`} className="text-blue-600 text-center block">
                {member.social.email}
              </a>
            </div>
          ))}
        </div>
      </section>
      {/* Có thể xóa section*/}
      <section className="container mx-auto px-6 py-20">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng để bắt đầu hành trình của bạn?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Khám phá các chương trình đào tạo và cơ hội học tập tại Khoa Công Nghệ Thông Tin
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
            Liên hệ ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
