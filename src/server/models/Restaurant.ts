import { Schema, models, model } from "mongoose";

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // used in URLs: /r/demo-cafe
    logoUrl: String, // Cloudinary URL later
  },
  { timestamps: true }
);

// `models.X ??` prevents "OverwriteModelError" when Next.js hot-reloads this file
export const Restaurant = models.Restaurant ?? model("Restaurant", RestaurantSchema);