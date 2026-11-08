'use client'

import {
  NativeSelect,
  NativeSelectOption
} from "@/components/tailgrids/core/native-select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { TextField } from "@/components/tailgrids/core/text-field";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { ClockThree, Check, Plus, Trash1 } from "@tailgrids/icons";
import { Badge } from "@/components/tailgrids/core/badge";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchTodos } from "@/data/todos";
import type { TodoType } from "@/data/todos";

import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { Toggle } from "@/components/tailgrids/core/toggle";
import { checkLogin } from "@/utils/login";

export default function Page() {
  const router = useRouter()
  useEffect(() => { checkLogin(router, '/todo') }, [router])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [todosRaw, setTodosRaw] = useState<TodoType[]>([])
  const [todos, setTodos] = useState<TodoType[]>([])
  const [onlyWaitting, setOnlyWaiting] = useState<boolean>(false)
  const [itemsPerPage, setItemsPerPage] = useState<number>(5)

  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(0)

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>('')

  // onloed

  useEffect(() => {
    const _todoRawStr = localStorage.getItem('todoRaw')
    if (_todoRawStr === null) {
      // setTodosRaw([])
      fetchTodos()
        .then(data => setTodosRaw(data as TodoType[]))
        .catch(() => setTodosRaw([]))
        .finally(() => setIsLoading(false))
    } else {
      setTodosRaw(JSON.parse(_todoRawStr) as TodoType[])
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // ไม่บันทึกตอนยังโหลดไม่เสร็จ ไม่งั้นค่าว่าง [] จะไปทับข้อมูลเดิมใน localStorage
    if (isLoading) return
    localStorage.setItem('todoRaw', JSON.stringify(todosRaw))
  }, [todosRaw, isLoading])

  // useEffect(() => {
  //   fetchTodos()
  //     .then((data) => setTodosRaw(data as TodoType[]))
  //     .catch(() => setTodosRaw([]))
  //     .finally(() => setIsLoading(false))
  // }, [])

  useEffect(() => {
    onlyWaitting
      ? setTodos(todosRaw.filter((todo) => todo.completed === false))
      : setTodos(todosRaw)
  }, [todosRaw, onlyWaitting])

  useEffect(() => {
    setTotalPages(Math.ceil(todos.length / itemsPerPage))
  }, [todos, itemsPerPage])

  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage <= 0) setCurrentPage(1)
      else if (currentPage > totalPages) setCurrentPage(totalPages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages])

  // handle F
  // delete
  const deleteTodo = (id: number) => {
    //update todoR
    setTodosRaw(todosRaw.filter((todo) => todo.id !== id))
  }

  //make D
  const makeDone = (id: number) => {

    // [ {1}, {2}, {3} ]
    //    ^
    //pointer
    const selected = todosRaw.find((todo) => {
      return todo.id === id
    })
    // edit
    selected!.completed = true
    setTodosRaw([...todosRaw])

  }
  //addTodo
  const addTodo = () => {
    const title = newTitle.trim()
    if (!title) return
    const newTodo: TodoType = {
      userId: 1,
      id: todosRaw.reduce((p, t) => (t.id > p ? t.id : p), 0) + 1,
      title,
      completed: false,
    }
    setTodosRaw([...todosRaw, newTodo])
    setNewTitle('')
  }

  return (
    //todo content
    <>

      <div className='mt-4 px-2 max-w-3xl mx-auto'>
        {/* control */}

        <div className="flex justify-between">
          {/* toggle */}
          <div className='flex items-center'>
            <Toggle label='Show only' checked={onlyWaitting} onChange={(e) => setOnlyWaiting(e.target.checked)} />
            &nbsp;
            <Button
              size="sm"
              className='h-8 p-2 bg-yellow-500 
                    pointer-events-none'
            >
              Waitting
              <ClockThree />
            </Button>
          </div>
          {/* dropdown */}
          <div>
            <NativeSelect value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <NativeSelectOption value={5}>5 items per page</NativeSelectOption>
              <NativeSelectOption value={10}>10 items per page</NativeSelectOption>
              <NativeSelectOption value={20}>20 items per page</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        {/* table */}
        <div className='mt-1'>
          <TableRoot>
            {/* <TableHeader>
                        <TableRow className="bg-black text-white">
                            <TableHead className='w-24 font-bold text-right' >ID</TableHead>
                            <TableHead className='font-bold text-center'>Title</TableHead>
                            <TableHead className='font-bold flex justify-end items-center gap-1 text-right w-1/5'>
                                Completed
                                <Button variant={'primary'} className="h-8 p-2">
                                    <Plus />
                                </Button>
                            </TableHead>
                        </TableRow>
            </TableHeader> */}
            <TableHeader>
              <TableRow className="bg-black text-white">
                <TableHead className='w-24 font-bold text-right'>ID</TableHead>
                <TableHead className='font-bold text-center'>Title</TableHead>
                <TableHead className='w-1/5 font-bold text-right'>
                  {/* ใช้ div ข้างในจัดการ flex แทน */}
                  <div className="flex items-center justify-end gap-1">
                    Completed
                    <Button onClick={() => setShowDialog(true)} variant={'primary'} className="h-8 p-2">
                      <Plus />
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {isLoading && (<TableRow>
                <TableCell colSpan={3}>
                  <Spinner className='mx-auto' type="default" />
                </TableCell>
              </TableRow>)}

              {!isLoading && todos.length === 0 &&
                <TableRow><TableCell colSpan={3}
                  className="text-center text-red-500 texr-lg font-bold"
                >Loading...(no data available)</TableCell>
                </TableRow>}

              {/* {obj -> htmltag} */
                todos.filter((todo, index) => {
                  const lower = (currentPage - 1) * itemsPerPage
                  const upper = currentPage * itemsPerPage - 1
                  return index >= lower && index <= upper
                })

                  .map((todo) => {
                    return (
                      <TableRow key={todo.id}>
                        <TableCell className='text-right'>
                          <Badge
                            size='lg'
                            className='rounded-lg bg-gray-500 text-white font-bold px-2 py-1'
                          >
                            {todo.id}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {todo.title}
                        </TableCell>
                        <TableCell className='flex justify-end gap-1' >

                          {todo.completed ?

                            <Button
                              size='sm'
                              className='h-8 bg-green-700 text-white pointer-events-none'
                            >
                              Done
                              <Check />
                            </Button>
                            :
                            <Button
                              size='sm'
                              className='h-8 p-2 bg-yellow-500 hover:bg-yellow-700 hover:text-yellow-300'
                              onClick={() => makeDone(todo.id)}
                            >
                              Waiting
                              <ClockThree />
                            </Button>
                          }

                          <Button onClick={() => deleteTodo(todo.id)} variant='danger' className='h-8 p-2'>
                            <Trash1 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
              }

              {/* false */}
              {/* <TableRow>
              <TableCell className='text-right'>
                <Badge
                  size='lg'
                  className='rounded-lg bg-gray-500 text-white font-bold px-2 py-1'
                >
                  12
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor</TableCell>
              <TableCell className='flex justify-end gap-1' >
                <Button
                  size='sm'
                  className='h-8 p-2 bg-yellow-500 hover:bg-yellow-700 hover:text-yellow-300'
                >
                  Waiting
                  <ClockThree />
                </Button>
                <Button variant='danger' className='h-8 p-2'>
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}

              {/* true */}
              {/* <TableRow>
              <TableCell className='text-right'>
                <Badge
                  size={'lg'}
                  className='rounded-lg bg-gray-500 text-white font-bold px-2 py-1'
                >
                  1234
                </Badge>
              </TableCell>
              <TableCell>Lorem ipsum dolor</TableCell>
              <TableCell className='flex justify-end gap-1' >
                <Button
                  size='sm'
                  className='h-8 bg-green-700 text-white pointer-events-none'
                >
                  Done
                  <Check />
                </Button>
                <Button variant='success' className='h-8 p-2'>
                  <Trash1 />
                </Button>
              </TableCell>
            </TableRow> */}

            </TableBody>
          </TableRoot>
        </div>

        {/* paggination */}
        {todos.length > 0 && (
          <div className="mt-1 w-1/3 mx-auto flex justify-center items-center gap-1">
            <Button size='sm' appearance='outline' onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </Button>
            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                sideLayout="icon">
              </Pagination>
            </div>
            <Button size='sm' appearance='outline' onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              Last
            </Button>
          </div>
        )}
      </div>

      <Backdrop isOpen={showDialog} onOpenChange={setShowDialog}>
        <Dialog>

          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl gap-2"> <Plus className='bg-blue-100 rounded-md' size={32} />New todo </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <TextField className="flex flex-col gap-1.5">
                <Label className='font-bold' >ID (Auto)</Label>
                <Input
                  className="w-full pointer-events-none bg-gray-100 text-gray-500"
                  value={todosRaw.reduce((p, t) => (t.id > p ? t.id : p), 0) + 1}
                  readOnly
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label className='font-bold'>Title</Label>
                <Input
                  placeholder="ใส่งานลงไปเพิ่ม"
                  className="w-full"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </TextField>

            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <DialogClose onClick={addTodo}>Add todo</DialogClose>
          </DialogFooter>

        </Dialog>
      </Backdrop>

    </>
  )
}