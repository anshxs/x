'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface PhoneAuthDialogProps {
  open: boolean
}

export default function PhoneAuthDialog({ open }: PhoneAuthDialogProps) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [phase, setPhase] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)

  const fullPhone = `+91${phone}`

  const sendOtp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone })
    setLoading(false)

    if (error) {
      toast.error('Failed to send OTP', { description: error.message })
    } else {
      toast.success('OTP sent', { description: 'Check your phone for the code.' })
      setPhase('otp')
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: 'sms',
    })
    setLoading(false)

    if (error) {
      toast.error('Verification failed', { description: error.message })
      return
    }

    await supabase.from('users').upsert({
      id: data.session?.user.id,
      phone_number: fullPhone,
    })

    toast.success('Signed in successfully')
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-green-300">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {phase === 'phone' ? 'Sign In with Phone' : 'Enter OTP'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {phase === 'phone' ? (
            <>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700">
                  🇮🇳 +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button className="w-full" onClick={sendOtp} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button className="w-full" onClick={verifyOtp} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
