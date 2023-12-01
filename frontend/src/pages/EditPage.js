import EditHeader from "../components/layout/header/EditPageHeader";
import EditMain from "../components/editor/EditPosting";
import { useState } from "react";

function EditPage() {
    const [isPublished, setIsPublished] = useState(false);

    return (
        <>
            <EditHeader
                setIsPublished={setIsPublished}
            />
            <EditMain isPublished={isPublished}/>
        </>
    );
}

export default EditPage;
