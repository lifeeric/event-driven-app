/** @formata */

import mongoose from "mongoose";

interface IPosts extends mongoose.Document {
  title: string;
  content: string;
}

const postSchma = new mongoose.Schema<IPosts>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const PostModel =
  mongoose.models.Post || mongoose.model<IPosts>("Post", postSchma);

export default PostModel;
