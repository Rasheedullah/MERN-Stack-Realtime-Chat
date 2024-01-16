import React, { useEffect } from 'react'
import { validUser } from '../apis/auth'
import { useNavigate } from "react-router-dom"

import Skeleton from '../utils/skeleton';


function Authentication() {
  const pageRoute = useNavigate()
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser()
      if (!data?.user) {
        pageRoute("/login")
      }
      else {
        pageRoute("/chats")

      }
    }
    isValid()

  }, [pageRoute])
  return (
    <Skeleton/>
  );
}

export default Authentication