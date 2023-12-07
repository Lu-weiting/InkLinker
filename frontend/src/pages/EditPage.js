import EditHeader from "../components/layout/header/EditPageHeader";
import EditMain from "../components/editor/EditPosting";
import { useState } from "react";

function EditPage() {
    const [isPublished, setIsPublished] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");
    const [tags, setTags] = useState([]);
    return (
        <>
            <EditHeader
                setIsPublished={setIsPublished}
                saveStatus={saveStatus}
                setTags={setTags}
            />
            <EditMain 
                isPublished={isPublished}
                setSaveStatus={setSaveStatus}
                tags={tags}
            />
        </>
    );
}

export default EditPage;
