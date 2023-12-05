import EditHeader from "../components/layout/header/EditPageHeader";
import EditMain from "../components/editor/EditPosting";
import { useState } from "react";

function EditPage() {
    const [isPublished, setIsPublished] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");
    return (
        <>
            <EditHeader
                setIsPublished={setIsPublished}
                saveStatus={saveStatus}
            />
            <EditMain 
                isPublished={isPublished}
                setSaveStatus={setSaveStatus}
            />
        </>
    );
}

export default EditPage;
