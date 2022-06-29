import React, { useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./TestFirebase.scss";

export default function TestFirebase() {
  const [file, setFiles] = useState("");
  const [url, setUrl] = useState("");
  const [per, setPer] = useState(null);
  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPer(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setUrl(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleImage = (e) => {
    e.preventDefault();
    setFiles(e.target.files[0]);
    console.log("images", file);
  };
  const handleSubmit = () => {
    console.log("url", url);
  };

  return (
    <div>
      <div className="form">
        <label>Files</label>
        <input
          className="files"
          type="file"
          multiple
          onChange={(e) => {
            handleImage(e);
          }}
        />
        <button
          className="submit"
          type="submit"
          disabled={per !== null && per < 100}
          onClick={() => handleSubmit()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
