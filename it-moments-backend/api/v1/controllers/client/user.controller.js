
import User from '../../models/user.model.js';

const controller = {
    getUserInfo: async (req, res) => {
        try {
            const user = res.locals.user;
            if(!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const token = req.cookies.client_token;
            return res.status(200).json({ user, token });
        } catch(error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
        }
    },
    updateUserInfo: async (req, res) => {
        try {
            const { id } = req.params;
            const { bio, facebook, twitter, linkedin, youtube, instagram } = req.body;
            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            user.bio = bio ? bio : null;
            user.socialLinks.facebook = facebook ? facebook : null;
            user.socialLinks.twitter = twitter ? twitter : null;
            user.socialLinks.linkedin = linkedin ? linkedin : null;
            user.socialLinks.youtube = youtube ? youtube : null;
            user.socialLinks.instagram = instagram ? instagram : null;

            await user.save();

            return res.status(200).json({ message: "Thông tin đã được cập nhật thành công!" });
        } catch(error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật thông tin người dùng" });
        }
    }

};

export default controller;
