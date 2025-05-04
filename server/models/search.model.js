import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    query: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      enum: ['images', 'audio'],
      default: 'images'
    },
    filters: {
      type: Object,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Search = mongoose.model("Search", searchSchema);

export default Search;