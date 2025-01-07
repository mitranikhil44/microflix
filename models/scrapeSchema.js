import mongoose from 'mongoose';

const { Schema } = mongoose; 

const contentSchema = new Schema({
    title: String,
    url: String,
    image: String,
    slug: String,
    content: String,
    classValues: String,
    contentSceens: [String],
    // downloadableLinksHtml: [String],
    imdbDetails: {
        imdbName: String,
        imdbPosterLink: [{
            url: String, 
            width: String,
        }], 
        imdbRating: {
            rawRating: String,
            rating: String,
            votes: String,
        },
        imdbGenres: String,
        imdbMoreDetails: [{
            detailKey: String,
            detailValue: String,
        }],
    },
    updateData: String,
    releaseYear: String,
    releaseDate: String,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


export const Contents =
    mongoose.models.contents ||
    mongoose.model("contents", contentSchema);
