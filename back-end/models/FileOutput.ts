import mongoose from 'mongoose';

const fileOutputSchema = new mongoose.Schema({
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    generated_at: { type: Date, default: Date.now },
    source: { type: String }
});

const FileOutput = mongoose.model("FileOutput", fileOutputSchema);

export default FileOutput;
