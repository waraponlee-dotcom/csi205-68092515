'use client'
import { Backdrop } from "@/components/tailgrids/core/overlay";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose
} from "@/components/tailgrids/core/dialog";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/tailgrids/core/input-group";
import { EyeDisabled, Keyboard } from "@tailgrids/icons";
import { login } from "@/data/credentials";
import { useRouter } from "next/navigation";

export default function Page () {

    const router = useRouter()

    const handlelogin = () => {
        //ext data
        const userDom = document.getElementById('user') as HTMLInputElement
        const passDom = document.getElementById('pass') as HTMLInputElement
        const user = userDom.value.trim()
        const pass = passDom.value.trim()

        //validate
        if (user === ''){
            alert('err user is required')
            userDom.focus()
            return
        }
        if (pass === ''){
            alert('err password is required')
            passDom.focus()
            return
        }
        //user pass is okey
        login(`${user}@company.com`, pass)
        .then(credential => {
            localStorage.setItem('credential', JSON.stringify(credential))
            const returnPath = localStorage.getItem('returnPath') || '/'
            localStorage.removeItem('returnPath')
            router.replace(returnPath)
            router.refresh()
        })
        .catch(errString => {
            alert(`err: ${errString}`)
            userDom.value = ''
            passDom.value = ''
            userDom.focus()
        })
    }

    return(
        <Backdrop isOpen={true}>
        <Dialog showCloseButton={false} className="w-md">
            <DialogHeader>
                <DialogTitle className="text-center">Who are u</DialogTitle>
            </DialogHeader>

            <DialogBody>

                <InputGroup>
                    <InputGroupAddon>
                        <Keyboard/>
                    </InputGroupAddon>
                    <InputGroupInput id="user" type="text" placeholder="user | manager | admin" autoComplete="username"/>
                    <InputGroupAddon align='inline-end'>
                        @company.com
                    </InputGroupAddon>
                </InputGroup>
                <InputGroup className="mt-2">
                    <InputGroupAddon>
                        <EyeDisabled/>
                    </InputGroupAddon>
                    <InputGroupInput
                        id="pass"
                        type="password"
                        placeholder="pass"
                        autoComplete="current-password"
                        onKeyDown={(e) => { if (e.key === 'Enter') handlelogin() }}
                    />
                </InputGroup>

            </DialogBody>

            <DialogFooter>
                <DialogClose appearance='outline' onClick={() => handlelogin()}>Login</DialogClose>
            </DialogFooter>
        </Dialog>
        </Backdrop>
    )
}