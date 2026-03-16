import Link from "next/link"

const RegisterButton = () => {
  return (
    <div className="flex items-center">
      <Link href="/register">
        <span className="inline-flex min-h-9 items-center justify-center text-nowrap rounded-md border-[1px] border-tedx-red px-2 py-1.5 text-xs font-bold text-tedx-red transition duration-300 hover:bg-tedx-red hover:text-white sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm xl:text-base">
          REGISTER NOW
        </span>
      </Link>
    </div>
  )
}

export default RegisterButton
