import React from "react";
// start from below
import Select from "react-select";

const option = [
    { value: "China", label: "China" },
    { value: "Japan", label: "Japan" },
    { value: "Canada", label: "Canada" },
    { value: "Germany", label: "Germany" }
]

export default function selectDiv() {
    return <div>
        <Select options={option}
            isClearable
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            isSearchable
            name="color"
            menuShouldScrollIntoView={false} />
    </div>

}
