import React from 'react'

const GivenBadges = () => {
  return (
    <>
      <div className="grid grid-cols-7">
        <div className="badge-card relative bg-[#687FE5]  rounded-xl pt-8 pb-5"  style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          }}>
          <div className="flex flex-col justify-between items-center gap-5"
          >
            <p className='text-white text-2xl font-bold'>Aalain</p>
            <p className='text-white text-xl'>This is a test comment</p>
            <button className='text-black bg-white p-2 font-bold text-xl w-[100px] cursor-pointer rounded-xl'>
              View
            </button>
          </div>
          <div className="absolute top-0 right-0 bg-[#FDFFAB] text-xl px-5 font-semibold rounded">
            Pending
          </div>
        </div>
      </div>
    </>
  )
}

export default GivenBadges
