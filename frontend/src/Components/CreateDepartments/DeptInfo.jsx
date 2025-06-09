import { useEffect, useState } from "react";
import { getEmployees } from "../../Api/Endpoints/endpoints";


function DeptInfo({know}){
    const [emps,setEmp] = useState([]);
    const [des,setDes] = useState([]);

    useEffect(_ => {
        async function getInfo() {
        }
        getInfo();
    },[])
}

export default DeptInfo;