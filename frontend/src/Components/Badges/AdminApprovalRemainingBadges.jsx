import React, { useContext, useState } from 'react'
import AdminBadgeCard from './AdminBadgeCard'
import { GetterContext } from '../Context/NewContext'
import { approvebadge } from '../../Api/Endpoints/BadgesEndpoints.js/endpoint'

const AdminApprovalRemainingBadges = () => {
  const { adminbadges, myRole } = useContext(GetterContext)

  // {
  //     "admin_id":1,
  //     "status":"Approved",
  //     "reason":null,
  //     "badge_id":161
  // }
  const changebadgestatus = async (id, payload) => {
    try {
      const data = await approvebadge(id, payload)
    }
    catch (e) {
    }
  }
  return (
    <>
      {
        adminbadges.length === 0 ? <><h1 className='text-center text-3xl font-bold text-red-600'>No Badges For Approval</h1></> : <div >
          <h1 className="text-2xl font-bold mb-5">Approve Badges</h1>
          <div className="grid grid-cols-4 gap-4">
            {
              adminbadges.map((badge) => (
                <AdminBadgeCard key={badge.id} badge={badge} changebadgestatus={changebadgestatus} />
              ))
            }
          </div>
        </div>
      }

    </>
  )
}

export default AdminApprovalRemainingBadges
