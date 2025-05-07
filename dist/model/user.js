import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});
const User = model("User", UserSchema);
export default User;
