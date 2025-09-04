import React, { useContext, useEffect, useState } from 'react'
import image from  "../../assets/Badges/received_badge.png"
import { GetterContext } from '../Context/NewContext'
import { get_all_approved_badges_for_particular_emp } from '../../Api/Endpoints/BadgesEndpoints.js/endpoint'
const ReceivedBadges = () => {
  const {userData} = useContext(GetterContext)
  const [badge, setbadge] = useState([])
  useEffect(() => {
const fetchBadge = async() => {
  const data = await get_all_approved_badges_for_particular_emp(userData.id)
  setbadge(data.result)
}
fetchBadge()
  }, [])
  return (
<>
  <div className="flex justify-center items-center flex-col">
    <img src={image} alt="" />
    {
      badge?.count > 0 ? 
      <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800">You have received</h1>
      <h1 className="text-4xl font-extrabold text-blue-600">{badge.count} Badgess</h1>
      <h1 className="text-2xl font-bold text-gray-800">So far</h1>
    </div>
    :
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-800">You have received</h1>
      <h1 className="text-4xl font-extrabold text-blue-600">0 Badges</h1>
      <h1 className="text-2xl font-bold text-gray-800">So far</h1>
    </div>
    }
  </div>
</>
  )
}

export default ReceivedBadges
