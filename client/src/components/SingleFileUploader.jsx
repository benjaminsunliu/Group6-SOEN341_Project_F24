/* 
    I followed this tutorial: https://uploadcare.com/blog/how-to-upload-file-in-react/
    to set up the uploader!
*/
import "./css/SingleFileUploader.css";
import Button from "./Button";
import { useState } from "react";

const SingleFileUploader = (props) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        // Check that the event target has files
        if (e.target.files) {
            const uploaded = e.target.files[0];

            // Check that the file is of the right type
            if(uploaded && uploaded.name.endsWith(props.fileExtension)) {
                setFile(e.target.files[0]);
            }
            else {
                alert(`Please upload a ${props.fileExtension} file.`);
                setFile(null);
            }
        }
    };

    // Wrapper function for form submission handler
    const handleFileSubmit = () => {
        if (file) {
            props.fileSubmitHandler(file);
        }
    };

    return (
        <div className="upload-form">
            <h3>Upload {props.fileDescription}</h3>
            <p>Must be a {props.fileExtension} file</p>
            <div>
                <input id="file" type="file" onChange={handleFileChange} />
            </div>
            {file && (
            <section>
                File details:
                <ul>
                <li>Name: {file.name}</li>
                <li>Type: {file.type}</li>
                <li>Size: {file.size} bytes</li>
                </ul>
            </section>
            )}

            {file && (
                <Button buttonText="Upload" buttonColor="btn btn-secondary" onClick={handleFileSubmit}/>
            )}
        </div>
    );
};

export default SingleFileUploader;
