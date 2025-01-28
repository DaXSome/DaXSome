"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


const CreateForm = ()=> {
    const [dbName, setDbName] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)

    const handleOnchange 
    = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDbName(e.target.value);
    }

    const handleDisabled = () => {
        if(dbName.length <= 0) {
            setIsDisabled(true)
            return
        }
        setIsDisabled(false)
    }

    const formatDbName = () => {
        setDbName(prevDbName => prevDbName.replace(/\s+/g, '_'));
    }

    useEffect(()=> {
        handleDisabled()
        formatDbName()
    },[dbName])


    return (
        <div className="w-full h-full flex-1 justify-center place-items-center">
            <h1 className='text-xl font-semibold sm:text-3xl pb-1'>Create Database</h1>

            <div className='w-full bg-gray-50 h-[400px] container flex flex-col place-items-center justify-center relative gap-8'>
                
                <div className='absolute'>
                <Database size={400} className='text-gray-100'/>
                </div>
                <div className='flex flex-col place-items-center z-50'>
                    <label className='font-semibold'>Database Name</label>
                    <Input className='bg-white min-w-[300px] font-semibold' onChange={handleOnchange}/>
                </div>

                <div className='z-50 w-full max-w-[300px]'>

                <Link href={"/datasets/my/manage"}>
                    <Button className='font-bold px-8 w-full' disabled = {isDisabled}>Create</Button>
                </Link>
                </div>

            </div>
        </div>
    );
};

export default CreateForm;
