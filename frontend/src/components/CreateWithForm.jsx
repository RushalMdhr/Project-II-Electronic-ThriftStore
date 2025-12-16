import { useFormObjectMutation } from "../redux/api/ObjectsApiSlice";
const CreateWithForm = () => {
    // const [createWithForm] = useFormObjectMutation();

    const create = async()=>{
        const formdata = new FormData();
        formdata.append("id", "123");
        formdata.append("name", "Test Object");
        formdata.append("array", ["item1", "item2"]);
        console.log(formdata);
        createWithForm(formdata);
        // formdata.append("array", JSON.stringify(["item1", "item2"]));
        
    }
  return (
    <div>
      <button
      onClick={create}>Create</button>
    </div>
  )
}

export default CreateWithForm
