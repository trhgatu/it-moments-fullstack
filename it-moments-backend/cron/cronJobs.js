import cron from 'node-cron';
import Event from '../api/v1/models/event.model.js';

//cron.schedule('*/1 * * * *', async () => {
    /* console.log('Cron job "Cập nhật sự kiện" đã được bắt đầu lúc:', new Date().toISOString());
    try {
        const now = new Date();
        const eventsToUpdate = await Event.find({
            endTime: { $lt: now },
            status: 'active',
            startTime: { $lte: now }
        });

        for(const event of eventsToUpdate) {
            event.status = 'completed';
            await event.save();
            console.log(`Sự kiện "${event.title}" đã được đóng lại và chuyển sang trạng thái "completed"`);
        }
    } catch(err) {
        console.error('Lỗi khi cập nhật sự kiện:', err);
    } */
//});

//ron.schedule('*/1 * * * *', async () => {
    /* console.log('Cron job "Kết thúc bình chọn" đã được bắt đầu lúc:', new Date().toISOString());
    try {
        const now = new Date();

        const eventsWithOpenVoting = await Event.find({
            votingEndTime: { $lt: now },
            votingStatus: 'active',
        });

        for(const event of eventsWithOpenVoting) {
            event.votingStatus = 'closed';
            await event.save();
            console.log(`Bình chọn cho sự kiện "${event.title}" đã kết thúc và chuyển sang trạng thái "closed"`);
        }
    } catch(err) {
        console.error('Lỗi khi đóng bình chọn:', err);
    } */
//});
//cron.schedule('*/1 * * * *', async () => {
    /* console.log('Cron job kích hoạt sự kiện đang chạy:', new Date().toISOString());
    try {
        const now = new Date();
        const eventsToActivate = await Event.find({
            startTime: { $lte: now },
            status: 'inactive',
        });

        for (const event of eventsToActivate) {
            event.status = 'active';
            await event.save();
            console.log(`Sự kiện "${event.title}" đã được kích hoạt.`);
        }
    } catch (err) {
        console.error('Lỗi khi kích hoạt sự kiện:', err);
    } */
//});

export default cron;
