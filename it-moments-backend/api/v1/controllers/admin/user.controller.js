import md5 from 'md5';
import User from '../../models/user.model.js';
import Role from '../../models/role.model.js'
const controller = {
    /* [GET] api/v1/users */
    index: async (req, res) => {
        let find = {
            deleted: false,
        };

        const records = await User.find(find).select("-password -token");

        for(const record of records) {
            const role = await Role.findOne({
                _id: record.role_id,
                deleted: false
            });
            record.role = role;
        }
        res.json({
            success: true,
            data: records,
            message: "Lấy danh sách người dùng thành công"
        });

    },

};

export default controller;
