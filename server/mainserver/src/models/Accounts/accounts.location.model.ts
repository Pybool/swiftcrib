import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountLocationSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "account",
  },
  street: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: false,
    default: "",
  },
  state: {
    type: String,
    required: false,
    default: "Lagos",
  },
  country: {
    type: String,
    required: false,
    default: "Nigeria",
  },
});

const AccountLocation = mongoose.model(
  "AccountLocation",
  AccountLocationSchema
);
export default AccountLocation;
