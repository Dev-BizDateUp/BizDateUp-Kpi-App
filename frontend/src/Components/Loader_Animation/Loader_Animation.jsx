import React from 'react'
// import "../../../src/App.css"
const Loader_Animation = () => {
  return (
   <>
  <style>
    {`
      @keyframes moveLogoDown {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-100vh);
        }
      }

      .animate-delayedMove {
        animation: moveLogoDown 1s ease-in-out 3s forwards;
      }
    `}
  </style>

  <div className="animate-delayedMove z-10000 transition-transform absolute top-0 h-screen w-screen bg-[#f7f7f7] flex items-center justify-center">
    <div className="">
      <img
        src="https://www.bizdateup.com/assets/images/logo.svg"
        alt="Logo"
        className="w-48 h-48"
      />
    </div>
  </div>
</>

  )
}

export default Loader_Animation