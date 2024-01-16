'use client'
import {useEffect} from "react";
import {redirect} from 'next/navigation'

export const Page = () => {
    useEffect(() =>  {
        redirect("/dashboard/Stock")
    }, [])

    return <></>
}

export default Page
