import mongoose from "mongoose";

const { Schema } = mongoose;

const animeContentSchema = new Schema({
  title: String,
  image: String,
  slug: String,
  content: String,
  contentLinkData: [
    {
    episodeNo: Number,
      category: String,
      downloadLink: String,
      downloadableLinks: [
        {
          name: String,
          link: String
        }
      ]
    }
  ],
  imdbDetails: {
    imdbName: String,
    imdbPosterLink: [
      {
        url: String,
        width: String,
      },
    ],
    imdbRating: {
      rawRating: String,
      rating: String,
      votes: String,
    },
    imdbGenres: String,
    imdbMoreDetails: [
      {
        detailKey: String,
        detailValue: String,
      },
    ],
  },
  updateData: String,
  releaseYear: String,
  releaseDate: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Anime_Contents =
  mongoose.models.anime_contents || mongoose.model("anime_contents", animeContentSchema);
