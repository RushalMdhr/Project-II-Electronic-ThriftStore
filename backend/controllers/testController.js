import testModel from "../models/testModel.js"

const add_row = async (req, res) => {
    const { id, name } = req.body;
    const create = new testModel({ id, name })
    res.send(create)
    if (create) {
        create.save();
    }
    console.log(create);

}

const getFiltered = async (req, res) => {
    try {
        const pageSize = 2; 

        const page = Number(req.query.page) || 1;

        // console.log("dooom",req.query);
        console.log("dooom", page);

        // const keyword = req.query.y
        //     ? { name: { $regex: req.query.keyword, $options: "i" } }
        //     : {};

        const dbFilter = {
            name: req.body.name,
            id: { $ne: req.body.id } // exclude x === req.body.x
        };

        const count = await testModel.countDocuments(dbFilter);
        if (count) {
            const filtered = await testModel.find(dbFilter).skip((page - 1) * pageSize).limit(pageSize)
            res.send({
                count,
                filtered,
                page,
                pages: Math.ceil(count / pageSize),
                hasMore: page * pageSize < count
            })
        }
        else {
            res.send("keyword search error $Not Found")
        }


        // const allData = await testModel.find().limit(pageSize); // get everything

        // // filter only those not matching userId
        // const filtered = allData.filter(item => item.x != req.body.x);

        // res.send(filtered);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const testNull = async(req,res)=>{
    const anything = null;
    if(anything){
        console.log("if anything");
    }
    if(anything !== null ){
        console.log("if anything not null");
    }
    console.log("end");
    
}

const addWithForm = async (req, res) => {
    const { id, name, array } = req.field;
    res.send({ id, name, array });
    console.log({ id, name, array })
}

const showMessage = async(req,res)=>{
    // res.send("Backend message reached")
    // return res.status(404).send("Not Found")
    try {
        const message = "Hello from the backend!";
        return res.status(404).send(message)
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
    // return res.status(500).send("Internal Server Error")
}
export {
    add_row,
    testNull,
    getFiltered,
    addWithForm,
    showMessage
}