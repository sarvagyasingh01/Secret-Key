const mongoose = require("mongoose")

const docSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    site: {
        type: String,
        req: [true, "Please add a site name"],
    },
    username: {
        type: String,
        required: true,
        default: "NA"
    },
    password: {
        type: String,
        required: true,
    }
});

const Document = mongoose.model("Document", docSchema);
module.exports = Document;