import React from 'react'
import ShopNavbar from '../Products/ShopNavbar'
import Footer from '../Footer/Footer'

const ShopLayout = ({children}) => {
  return (
    <div>
    <ShopNavbar/>  {/* This will always render */}
    <div className='flex'>
    
    <div><main>{children}</main></div>  {/* This renders whatever is passed as children */}
    </div>
    
    <Footer />  {/* This will always render */}
  </div>
  )
}

export default ShopLayout
