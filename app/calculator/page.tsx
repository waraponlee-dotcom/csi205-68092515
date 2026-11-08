'use client'

import { useEffect, useReducer, type ReactNode } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";

  

type Operator = '+' | '-'
type Phase = 'first' | 'operator' | 'second' | 'result'
type Color = 'green' | 'red' | 'purple'

interface CalcState {
  phase: Phase              
  display: string           
  first: number             
  operator: Operator | null 
  error: boolean            
}

// คำสั่งที่ปุ่มต่าง ๆ ส่งไปให้ reducer
type CalcAction =
  | { type: 'digit'; digit: string }         
  | { type: 'operator'; operator: Operator }  
  | { type: 'equals' }                        
  | { type: 'clearEntry' }                    

const MAX_DIGITS = 9

const initialState: CalcState = {
  phase: 'first',
  display: '0',
  first: 0,
  operator: null,
  error: false,
}

const countDigits = (s: string) => s.replace('-', '').length
const calculate = (a: number, b: number, op: Operator) => (op === '+' ? a + b : a - b)

const withResult = (
  state: CalcState,
  value: number,
  phase: Phase,
  operator: Operator | null,
): CalcState => {
  const text = String(value)
  if (countDigits(text) > MAX_DIGITS)
    return { ...initialState, phase: 'result', display: 'Error', error: true }
  return { ...state, phase, display: text, first: value, operator, error: false }
}

// reducer : รับ state เดิม + คำสั่ง แล้วคืน state ใหม่
const reducer = (state: CalcState, action: CalcAction): CalcState => {
  switch (action.type) {

    // ---- กดตัวเลข ----
    case 'digit':
      switch (state.phase) {
        case 'first':
        case 'second':
          // พิมพ์เกิน 9 หลักไม่ได้
          if (countDigits(state.display) >= MAX_DIGITS) return state
          // ถ้าหน้าจอเป็น 0 ให้แทนที่ ไม่งั้นต่อท้าย
          return {
            ...state,
            display: state.display === '0' ? action.digit : state.display + action.digit,
          }
        case 'operator':
          // เพิ่งกดเครื่องหมาย -> เริ่มพิมพ์ตัวเลขตัวที่สอง
          return { ...state, phase: 'second', display: action.digit }
        case 'result':
          // หลังกด = หรือ Error -> เริ่มคำนวณใหม่
          return { ...initialState, display: action.digit }
      }

    case 'operator':
      if (state.error) return state // Error อยู่ ต้องกด CE ก่อน
      switch (state.phase) {
        case 'first':
        case 'result':
          // เก็บตัวเลขบนจอเป็นตัวแรก แล้วรอตัวที่สอง
          return { ...state, phase: 'operator', first: Number(state.display), operator: action.operator }
        case 'operator':
          // กดเครื่องหมายซ้ำ = เปลี่ยนเครื่องหมาย
          return { ...state, operator: action.operator }
        case 'second':
          // กดต่อเนื่อง เช่น 1 + 2 + -> คำนวณ 3 ให้ก่อน แล้วรอตัวถัดไป
          return withResult(
            state,
            calculate(state.first, Number(state.display), state.operator as Operator),
            'operator',
            action.operator,
          )
      }

    case 'equals':
      // ต้องมีตัวเลขสองตัวและเครื่องหมายครบก่อนถึงจะคำนวณ
      if (state.phase !== 'second' || state.operator === null) return state
      return withResult(state, calculate(state.first, Number(state.display), state.operator), 'result', null)

    // ---- กด CE (ล้างตัวเลขที่กำลังพิมพ์) ----
    case 'clearEntry':
      if (state.error) return initialState // ถ้า Error ให้รีเซ็ตทั้งหมด
      return { ...state, display: '0', phase: state.phase === 'operator' ? 'second' : state.phase }
  }
}

// จัดรูปแบบตัวเลขให้อ่านง่าย เช่น 123456789 -> "123 456 789", -1234 -> "-1 234"
const formatDisplay = (display: string, groupSize = 3) => {
  if (display === 'Error') return display
  const negative = display.startsWith('-')
  const digits = negative ? display.slice(1) : display
  let out = ''
  for (let i = 0; i < digits.length; i++) {
    const fromEnd = digits.length - i
    out += digits[i]
    if (fromEnd > 1 && (fromEnd - 1) % groupSize === 0) out += ' '
  }
  return (negative ? '-' : '') + out
}

