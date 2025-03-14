import mongoose from 'mongoose';

const fileOutputSchema = new mongoose.Schema({
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    source: { type: String }
}, { timestamps: true });

const FileOutput = mongoose.model("FileOutput", fileOutputSchema);

export default FileOutput;
