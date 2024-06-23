"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import Link from 'next/link';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null); // Initialize as null initially
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const webcamIconRef = useRef(null); // Reference to the WebcamIcon element
  const [buttonWidth, setButtonWidth] = useState('auto'); // State to store the button width

  useEffect(() => {
    console.log(params.interviewId);
    GetInterviewDetails();
  }, [params.interviewId]); // Watch for changes in interviewId

  useEffect(() => {
    // Update the button width based on the WebcamIcon width
    if (webcamIconRef.current) {
      setButtonWidth(`${webcamIconRef.current.offsetWidth}px`);
    }
  }, [webcamIconRef.current]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      setInterviewData(result[0]); // Assuming result is an array, set the first item
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  if (!interviewData) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
        <div className='flex flex-col my-5 gap-5'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'>
              <strong>Job Role/Position: </strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className='text-lg'>
              <strong>Job Description: </strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className='text-lg'>
              <strong>Years of Experience: </strong>
              {interviewData.jobExperience}
            </h2>
          </div>
          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100 '>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
            <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300
              }}
            />
          ) : (
            <>
              <div ref={webcamIconRef}>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
              </div>
              <Button variant="ghost" onClick={() => setWebCamEnabled(true)} style={{ width: buttonWidth }}>
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='flex justify-end items-end'>
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
      <Button>Start Interview</Button>
      </Link>
    </div>
    </div>
  );
}

export default Interview;
