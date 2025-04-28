import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  mal_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  title_english: { type: String },
  title_japanese: { type: String },
  type: { type: String },
  source: { type: String },
  episodes: { type: Number },
  status: { type: String },
  airing: { type: Boolean },
  aired: { type: Object },  
  duration: { type: String },
  rating: { type: String },
  score: { type: Number },
  scored_by: { type: Number },
  rank: { type: Number },
  popularity: { type: Number },
  synopsis: { type: String },
  genres: [{ type: String }],  
  studios: [{ type: String }],  
  producers: [{ type: String }], 
  licensors: [{ type: String }], 
  image_url: { type: String },
  url: { type: String },
  episodes_data: [{ type: Object }], 
  stream_links: [{  
    name: { type: String }, 
    url: { type: String }   
  }],
}, { timestamps: true });

const Anime = mongoose.models.Anime || mongoose.model('Anime', animeSchema);

export default Anime;
