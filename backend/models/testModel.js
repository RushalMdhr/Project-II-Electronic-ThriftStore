import mongoose from "mongoose";

const TestSchema = mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String
    },
    array : [{
        type : String,
    }]
})

const testModel = mongoose.model('Test', TestSchema);

export default testModel;