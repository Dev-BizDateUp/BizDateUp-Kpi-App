import React, { useContext, useState } from 'react'
import AdminBadgeCard from './AdminBadgeCard'
import { GetterContext } from '../Context/NewContext'
import AdminBadgesTable from './AdminBadgesTable'
import { FaEdit } from "react-icons/fa";
const AdminApprovedBadges = () => {
  const { getalladminbadges } = useContext(GetterContext)
  const [first, setfirst] = useState(getalladminbadges)
  const columns = [
    { key: "id", header: 'Id' },
    { key: 'giver', header: 'Giver Name' },
    { key: 'recipient', header: 'Recipient' },
    { key: 'status', header: 'Status' },
    { key: 'details', header: 'Details' },
    { key: 'edit', header: 'Edit' },
  ];
  const filter_data = first?.map((item) => ({
    id: item.badge_id,
    recipient: item.employees_badges_receiver_idToemployees.name,
    giver: item.employees_badges_user_idToemployees.name,
    status: item.status,
    details: "View",
    edit: <FaEdit />,
    comment: item.comment
  }));


  return (
    <>
      <h1 className='text-2xl font-bold mb-10'>Approved Badges</h1>
      {
        filter_data.length > 0 ? (
          <AdminBadgesTable columns={columns} data={filter_data} />
        ) : (
          <>
            <h1 className='text-red-600 text-center font-bold text-4xl'>
              No Badges Yet
            </h1>
          </>
        )
      }
    </>
  )
}

export default AdminApprovedBadges   