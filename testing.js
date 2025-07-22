'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1)

  const {
    control,
    handleSubmit,
    getValues,
  } = useForm({
    defaultValues: {
      companyName: '',
      subdomain: '',
      address: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const onSubmit = (data) => {
    console.log('Form submitted:', data)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Company Name *" />
              )}
            />
            <div className="flex items-center gap-2">
              <Controller
                name="subdomain"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth placeholder="Subdomain" />
                )}
              />
              <span className="text-gray-600 font-medium">.ihubconnect.com</span>
            </div>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Address" />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Phone Number" type="tel" />
              )}
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="First Name" />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Last Name" />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Email Address" type="email" />
              )}
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Password" type="password" />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="Confirm Password" type="password" />
              )}
            />
          </div>
        )
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Enter Company's Details"
      case 2:
        return 'Enter Personal Details'
      case 3:
        return 'Set-up your Password'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 max-w-md">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-gray-900">LOGO</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register your Company</h2>
            <p className="text-gray-600">{getStepTitle()}</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Step {currentStep}/3</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-1 rounded-full ${
                    step <= currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
            {renderStep()}

            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  variant="outlined"
                  onClick={prevStep}
                  className="flex items-center justify-center w-12 h-12"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  variant="contained"
                  onClick={nextStep}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <Image
          src="/images/security.png"
          alt="Hands typing on laptop keyboard"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
