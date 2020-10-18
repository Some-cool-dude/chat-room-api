const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const messageSchema = new mongoose.Schema({
    email: {
        type: String, unique: true, lowercase: true, required: true, 
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    text: {type: String, maxlength: 100, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

messageSchema.plugin(uniqueValidator);

messageSchema.pre('updateOne', function() {
    this.set({ updatedAt: Date.now() });
});

messageSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: Date.now() });
});

messageSchema.statics.insert = function (obj) {
    const video = new Message(obj);
    return video.save();
};

messageSchema.statics.getPaged = function (page, quantityOnPage) {
    return this.find({}).skip(quantityOnPage * page).limit(quantityOnPage).exec();
}

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;