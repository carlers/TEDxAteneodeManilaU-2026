import Link from "next/link"

const RegisterButton = () => {
  return (
    <div>
      <Link href="/register">
        <span className="text-nowrap hover:bg-tedx-red hover:text-white text-tedx-red font-bold text-sm xl:text-base px-3 py-2 border-tedx-red border-[1px] rounded-md cursor-pointer transition duration-300">
          REGISTER NOW
        </span>
      </Link>
    </div>
  )
}

export default RegisterButton