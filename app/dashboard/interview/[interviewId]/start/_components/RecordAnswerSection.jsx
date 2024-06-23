"use client"

import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAIModel';
import { toast } from 'sonner';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import moment from 'moment';

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {

  const [userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  const [loading,setLoading]=useState(false);


  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

useEffect(()=>{
  results.map((result)=>(
    setUserAnswer(prevAns=>prevAns+result?.transcript)
  ))
},[results])
 
useEffect(()=>{
if(!isRecording&&userAnswer.length>10){
  UpdateUserAnswer();
}

 
},[userAnswer])


const StartStopRecording=async()=>{
  if(isRecording)
    {
      
      stopSpeechToText()
      
        
    }
    else{
      startSpeechToText();
    }
  
}



const UpdateUserAnswer=async()=>{

  setLoading(true)
  const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+", User Answer: "+userAnswer+"Depending on the question and the answer given by user for the particular interview question "+"please give us rating for answer and feedback for area of improvement,if any "+"in just 3 to 5 lines to improve it in JSON format with rating field and feedback field"

  const result=await chatSession.sendMessage(feedbackPrompt);

  const mockJsonResp=((result.response.text()).replace('```json','').replace('```',''));

  console.log(mockJsonResp);
  const JsonFeedbackResp=JSON.parse(mockJsonResp);


  const resp=await db.insert(UserAnswer).values({
    mockIdRef:interviewData?.mockId,
          
    question:mockInterviewQuestion[activeQuestionIndex]?.question,
    correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
    userAns:userAnswer,
    feedback:JsonFeedbackResp?.feedback,
    rating:JsonFeedbackResp?.rating,
    userEmail:user?.primaryEmailAddress?.emailAddress,
    createdAt:moment().format('DD-MM-yyyy'),

  })

  if(resp){
    toast('User Answer Recorded Successfully');
    setUserAnswer('');
    setResults([]);
  }
 
  setResults([]);
   
  setLoading(false);
}


  return (
    <div className='flex flex-col justify-center items-center'>
    <div className='flex flex-col mt-20 justify-center items-center  rounded-lg p-5 bg-white border'>
      <Image src={'/webcam.jpg'} width={300} height={200} className='absolute'/>
      <Webcam
      mirrored={true}
      style={{height:300,
        width:'100%',
zIndex:10
      }}
      />
    </div>
    <Button 
    disabled={loading}
    variant="outline" className='my-10' onClick={StartStopRecording}>
      {isRecording?
      
      <h2 className='text-red-600 flex gap-2'><Mic/>Stop Recording </h2>


      :
      <h2 className='text-blue-500 flex gap-2 items-center'>
        <Mic/> Record Answer 
      </h2>
      }
      
      </Button>
    
      



    </div>
  )
}

export default RecordAnswerSection