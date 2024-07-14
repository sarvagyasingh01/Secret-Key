const session = require('express-session');
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    _id: String,
    session: mongoose.Schema.Types.Mixed,
    expires: Date
});

const SessionModel = mongoose.model('Session', SessionSchema);

class CustomStore extends session.Store {
    constructor(options) {
        super(options);
        this.sessionModel = SessionModel;
    }

    async get(sid, callback) {
        try {
            const session = await this.sessionModel.findById(sid);
            callback(null, session ? session.session : null);
        } catch (err) {
            callback(err);
        }
    }

    async set(sid, session, callback) {
        try {
            await this.sessionModel.updateOne(
                { _id: sid },
                { _id: sid, session, expires: session.cookie.expires },
                { upsert: true }
            );
            callback(null);
        } catch (err) {
            callback(err);
        }
    }

    async destroy(sid, callback) {
        try {
            await this.sessionModel.deleteOne({ _id: sid });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }
}

module.exports = CustomStore;
