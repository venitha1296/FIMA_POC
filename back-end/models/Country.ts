import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "United States"
    code: { type: String, unique: true }, // e.g., "US"
});

const Country = mongoose.model("Country", countrySchema);

export default Country;
