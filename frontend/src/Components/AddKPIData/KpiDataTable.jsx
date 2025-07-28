import { useEffect, useState } from "react";
import {
  getKpiVals_Employee,
  getKPIsForEmployee,
} from "../../Api/Endpoints/endpoints";
import Modal from "../Modal";
import AddKPIValueForm from "./AddKPIValueForm";
import { Link } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import EditKpiTargetModal from "../EditKpiTargetModal/EditKpiTargetModal";
import Spinner from "../Spinner";

function KpiDataTable({ emp, setInspect }) {
  const [kvals, setKvals] = useState([]);
  // This is Modal usestate
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  // This is Modal usestate

  const [addValModal, setAddValModal] = useState(false);
  const [selKpi, setSelKpi] = useState(null);
  const [showEditModal, setshowEditModal] = useState(false);
  const [rowdata, setrowdata] = useState("");
  useEffect(
    (_) => {
      (async () => {
        const kvs = await getKPIsForEmployee(emp.id);
        if (kvs.data.data) {
          setKvals(kvs.data.data);
        }
      })();
    },
    [emp]
  );

  function fIDtoStr(id) {
    if (id == 1) {
      return "Weekly";
    } else if (id == 2) {
      return "Monthly";
    } else if (id == 3) {
      return "Quarterly";
    } else {
      return "Yearly";
    }
  }

  const changeModalState = () => {
    setshowEditModal(true);
  };
  const checkid = (id) => {
    const filter = kvals.find((i) => i.id === id);
    setrowdata(filter);
  };

  return (
    <>
      {addValModal && (
        <Modal
          isOpen={addValModal}
          onClose={(_) => setAddValModal(false)}
          title={"Add Data To KPI "}
        >
          <AddKPIValueForm
            empID={emp.id}
            kpi={selKpi}
            onFormSubmit={(_) => setAddValModal(false)}
          />
        </Modal>
      )}
      <div className="flex flex-col w-full">
      {kvals.length === 0 && (
            <>
              <p className="text-center text-2xl capitalize text-red-800">
               No KPI For This Employee
              </p>
            </>
          )}
        <div className="min-w-full overflow-x-auto rounded-2xl shadow-lg flex flex-center justify-center justify-stretch">
          
          {kvals.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200 justify-stretch">
              <thead className="bg-[#2b2d5b] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                    KPI names
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                    Frequency
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                    Target
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium tracking-wide">
                    View Data
                  </th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {kvals.map((k, id) => (
                  <tr
                    key={k.id}
                    className="hover:bg-[#f7f7f7] transition-colors"
                  >
                    <td className="px-6 py-4">{k.id}</td>
                    <td className="px-6 py-4">{k.title}</td>
                    <td className="px-6 py-4">{fIDtoStr(k.frequency_id)}</td>
                    <td className="px-6 py-4">
                     
                      <button
                        className="p-3 shadow-lg hover:cursor-pointer rounded-xl"
                        onClick={(_) => {
                          setSelKpi(k);
                          setAddValModal(true);
                        }}
                      >
                        Add
                      </button>
                    </td>
                    <td className="px-6 py-4">{k.target ?? "None"}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={"" + k.id}
                        className="text-white bg-[#57DA33] p-2 px-7 hover:cursor-pointer rounded-lg"
                        onClick={(_) => setInspect(k)}
                      >
                        View
                      </Link>
                    </td>
                    <td className="cursor-pointer">
                      <MdModeEditOutline
                        onClick={(id) => {
                          changeModalState();
                          checkid(k.id);
                          handleOpenModal()
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        
        </div>
        {showEditModal ? (
          <>
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Edit KPI Target">
            <EditKpiTargetModal rowdata={rowdata} handleCloseModal ={handleCloseModal} />
        
      </Modal>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default KpiDataTable;
