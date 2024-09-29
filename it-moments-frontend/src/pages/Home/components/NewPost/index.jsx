import slide1 from "../../../../assets/images/slider_1.jpg";
import { Link } from "react-router-dom";

export default function NewPost() {
    return (
        <div className="relative overflow-hidden block md:col-span-2">
            <div
                className="relative overflow-hidden min-h-full"
                style={{
                    backgroundImage: `url(${slide1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <span className="absolute bg-blue-500 text-white text-lg md:text-xl font-semibold px-6 py-1 left-5 top-5">Mới</span>

                <div className="absolute z-10 w-full bottom-0 px-4 md:px-11 h-72">
                    {/* Danh mục */}
                    <div className="mb-4 flex flex-wrap">
                        <Link className="text-white text-lg md:text-2xl uppercase hover:text-blue-600">Văn nghệ</Link>
                        <p className="text-white text-lg md:text-2xl ml-2 mr-2">/</p>
                        <p className="text-white text-lg md:text-2xl">28/9/24</p>
                    </div>

                    {/* Tiêu đề */}
                    <div className="mb-4">
                        <p className="text-xl md:text-4xl font-semibold text-white mt-2">
                            <Link to="/path-to-your-performances" className="hover:text-blue-500 transition-colors duration-300">
                                GALA Chào đón tân sinh viên K15: Tiết mục "Chúng ta của hiện tại"
                            </Link>
                        </p>
                    </div>

                    {/* Mô tả */}
                    <div className="w-full md:w-3/6 mt-4 mb-4">
                        <p className="text-lg md:text-2xl text-white font-normal">
                            Tiết mục đạt giải nhất trong sự kiện GALA Chào đón tân sinh viên k15...
                        </p>
                    </div>

                    {/* Thông tin người đăng và lượt xem */}
                    <div className="w-full pt-9">
                        <div className="flex justify-between text-white w-full font-normal">
                            <span>Admin</span>
                            <span>Views: 100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
