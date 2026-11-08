'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/tailgrids/core/button'
import { useRouter } from 'next/navigation'
import { checkLogin } from '@/utils/login'

type BallType = 'none' | 'basketball' | 'football' | 'volleyball' | 'face'

// สถานะของลูกบอลในแต่ละเฟรม
interface Ball {
  x: number          // ตำแหน่งแนวนอน 0 -> xMax
  y: number          // ตำแหน่งแนวตั้ง 0 -> yMax
  moveRight: boolean // true = กำลังไปทางขวา, false = ไปทางซ้าย
  moveDown: boolean  // true = กำลังลงล่าง, false = ขึ้นบน
  deg: number        // มุมหมุนปัจจุบัน (องศา)
  degStep: number    // หมุนกี่องศาต่อเฟรม (สุ่มใหม่ทุกครั้งที่ชนขอบ)
}


//  CONSTANTS

const FIELD_WIDTH = 1080  // ความกว้างสนาม (px)
const FIELD_HEIGHT = 540  // ความสูงสนาม (px)
const BALL_RADIUS = 50    // รัศมีลูกบอล (px)
const VELOCITY = 500      // ความเร็ว (px/วินาที)
const FRAME_RATE = 25     // เฟรมต่อวินาที
const FIELD_BORDER = 2    // ความหนาเส้นขอบสนาม (px)
const FIELD_IMAGE = '/field.jpg' // ภาพสนาม

const ballImages: Record<BallType, string | null> = {
  none: null,
  basketball: '/basketball.png',
  football: '/football.png',
  volleyball: '/volleyball.png',
  face: '/face.png',
}

const ballButtons: { type: BallType; label: string }[] = [
  { type: 'none', label: 'None' },
  { type: 'basketball', label: 'Basketball' },
  { type: 'football', label: 'Football' },
  { type: 'volleyball', label: 'Volleyball' },
  { type: 'face', label: 'Face' },
]

// คีย์ลัดบนคีย์บอร์ด -> ชนิดลูกบอล
const keyToBall: Partial<Record<string, BallType>> = {
  '0': 'none',
  '1': 'basketball',
  '2': 'football',
  '3': 'volleyball',
  '4': 'face',
}

const BALL_DIAMETER = BALL_RADIUS * 2
const X_MAX = FIELD_WIDTH - BALL_DIAMETER - FIELD_BORDER * 2
const Y_MAX = FIELD_HEIGHT - BALL_DIAMETER - FIELD_BORDER * 2
const STEP = VELOCITY / Math.SQRT2 / FRAME_RATE

const initialBall: Ball = { x: 0, y: 0, moveRight: true, moveDown: true, deg: 0, degStep: 2 }

// สุ่มความเร็วหมุน 1-10 องศาต่อเฟรม
const randomDegStep = () => Math.floor(Math.random() * 10) + 1

// เคลื่อนที่ 1 แกน: ชนขอบแล้วสะท้อนกลับ (ระยะที่เลยขอบจะถูกสะท้อนเข้ามา)
const moveAxis = (pos: number, forward: boolean, step: number, max: number) => {
  let next = forward ? pos + step : pos - step
  let bounced = false

  if (next >= max) {          // ชนขอบด้านปลาย (ขวา/ล่าง)
    next = max - (next - max)
    forward = false
    bounced = true
  } else if (next <= 0) {     // ชนขอบด้านต้น (ซ้าย/บน)
    next = -next
    forward = true
    bounced = true
  }

  // กันหลุดสนามกรณี step ใหญ่มาก
  next = Math.min(Math.max(next, 0), max)
  return { pos: next, forward, bounced }
}

// คำนวณเฟรมถัดไปของลูกบอล
const nextFrame = (ball: Ball): Ball => {
  const x = moveAxis(ball.x, ball.moveRight, STEP, X_MAX)
  const y = moveAxis(ball.y, ball.moveDown, STEP, Y_MAX)

  // ชนขอบแกนไหนก็ตาม -> สุ่มความเร็วหมุนใหม่
  const degStep = x.bounced || y.bounced ? randomDegStep() : ball.degStep

  return {
    x: x.pos,
    y: y.pos,
    moveRight: x.forward,
    moveDown: y.forward,
    degStep,
    deg: (ball.deg + degStep) % 360,
  }
}

export default function Page() {
    const router = useRouter()
  useEffect(() => { checkLogin(router, '/animation') }, [router])

  const [running, setRunning] = useState<boolean>(false)
  const [ballType, setBallType] = useState<BallType>('none')
  const [ball, setBall] = useState<Ball>(initialBall)
  const ballRef = useRef<Ball>(initialBall)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      ballRef.current = nextFrame(ballRef.current)
      setBall(ballRef.current)
    }, 1000 / FRAME_RATE)
    return () => clearInterval(id)
  }, [running])

  // ---- คีย์บอร์ด: Space = Run/Pause, 0-4 = เลือกลูกบอล ----
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
        if (!e.repeat) setRunning((r) => !r)
        return
      }
      const type = keyToBall[e.key]
      if (type) setBallType(type)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // true = ฟังแบบ capture (ทำงานก่อนปุ่มและก่อน handler ของไลบรารี)
    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('keyup', onKeyUp, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keyup', onKeyUp, true)
    }
  }, [])

  const image = ballImages[ballType]

  return (
    <>
      {/* หัวข้อ/คะแนน (ตอนนี้เป็นค่าตายตัว 00) */}
      <h1 className='mt-3 text-center text-3xl font-bold'></h1>

      {/* กล่องรวมทั้งหมด กว้างเท่าสนาม จัดกึ่งกลาง */}
      <div className='mx-auto mt-3 w-fit'>

        {/* สนาม: ใช้รูปสนามเป็นพื้นหลัง */}
        <div
          className='relative rounded-xl border-2 border-black bg-cover bg-center'
          style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            backgroundImage: `url(${FIELD_IMAGE})`,
          }}
        >
          {/* ลูกบอล: เลื่อนด้วย left/top และหมุนด้วย rotate */}
          <div
            className='absolute rounded-full border-2 border-white bg-gray-300 bg-cover bg-center'
            style={{
              width: BALL_DIAMETER,
              height: BALL_DIAMETER,
              left: ball.x,
              top: ball.y,
              backgroundImage: image ? `url(${image})` : undefined,
              transform: `rotate(${ball.deg}deg)`,
            }}
          />
        </div>

        {/* แถวปุ่มควบคุม */}
        <div className='mt-2 flex justify-between gap-4'>
          {/* ปุ่ม Run / Pause */}
          <Button
            variant={running ? 'danger' : 'success'}
            onClick={(e) => {
              setRunning((r) => !r)
              e.currentTarget.blur()
            }}
          >
            {running ? '⏸ Pause' : '▶ Run'}
          </Button>

          {/* ปุ่มเลือกลูกบอล (ปุ่มที่เลือกอยู่จะเป็นสีทึบ) */}
          <div className='flex justify-end gap-2'>
            {ballButtons.map(({ type, label }) => (
              <Button
                key={type}
                variant='primary'
                appearance={ballType === type ? undefined : 'outline'}
                onClick={() => setBallType(type)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* คำใบ้คีย์ลัด */}
        <p className='mt-2 text-center text-sm text-gray-500'>
          Space = Run/Pause &nbsp;|&nbsp; 0-4 = เลือกลูกบอล
        </p>
      </div>
    </>
  )
}