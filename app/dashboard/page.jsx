import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/interviewList'

function Dashboard() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Create your customed Mock Interview</h2>
      <h2 className='text-gray-500'>Start your AI Mockup Interview</h2> 

<div className='grid grid-cols-1 md:grid-cols-3 my-5'>
  <AddNewInterview/>
</div>

  {/* Previous Mock Interviews
   */}
  <InterviewList></InterviewList>
  
    </div>
  )
}

export default Dashboard