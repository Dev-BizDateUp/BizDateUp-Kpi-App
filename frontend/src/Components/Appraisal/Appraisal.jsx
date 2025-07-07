import { useState } from "react"
import Modal from "../Modal";
import AppraisalForm from "./AppraisalForm";

export default function Appraisal() {
    const [openModal, setOpen] = useState(false);
    return (
        <>
            <div className="bg-[#DDDDDD] p-3">
                <button
                    onClick={() => setOpen(true)}
                    className="text-xl bg-white text-black px-1.5 py-1.5 rounded-lg cursor-pointer"
                >
                    Add Employee Appraisal
                </button>
            </div>
            {
                openModal &&
                <Modal isOpen={openModal} onClose={() => setOpen(false)} title={'Add Employee Appraisal'}>
                    <AppraisalForm />
                </Modal>
            }

        </>
    )
}