import mongoose from 'mongoose';
import "./FileOutput"; 

const agentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Corporate Registry Agent",
            "Financial Data Agent",
            "Web Research Media Agent"],
        required: true
    },
    company: { type: String, required: true },
    country: { type: String }, // Only for corporate & web
    status: {
        type: String,
        enum: ["Processing", "Completed"],
        default: "Processing"
    },
    fromDate: { type: Date },
    toDate: { type: Date },
    request_time: { type: Date, default: Date.now },
    response_time: { type: Date, default: null }, // Updated when output is received
    source_url: { type: String }, // Only for corporate
    source_doc_link: { type: String }, // Only for finance
    file_output: { type: mongoose.Schema.Types.ObjectId, ref: "FileOutput", default: null },
    researchFocus: {
        type: [String],                               // Array of strings to allow multiple selections
        enum: ["News & Media", "Market Reports", "Social Sentiment", "Competitor Analysis"],
        default: []
    },
    keyword: { type: String }
});

const AgentRegistry = mongoose.model("Agent", agentSchema);

export default AgentRegistry;
