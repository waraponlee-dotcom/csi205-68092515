'use client'

import { Badge } from '@/components/tailgrids/core/badge'

//  ข้อมูลส่วนตัว (แก้ตรงนี้ที่เดียว)

const PROFILE_IMAGE = '/profile.jpg' // วางรูปไว้ที่ public/profile.jpg

const profile = {
  name: 'วรพล',
  surname: 'ลีลาทนาพร',
  age: 20,
  university: 'ศรีปทุม',
  year: 2,
  faculty: 'เทคโนโลยีสารสนเทศ',
  major: 'วิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์',
}

// ความสามารถ: แต่ละกลุ่มมีหัวข้อ + รายการ
const skillGroups: { title: string; skills: string[] }[] = [
  { title: 'Programming', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript'] },
  { title: 'Framework / Tools', skills: ['React', 'Next.js', 'Tailwind CSS', 'Git'] },
  { title: 'Soft skills', skills: ['Teamwork', 'Problem Solving', 'Communication'] },
]

// แถวข้อมูลส่วนตัว: [ป้าย, ค่า]
const infoRows: [string, string][] = [
  ['ชื่อ-สกุล', `${profile.name} ${profile.surname}`],
  ['อายุ', `${profile.age} ปี`],
  ['มหาวิทยาลัย', profile.university],
  ['ชั้นปี', `ปี ${profile.year}`],
  ['คณะ', profile.faculty],
  ['สาขา', profile.major],
]

export default function Page() {
  return (
    <div className='mx-auto mt-4 max-w-4xl px-2 pb-8'>
      {/* การ์ดหลัก */}
      <div className='flex flex-col gap-8 rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-md md:flex-row'>

        {/* ซ้าย: รูป + ข้อมูลส่วนตัวใต้รูป */}
        <div className='flex w-full flex-col items-center md:w-2/5'>
          <div
            className='h-64 w-64 rounded-2xl border-2 border-gray-500 bg-gray-200 bg-cover bg-center'
            style={{ backgroundImage: `url(${PROFILE_IMAGE})` }}
          />

          <h1 className='mt-4 text-2xl font-bold'>
            {profile.name} {profile.surname}
          </h1>

          <dl className='mt-3 w-full divide-y divide-gray-200 text-sm'>
            {infoRows.map(([label, value]) => (
              <div key={label} className='flex justify-between gap-4 py-1.5'>
                <dt className='text-gray-500'>{label}</dt>
                <dd className='text-right font-medium'>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ขวา: ความสามารถ */}
        <div className='flex-1'>
          <h2 className='text-xl font-bold'>ความสามารถ</h2>

          <div className='mt-4 flex flex-col gap-5'>
            {skillGroups.map(({ title, skills }) => (
              <section key={title}>
                <h3 className='mb-2 font-semibold text-gray-700'>{title}</h3>
                <div className='flex flex-wrap gap-2'>
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      size='lg'
                      className='rounded-lg bg-gray-700 px-2 py-1 font-bold text-white'
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