const colorClass: Record<Color, string> = {
  green: 'from-white to-[rgb(154,255,179)]',
  red: 'from-white to-[rgb(253,173,163)]',
  purple: 'from-white to-[rgb(190,210,255)]',
}

export default function Page() {

  const router = useRouter()
  useEffect(() => { checkLogin(router, '/calculator') }, [router])
  // state ของเครื่องคิดเลข + dispatch สำหรับส่งคำสั่ง
  const [state, dispatch] = useReducer(reducer, initialState)

  const digit = (d: string) => dispatch({ type: 'digit', digit: d })
  const plus = () => dispatch({ type: 'operator', operator: '+' })
  const minus = () => dispatch({ type: 'operator', operator: '-' })
  const equals = () => dispatch({ type: 'equals' })
  const clearEntry = () => dispatch({ type: 'clearEntry' })

  // รับการกดคีย์บอร์ด: 0-9, +, -, = หรือ Enter, Esc (CE)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && e.key >= '0' && e.key <= '9') dispatch({ type: 'digit', digit: e.key })
      else if (e.key === '+') dispatch({ type: 'operator', operator: '+' })
      else if (e.key === '-') dispatch({ type: 'operator', operator: '-' })
      else if (e.key === '=' || e.key === 'Enter') dispatch({ type: 'equals' })
      else if (e.key === 'Escape') dispatch({ type: 'clearEntry' })
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [dispatch])

  // ถ้าไม่ส่ง onClick มา = ปุ่มนี้ยังไม่มีฟังก์ชัน จะ disabled อัตโนมัติ
  const key = (label: string, color: Color, onClick?: () => void) => (
    <Button
      size='sm'
      key={label}
      onClick={onClick}
      disabled={!onClick}
      className={`h-20 w-20 p-0 rounded-2xl border-2 border-gray-500 bg-linear-to-br text-[2rem] font-bold text-black disabled:cursor-not-allowed disabled:opacity-60 ${colorClass[color]}`}
    >
      {label}
    </Button>
  )

  // สร้างแถวปุ่ม 1 แถว (ปุ่มกระจายเต็มความกว้าง เว้นบน 10px = 5px x 2)
  const row = (keys: ReactNode[]) => <div className='mt-2.5 flex justify-between'>{keys}</div>

  return (
    // ครอบทั้งหน้า จัดเครื่องคิดเลขให้อยู่กลางจอ
    <div className='grid h-screen place-items-center'>
      <div className='min-w-122.5 text-center font-sans'>
        <div className='rounded-t-[36px] border-6 border-black bg-[rgb(73,73,73)]'>
          <div className='rounded-[30px] border-10 border-gray-500 bg-linear-to-br from-white to-[rgb(128,127,127)] p-2.5'>

            {/* หน้าจอแสดงตัวเลข ชิดขวา */}
            <div className='mb-10 flex h-20 items-center justify-end rounded-2xl border-2 border-gray-500 bg-[rgb(218,241,241)] pr-4 text-5xl'>
              {formatDisplay(state.display)}
            </div>

            {row([key('MC', 'green'), key('MR', 'green'), key('M+', 'green'), key('M-', 'green'), key('CE', 'red', clearEntry)])}
            {row([key('7', 'purple', () => digit('7')), key('8', 'purple', () => digit('8')), key('9', 'purple', () => digit('9')), key('÷', 'green'), key('√', 'green')])}
            {row([key('4', 'purple', () => digit('4')), key('5', 'purple', () => digit('5')), key('6', 'purple', () => digit('6')), key('x', 'green'), key('%', 'green')])}
            {row([key('1', 'purple', () => digit('1')), key('2', 'purple', () => digit('2')), key('3', 'purple', () => digit('3')), key('-', 'green', minus), key('1/x', 'green')])}
            {row([key('0', 'purple', () => digit('0')), key('.', 'purple'), key('±', 'purple'), key('+', 'green', plus), key('=', 'green', equals)])}
          </div>
        </div>
      </div>
    </div>
  )
}