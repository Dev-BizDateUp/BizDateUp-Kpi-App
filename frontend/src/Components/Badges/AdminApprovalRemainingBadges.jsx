import React, { useContext, useState } from 'react'
import AdminBadgeCard from './AdminBadgeCard'
import { GetterContext } from '../Context/NewContext'
import { approvebadge } from '../../Api/Endpoints/BadgesEndpoints.js/endpoint'
import { ToastContainer } from 'react-toastify'

const AdminApprovalRemainingBadges = () => {
  const { adminbadges, myRole } = useContext(GetterContext)
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
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
