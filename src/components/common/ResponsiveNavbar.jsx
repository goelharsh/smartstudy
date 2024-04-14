import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { AiOutlineMenu } from "react-icons/ai"
import { NavbarLinks } from "../../data/navbar-links"
import { BsChevronDown } from "react-icons/bs"
import { Link, matchPath, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"


import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"




const ResponsiveNavbar = () => {
    const [navbarIcon, setNavbarIcon] = useState(false);
    const [navbarUI, setNavbarUI] = useState(false);
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const handleNavbarIcon = ()=>{
      setNavbarIcon(!navbarIcon);
      setNavbarUI(!navbarUI)
    }

    const handleCrossIcon = ()=>{
        setNavbarIcon(false)
        setNavbarUI(false)
    }

    const handleOpenIcon = ()=>{
        setNavbarIcon(true)
        setNavbarUI(true)
    }

    const [subLinks, setSubLinks] = useState([])
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])
  return (
    <div className=''>
    
        { navbarUI &&
        <nav className="relative ">
          <ul className="px-10 rounded-md flex flex-col bg-white gap-x-6 text-richblack-800 absolute top-[44px] right-[60px] z-30">
            {NavbarLinks.map((link, index) => (
              <li key={index} className='text-richblack-800 rounded-md p-5 gap-3 mb-3'>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-800"
                      }`}
                    >
                      <p className='p-2 text-richblack-800'>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p className='text-richblack-800' onClick={handleCrossIcon}>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                    onClick={handleCrossIcon}
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-800"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        }
    
        {navbarIcon ? (<RxCross2 fontSize={24} className="text-white" fill="#fff" onClick={handleCrossIcon}/>) : (<AiOutlineMenu className="text-white" fontSize={24} fill="#fff" onClick={handleOpenIcon}/>)}
    
    </div>
  )
}

export default ResponsiveNavbar