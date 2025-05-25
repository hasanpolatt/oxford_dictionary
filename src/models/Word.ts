import mongoose, { Schema } from 'mongoose';

// Word schema
const WordSchema = new Schema({
  _id: String,
  word: { type: String, required: true, index: true },
  sourceLanguage: { type: String, required: true },
  type: { type: String, required: true },
  CEFR: { type: String, required: true },
  definition: { type: String, required: true },
  pronunciation: { type: String },
  examples: [{ type: String }],
  synonyms: [{ type: String }],
  translations: {
    tr: {
      word: { type: String },
      examples: [{ type: String }]
    }
  },
  note: { type: String, default: "" }
}, {
  timestamps: true
});

// If the Word model is already defined, use it, otherwise create a new model
const Word = mongoose.models.Word || mongoose.model('Word', WordSchema);

export default Word;
