"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation'
export default function Home() {

  const router=useRouter();

  const onclickMe=()=>{
    router.push('/dashboard/')
  }
  return (
   <div className="flex flex-col p-5 gap-5 justify-center items-center">


    <h2 className="text-bold text-5xl text-blue-700 ">Welcome to Pro-interview</h2>
    <Button variant='outline' onClick={onclickMe}>Click me to proceed</Button>
    {/* router.push('C:/Users/anura/OneDrive/Desktop/AI Mock Interview/ai-mock-interview/app/(auth)/sign-in/[[...sign-in]]') */}
   </div>
   
  );
}
